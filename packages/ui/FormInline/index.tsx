import { FormInlineProps } from "@/packages/types/playform";
import { useCallback, useEffect, useMemo } from "react";
import { loadFormScript } from "./lib/loadScript";

const createContainerId = () => `playform-form-container`;
declare global {
    interface Window {
        playformForms: {
            renderFormInline: (props: FormInlineProps) => void;
        };
    }
}

export const FormInline = (props: Omit<FormInlineProps, "containerId">) => {
    const containerId = useMemo(() => createContainerId(), []);
    const renderInline = useCallback(
        () => window.playformForms.renderFormInline({ ...props, containerId }),
        [containerId, props]
    );

    useEffect(() => {
        const loadScript = async () => {
            if (!window.playformForms) {
                try {
                    await loadFormScript();
                    renderInline();
                } catch (error) {
                    console.error("Failed to load the forms package: ", error);
                }
            } else {
                renderInline();
            }
        };

        loadScript();
    }, [containerId, props, renderInline]);

    return <div id={containerId} className="h-full w-full" />;
}
