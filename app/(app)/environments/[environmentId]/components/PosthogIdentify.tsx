'use client'

import { env } from "@/packages/lib/env";
import { TOrganizationBilling } from "@/packages/types/organizations";
import type { Session } from "next-auth";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

const posthogEnabled = env.NEXT_PUBLIC_POSTHOG_API_KEY && env.NEXT_PUBLIC_POSTHOG_API_HOST;

interface PosthogIdentifyProps {
    session: Session;
    environmentId?: string;
    organizationId?: string;
    organizationName?: string;
    organizationBilling?: TOrganizationBilling;
}

export const PosthogIdentify = ({
    session,
    environmentId,
    organizationId,
    organizationName,
    organizationBilling,
}: PosthogIdentifyProps) => {
    const posthog = usePostHog();

    useEffect(() => {
        if (posthogEnabled && session.user && posthog) {
            posthog.identify(session.user.id, {
                name: session.user.name,
                email: session.user.email,
            });
            if (environmentId) {
                posthog.group("environment", environmentId, { name: environmentId });
            }
            if (organizationId) {
                posthog.group("organization", organizationId, {
                name: organizationName,
                plan: organizationBilling?.plan,
                responseLimit: organizationBilling?.limits.monthly.responses,
                miuLimit: organizationBilling?.limits.monthly.miu,
                });
            }
        }
    }, [posthog, session.user, environmentId, organizationId, organizationName, organizationBilling]);

    return null;
}