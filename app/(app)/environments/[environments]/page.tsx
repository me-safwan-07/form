import { redirect } from "next/navigation";

const Page = ({ params }) => {
  return redirect(`/environments/${params.environmentId}/forms`);
};

export default Page;
