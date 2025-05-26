'use client'

import { env } from "@/packages/lib/env";
import type { Session } from "next-auth";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const posthogEnabled = env.NEXT_PUBLIC_POSTHOG_API_KEY && env.NEXT_PUBLIC_POSTHOG_API_HOST;

interface PosthogIdentifyProps {
    session: Session;
    environmentId?: string;
}

export const PosthogIdentify = ({
    session,
    environmentId,
}: PosthogIdentifyProps) => {
    const posthog = usePostHog();



    useEffect(() => {
        console.log("Session given",session);
        if (posthogEnabled && session.user && posthog) {
            posthog.identify(session.user.id, {
                name: session.user.name,
                email: session.user.email,
            });
            if (environmentId) {
                posthog.group("environment", environmentId, { name: environmentId });
            }
        }
    }, [posthog, session.user,session, environmentId])

    return null;
}