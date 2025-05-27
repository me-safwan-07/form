'use client';

import { createProductAction } from "@/app/(app)/environments/[environmentId]/actions"
import { TProductUpdateInput, ZProductUpdateInput } from "@/packages/types/product"
import { Button } from "@/packages/ui/Button";
import { ColorPicker } from "@/packages/ui/ColorPicker";
import { FormControl, FormDescription, FormError, FormField, FormItem, FormLabel } from "@/packages/ui/Form";
import { Input } from "@/packages/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast";

interface ProductSettingsProps {
  organizationId: string;
//   channel: TProductConfigChannel;
//   industry: TProductConfigIndustry;
  defaultBrandColor: string;
}

export const ProductSettings = ({
    organizationId,
    defaultBrandColor,
}: ProductSettingsProps) => {
    const router = useRouter();
    const addProduct = async (data: TProductUpdateInput) => {
        try {
            const product = await createProductAction(organizationId, {
                ...data
            });

            const productionEnvironment = product.environments[0];
            console.log("Created product:", productionEnvironment);
            router.push(`/environments/${productionEnvironment.id}/forms`);
        } catch (error) {
            toast.error("Product creation failed");
            console.error("Error creating product:", error);
        }
    };

    const form = useForm<TProductUpdateInput>({
        defaultValues: {
            name: '',
            styling: { allowStyleOverwrite: true, brandColor: { light: defaultBrandColor } },
        },
        resolver: zodResolver(ZProductUpdateInput),
    });
    const logoUrl = form.watch('logo.url');
    const brandColor = form.watch("styling.brandColor.light") ?? defaultBrandColor;
    const { isSubmitting } = form.formState;

    return (
        <div className="mt-6 flex w-5/6 space-x-10 lg:w-2/3 2xl:w-1/2">
            <div className="flex w-1/2 flex-col space-y-4">
                <FormProvider {...form}>
                    <form onSubmit={form.handleSubmit(addProduct)} className="w-full space-y-4">
                        <FormField 
                            control={form.control}
                            name="styling.brandColor.light"
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="w-full space-y-4">
                                    <div>
                                        <FormLabel>Brand color</FormLabel>
                                        <FormDescription>Change the brand color of the form.</FormDescription>
                                    </div>
                                    <FormControl>
                                        <div>
                                            <ColorPicker 
                                                color={field.value || defaultBrandColor}
                                                onChange={(color) => field.onChange(color)}
                                            />
                                            {error?.message && <FormError className="text-left">{error.message}</FormError>}
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField 
                            control={form.control}
                            name="name"
                            render={({ field, fieldState: { error } }) => (
                                <FormItem className="w-full space-y-4">
                                    <div>
                                        <FormLabel>Product Name</FormLabel>
                                    </div>
                                    <FormControl>
                                        <div>
                                            <Input 
                                                value={field.value}
                                                onChange={(name) => field.onChange(name)}
                                                placeholder="PlayForm Merch Store"
                                                className="bg-white"
                                                autoFocus={true}
                                                />
                                            {error?.message && <FormError className="text-left">{error.message}</FormError>}
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex w-full justify-end">
                            <Button variant="darkCTA" loading={isSubmitting} type="submit">
                                Next
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    )
}