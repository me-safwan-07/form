'use client';

import { Alert, AlertDescription, AlertTitle } from "@/packages/ui/Alert";
import { Button } from "@/packages/ui/Button";
import { DeleteAccountModal } from "@/packages/ui/DeleteAccountModal";
import { Session } from "next-auth";
import { useState } from "react";

interface RemovedFromOrganizationProps {
    session: Session;
}

export const RemovedFromOrganization = ({ session }: RemovedFromOrganization) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="space-y-4">
            <Alert variant="warning">
                <AlertTitle>No membership found!</AlertTitle>
                <AlertDescription>
                    You are not a member of any organization at this time. If you believe this is a mistake, please
                    reach out to the organization owner.
                </AlertDescription>
            </Alert>
            <hr className="my-4 border-slate-200" />
            <p className="text-sm">
                If you want to delete your account, you can do so by clicking the button below.
            </p>
            <DeleteAccountModal 
                open={isModalOpen}
                setOpen={setIsModalOpen}
                session={session}
            />
            <Button variant="darkCTA" onClick={() => setIsModalOpen(true)}>
                Delete account
            </Button>
        </div>
    )
}