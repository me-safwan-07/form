'use client';

import { Button } from "@/packages/ui/Button";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { GoogleButton } from "../../components/GoogleButton";
import { PasswordInput } from "@/packages/ui/PasswordInput";
import { XCircleIcon } from "lucide-react";

interface TSigninFormState {
    email: string;
    password: string;
}

export const SigninForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    // const emailRef = useRef<HTMLInputElement>(null);
    const formMethods = useForm<TSigninFormState>();

    const onSubmit: SubmitHandler<TSigninFormState> = async (data) => {
        setLoggingIn(true);

        try {
            const signInResponse = await signIn("credentials", {
                callbackUrl: searchParams.get("callbackUrl") || "/",
                email: data.email.toLowerCase(),
                password: data.password,
                redirect: false,
            });

            if (signInResponse?.error === "Email Verification is Pending") {
                router.push(`/auth/verification-requested?email=${data.email}`);
                return;
            }

            if (signInResponse?.error) {
                setLoggingIn(false);
                setSignInError(signInResponse.error);
                return;
            }

            if (!signInResponse?.error) {
                router.push(searchParams.get("callbackUrl") || "/");
            }
        } catch (error) {
            const errorMessage = error.toString();
            const errorFeedback = errorMessage.includes("Invalid URL")
                ? "Too many requests, please try again after some time."
                : error.message;
            setSignInError(errorFeedback);
        } finally {
            setLoggingIn(false);
        }
    };

    const [loggingIn, setLoggingIn] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [signInError, setSignInError] = useState("");
    const formRef = useRef<HTMLFormElement>(null);
    const error = searchParams?.get("error");
    const callbackUrl = searchParams?.get("callbackUrl");

    useEffect(() => {
        if (error) {
        setSignInError(error);
        }
    }, [error]);

    return (
        <FormProvider {...formMethods}>
            <div className="text-center">
                <h1 className="mb-4 text-slate-700">Login to your account</h1>
                <div className="space-y-2">
                    <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-2">
                        <div className="mb-2 transition-all duration-500 ease-in-out">
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="work@email.com"
                                defaultValue={searchParams?.get("email") || ""}
                                className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                                {...formMethods.register("email", {
                                required: true,
                                pattern: /\S+@\S+\.\S+/,
                                })}
                            />
                        </div>
                        <div className="transition-all duration-500 ease-in-out">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <Controller
                                name="password"
                                control={formMethods.control}
                                render={({ field }) => (
                                <PasswordInput
                                    id="password"
                                    autoComplete="current-password"
                                    placeholder="*******"
                                    aria-placeholder="password"
                                    onFocus={() => setIsPasswordFocused(true)}
                                    required
                                    className="focus:border-brand focus:ring-brand block w-full rounded-md border-slate-300 shadow-sm sm:text-sm"
                                    {...field}
                                />
                                )}
                                rules={{
                                    required: true,
                                }}
                            />
                        </div>
                        {isPasswordFocused && (
                            <div className="ml-1 text-right transition-all duration-500 ease-in-out">
                                <Link
                                href="/auth/forgot-password"
                                className="hover:text-brand-dark text-xs text-slate-500">
                                Forgot your password?
                                </Link>
                            </div>
                        )}
                        <Button
                            onClick={() => {
                                if (formRef.current) {
                                    formRef.current.requestSubmit();
                                }
                            }}
                            variant="darkCTA"
                            className="w-full justify-center"
                            loading={loggingIn}>
                            Login with Email
                        </Button>
                    </form>

                    <GoogleButton inviteUrl={callbackUrl} />
                </div>

                <div className="mt-9 text-center text-xs">
                    <span className="leading-5 text-slate-500">New to Formbricks?</span>
                    <br />
                    <Link
                    href={"/auth/signup"}
                    className="font-semibold text-slate-600 underline hover:text-slate-700">
                    Create an account
                    </Link>
                </div>
            </div>

            {signInError && (
                <div className="absolute top-10 rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">An error occurred when logging you in</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p className="space-y-1 whitespace-pre-wrap">{signInError}</p>
                    </div>
                    </div>
                </div>
                </div>
            )}
        </FormProvider>
    );
};