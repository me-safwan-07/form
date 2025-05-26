import { ZOrganization } from "@/packages/types/organizations";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const ZCreateOrganizationFormSchema = ZOrganization.pick({ name: true });
type TCreateOrganizationForm = z.infer<typeof ZCreateOrganizationFormSchema>;

export const CreateOrganization = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<TCreateOrganizationForm>({
        defaultValues: {
            name: "",
        },
        mode: "onChange",
        resolver: zodResolv
    });

    const organizationName = form.watch("name");

    const onSubmit: SubmitHandler<TCreateOrganizationForm> = async (data) => {
        try {
            setIsSubmitting(true);
            const organizationName = data.name.trim();
            const organization = await createOrganizationAction(organizationName);
            router.push(`/setup/organizatio/${organization.id}/invite`);
        } catch (error) {
            toast.error("Some error occurred while creating organization");
            setIsSubmitting(false);
        }
        
    }

    return (
        <FormProvider {...form}>

        </FormProvider>
    )
}