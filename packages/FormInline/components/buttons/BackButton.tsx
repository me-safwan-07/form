import { cn } from "@/packages/lib/cn";

interface BackButtonProps {
  onClick: () => void;
  // backButtonLabel?: string;
  tabIndex?: number;
}

export const BackButton = ({ onClick, tabIndex = 2 }: BackButtonProps) => {
  return (
    <button
      dir="auto"
      tabIndex={tabIndex}
      type={"button"}
      className={cn(
        "border-transparent text-slate-900 focus:bg-slate-500 rounded-custom flex items-center border px-3 py-3 text-base font-medium leading-4 shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
      )}
      onClick={onClick}>
      Back
    </button>
  );
};
