'use client';

import { Button } from "@/packages/ui/Button"
import { useRouter } from "next/navigation";

export const InviteMembers = () => {
    const router = useRouter();
    const handleSkip = () => {
        router.push("/");
    }
    return (
        <Button type="button" variant="minimal" className="flex w-80 justify-center" onClick={handleSkip}>
              Skip
        </Button>
    )
}