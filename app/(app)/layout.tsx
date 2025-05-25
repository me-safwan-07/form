import { PHProvider, PostHogPageview } from "@/packages/ui/PostHogClient";
import { ToasterClient } from "@/packages/ui/ToasterClient";
import { Suspense } from "react";

const AppLayout = async ({ children }) => {
    // const session = await getServerSession(authOptions);

    return (
        <>
            <Suspense>
                <PostHogPageview />
            </Suspense>
            <PHProvider>
                <>
                    <ToasterClient />
                    {children}
                </>
            </PHProvider>
        </>
    );
};

export default AppLayout;