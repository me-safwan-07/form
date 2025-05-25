"use client";

import { Button } from "@/packages/ui/Button";
import { ErrorComponent } from "@/packages/ui/ErrorComponent";

// Error components must be Client components

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error.message);
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <ErrorComponent />
      <div className="mt-2">
        <Button variant="secondary" onClick={() => reset()} className="mr-2">
          Try again
        </Button>
        <Button variant="darkCTA" onClick={() => (window.location.href = "/")}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Error;
