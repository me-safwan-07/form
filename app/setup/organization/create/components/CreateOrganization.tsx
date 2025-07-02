"use client";

import { ZOrganization } from "@/packages/types/organizations";
import { Button } from "@/packages/ui/Button";
import { FormControl, FormError, FormField, FormItem } from "@/packages/ui/Form";
import { Input } from "@/packages/ui/Input";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createOrganizationAction } from "../actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductAction } from "@/app/(app)/environments/[environmentId]/actions";
import { TProductUpdateInput } from "@/packages/types/product";

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
        resolver: zodResolver(ZCreateOrganizationFormSchema),
    });

    const organizationName = form.watch("name");

    // const addProduct = async (data: TProductUpdateInput) => {
    //     try {
    //         const product = await createProductAction(organizationId, {
    //             ...data
    //         });

    //         const productionEnvironment = product.environments[0];
    //         console.log("Created product:", productionEnvironment);
    //         router.push(`/environments/${productionEnvironment.id}/forms`);
    //     } catch (error) {
    //         toast.error("Product creation failed");
    //         console.error("Error creating product:", error);
    //     }
    // };


    const onSubmit: SubmitHandler<TCreateOrganizationForm> = async (data) => {
        try {
            setIsSubmitting(true);
            const organizationName = data.name.trim();
            console.log("Creating organization with name:", organizationName);
            const product = await createOrganizationAction();

            const productionEnvironment = product.environments[0];
            router.push(`/environments/${productionEnvironment.id}/forms`);
        } catch (error) {
            toast.error("Some error occurred while creating organization");
            setIsSubmitting(false);
        }
        
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-2xl font-medium">Setup your organization</h2>
                    <p>Make it yours</p>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    {...field}
                                    isInvalid={!!form.formState.errors.name}
                                    placeholder="e.g., Acme Inc"
                                    className="w-80"
                                    required
                                />
                            </FormControl>

                            <FormError />
                        </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        variant="darkCTA"
                        className="flex w-80 justify-center"
                        loading={isSubmitting}
                        disabled={isSubmitting || organizationName.trim() === ""}>
                        Continue
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}