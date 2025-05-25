import { getEnvironment, getEnvironments } from "@/packages/lib/environment/service";
import { getProductByEnvironmentId } from "@/packages/lib/product/service";
import { ErrorComponent } from "@/packages/ui/ErrorComponent";
import { TopControlBar } from "./TopControlBar";
// import type { Session } from "next-auth";

interface EnvironmentLayoutProps {
  environmentId: string;
//   session: Session;
  children?: React.ReactNode;
}

export const EnvironmentLayout = async ({ environmentId, children }: EnvironmentLayoutProps) => {
    const environment = await getEnvironment(environmentId);

    if (!environment) {
        return <ErrorComponent />
    }

    const [products, environments] = await Promise.all([
        getProductByEnvironmentId(environmentId),
        getEnvironments(environment.productId)
    ]);

    if (!products || !environments) {
        return <ErrorComponent />
    }

    return (
        <div className="flex h-screen min-h-screen flex-col overflow-hidden">
            <div className="flex h-full">
                <div id="mainContent" className="flex-1 overflow-y-auto bg-slate-50">
                    <TopControlBar
                        environment={environment}
                    />
                    <div className="mt-14">{children}</div>
                </div>
            </div>
            <div className="mt-14">{children}</div>
        </div>

    ) 
};
