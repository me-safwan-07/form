import { WEBAPP_URL } from "@/packages/lib/constants";
import { getForm } from "@/packages/lib/form/service";
import { COLOR_DEFAULTS } from "@/packages/lib/styling/constants";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const getMetadataForLinkForm = async (formId: string): Promise<Metadata> => {
    const form = await getForm(formId);

    if (!form || form.status === "draft") {
        notFound();
    }

    // check the product

    const brandColor = getBrandColorForURL(form.styling?.brandColor?.light || COLOR_DEFAULTS.brandColor);
    const formName = getNameForURL(form.name);

    const ogImgURL = `/api/v1/og?brandColor=${brandColor}&name=${formName}`;

    return {
        title: form.name,
        metadataBase: new URL(WEBAPP_URL),
        openGraph: {
            description: "Thanks a lot for your time 🙏",
            url: `/s/${form.id}`,
            siteName: "",
            images: [ogImgURL],
            locale: "en-US",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: form.name,
            description: "Thanks a lot for your time 🙏",
            images: [ogImgURL],
        },
    };
};

const getNameForURL = (url: string) => url.replace(/ /g, "%20");

const getBrandColorForURL = (url: string) => url.replace(/#/g, "%23");
