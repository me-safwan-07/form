import { getProducts } from "@/packages/lib/product/service";
import { Header } from "@/packages/ui/Header";
import { notFound } from "next/navigation";
import { ProductSettings } from "./components/ProductSettings";
import { DEFAULT_BRAND_COLOR } from "@/packages/lib/constants";

const Page = async ({ params, searchParams }) => {
    const channel = searchParams.channel;
    const industry = searchParams.industry;
    if (!channel || !industry) {
        return notFound();
    }
    // const products = await getProducts(params.organizationId);

    return(
        <div className="flex min-h-full min-w-full flex-coll items-center justify-center space-y-12">
            <Header 
                title="Match your brand, get 2x more responses."
                subtitle="When people recognize your brand, they are much more likely to start and complete responses."
            />
            <ProductSettings 
                organizationId={params.organizationId}
                defaultBrandColor={DEFAULT_BRAND_COLOR}
            />
        </div>
    )
};

export default Page;