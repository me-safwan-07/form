import { Logo } from "@/packages/ui/Logo";

export const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
      <div className="mx-auto w-full max-w-sm rounded-xl bg-white p-8 shadow-xl lg:w-96">
        <div className="mb-8 text-center">
          {/* TODO change the logo to your playform logo in Logo components */}
          <Logo className="mx-auto w-3/4" />
        </div>
        {children}
      </div>
    </div>
  );
};
