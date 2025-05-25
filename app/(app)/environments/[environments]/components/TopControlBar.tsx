import { TEnvironment } from "@/packages/types/environment";
import { TopControlButtons } from "./TopControlButtons";


interface SideBarProps {
  environment: TEnvironment
  ;
}

export const TopControlBar = ({ environment }: SideBarProps) => {
  return (
    <div className="fixed inset-0 top-0 z-30 flex h-14 w-full items-center justify-end bg-slate-50 px-6">
      <div className="shadow-xs z-10">
        <div className="flex w-fit items-center space-x-2 py-2">
          {/* {currentProductChannel && currentProductChannel !== "link" && (
            <WidgetStatusIndicator environment={environment} size="mini" type={currentProductChannel} />
          )}
          {!currentProductChannel && (
            <>
              <WidgetStatusIndicator environment={environment} size="mini" type="website" />
              <WidgetStatusIndicator environment={environment} size="mini" type="app" />
            </>
          )} */}
          <TopControlButtons
            environment={environment}
            // isFormbricksCloud={IS_FORMBRICKS_CLOUD}
          />
        </div>
      </div>
    </div>
  );
};
