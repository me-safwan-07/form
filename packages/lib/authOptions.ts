import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../database/client";
import { verifyPassword } from "./auth/utils";
import { verifyToken } from "./jwt";
import { createUser, getUserByEmail, updateUser } from "./user/service";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./constants";
import { createAccount } from "./account/service";
import { IdentityProvider } from "@prisma/client";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            // The name to display on the sign in form (e.g. "Sign in with..")
            name: "Credentials",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expectin to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: "Email Address",
                    type: "email",
                    placeholder: "Your email address",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Your password",
                },
            },
            // @typescript-eslint/no-unused-vars
            async authorize(credentials, _req) {
                let user;
                try {
                    user = await prisma.user.findUnique({
                        where: {
                            email: credentials?.email,
                        },
                    });
                } catch (e) {
                    console.error(e);
                    throw Error("Internal server error. Please try again later");
                }

                if (!user || !credentials) {
                    throw new Error("No user matches the provided credentials");
                }
                if (!user.password) {
                    throw new Error("No user matches the provided credentials");
                }

                const isValid = await verifyPassword(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("No user matches the provided credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    imageUrl: user.imageUrl,
                };
            },
        }),
        CredentialsProvider({
           id: "token",
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Token",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                token: {
                    label: "Verification Token",
                    type: "string",
                },
            },
            async authorize(credentials, _req) {
                let user;
                try {
                    if (!credentials?.token) {
                        throw new Error("Token not found");
                    }
                    const { id } = await verifyToken(credentials?.token);
                    user = await prisma.user.findUnique({
                        where: {
                            id: id,
                        },
                    });
                } catch (e) {
                    console.error(e);
                    throw new Error("Either a user does not match the provided token or the token is invalid");
                }

                if (!user) {
                    throw new Error("Either a user does not match the provided token or the token is invalid");
                }

                if (user.emailVerified) {
                    throw new Error("Email already verified");
                }

                user = await updateUser(user.id, { emailVerified: new Date() });

                return user;
            },
        }),
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID || "",
            clientSecret: GOOGLE_CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async jwt({ token }) {
            const existingUser = await getUserByEmail(token?.email!);

            if (!existingUser) {
                return token;
            }

            return {
                ...token,
                profile: existingUser || null,
            };
        },
        async session({ session, token }) {
            // @ts-expect-error
            session.user.id = token?.id;
            // @ts-expect-error
            session.user = token.profile;

            return session;
        },
        async signIn({ user, account }: any) {
            if (account.provider === "credentials" || account.provider === "token") {
                if (!user.emailVerified) {
                    throw new Error("Email Verification is Pending");
                }
                return true;
            }

            if (!user.email || account.type !== "oauth") {
                return false;
            }

            if (account.provider) {
                const provider = account.provider.toLowerCase().replace("-", "") as IdentityProvider;
                // check if accounts for this provider / account id already exists
                const existingUserWithAccount = await prisma.user.findFirst({
                    include: {
                        accounts: {
                            where: {
                                provider: account.provider,
                            },
                        },
                    },
                    where: {
                        identityProvider: provider,
                        identityProviderAccountId: account.providerAccountId,
                    },
                });

                if (existingUserWithAccount) {
                    // User with this provider found
                    // Check if email still the same
                    if (existingUserWithAccount.email ===  user.email){
                        return true;
                    }

                    // user seemed to change his email within the provider
                    // check if user with this email already exist
                    // if not found just update user with new email address
                    const otherUserWithEmail = await getUserByEmail(user.email);

                    if (!otherUserWithEmail) {
                        await updateUser(existingUserWithAccount.id, { email: user.email });
                        return true;
                    }
                    throw new Error(
                        "Looks like you updated your email somewhere else. A user with this new email exists already."
                    );
                }

                // There is no existing account for this identity provider / account id
                // Check if user account with this email already exists
                // If user alredy exists throw error and request password login
                const existingUserWithEmail = await getUserByEmail(user.email);

                if (existingUserWithEmail) {
                    throw new Error("A user with this email exists already.");
                }

                const userProfile = await createUser({
                    name: user.name || user.email.split("@")[0],
                    email: user.email,
                    emailVerified: new Date(Date.now()),
                    identityProvider: provider,
                    identityProviderAccountId: account.providerAccountId,
                });

                console.log("Created user profile", userProfile);

                const response = await createAccount({
                    ...account,
                    userId: userProfile.id,
                });

                console.log("Created account", response);

                const updatedNotificationSettings = {
                    ...userProfile.notificationSettings,
                    alert: {
                        ...userProfile.notificationSettings?.alert,
                    },
                };

                await updateUser(userProfile.id, {
                    notificationSettings: updatedNotificationSettings,
                });

                
                return true;
            }
            return true;
        },
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout",
        error: "/auth/login", // Error code passed in query string as ?error=
    },
};