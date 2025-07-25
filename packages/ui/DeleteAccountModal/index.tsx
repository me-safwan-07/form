'use client';

import { Session } from "next-auth";
import { Dispatch, SetStateAction, useState } from "react";
import { DeleteDialog } from "../DeleteDialog";
import { Input } from "../Input";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { deleteUserAction } from "./actions";

interface DeleteAccountModalProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    session: Session;
};

export const DeleteAccountModal = ({
    setOpen,
    open,
    session
}: DeleteAccountModalProps) => {
    const [deleting, setDeleting] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const deleteAccount = async () => {
        try {
            setDeleting(true);
            await deleteUserAction();
            await signOut({ callbackUrl: "/auth/login" })
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
            setOpen(false);
        }
    }

    return (
        <DeleteDialog
            open={open}
            setOpen={setOpen}
            deleteWhat="account"
            onDelete={() => deleteAccount()}
            text="Before you proceed with deleting your account, please be aware of the following consequences:"
            isDeleting={deleting}
            disabled={inputValue !== session.user.email}>
            <div className="py-5">
                <ul className="list-disc pb-6 pl-6">
                <li>Permanent removal of all of your personal information and data.</li>
                <li>
                    If you are the owner of an organization with other admins, the ownership of that organization will
                    be transferred to another admin.
                </li>
                <li>
                    If you are the only member of an organization or there is no other admin present, the organization
                    will be irreversibly deleted along with all associated data.
                </li>
                <li>This action cannot be undone. If it&apos;s gone, it&apos;s gone.</li>
                </ul>
                <form>
                <label htmlFor="deleteAccountConfirmation">
                    Please enter <span className="font-bold">{session.user.email}</span> in the following field to
                    confirm the definitive deletion of your account:
                </label>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={session.user.email}
                    className="mt-5"
                    type="text"
                    id="deleteAccountConfirmation"
                    name="deleteAccountConfirmation"
                />
                </form>
            </div>
        </DeleteDialog>
    )
}