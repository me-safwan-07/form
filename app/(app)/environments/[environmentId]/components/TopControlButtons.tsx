"use client";

import { TEnvironment } from "@/packages/types/environment";
import { Button } from "@/packages/ui/Button";
import { CircleUserIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TopControlButtonsProps {
  environment: TEnvironment;
  // environments: TEnvironment[];
  // isFormbricksCloud: boolean;
}

export const TopControlButtons = ({
  environment,
  // isFormbricksCloud,
}: TopControlButtonsProps) => {
  const router = useRouter();
  return (
    <div className="z-50 flex items-center space-x-2">
      {/* <EnvironmentSwitch environment={environment} environments={environments} /> */}
      {/* {isFormbricksCloud && (
        <Button
          variant="minimal"
          size="icon"
          tooltip="Share feedback"
          className="h-fit w-fit bg-slate-50 p-1"
          onClick={() => {
            formbricks.track("Top Menu: Product Feedback");
          }}>
          <MessageCircleQuestionIcon className="h-5 w-5" strokeWidth={1.5} />
        </Button>
      )} */}
      <Button
        variant="minimal"
        size="icon"
        tooltip="Account"
        className="h-fit w-fit bg-slate-50 p-1"
        onClick={() => {
          router.push(`/environments/${environment.id}/settings/profile`);
        }}>
        <CircleUserIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        tooltip="New survey"
        className="h-fit w-fit p-1"
        onClick={() => {
          router.push(`/environments/${environment.id}/surveys/templates`);
        }}>
        <PlusIcon strokeWidth={1.5} className="h-5 w-5" />
      </Button>
    </div>
  );
};
