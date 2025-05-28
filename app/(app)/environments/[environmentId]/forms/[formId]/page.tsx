import { redirect } from "next/navigation"

const Page = ({ params }) => {
    return redirect(`/environments/${params.environmentId}/forms/${params.formId}/summary`);
};

export default Page;