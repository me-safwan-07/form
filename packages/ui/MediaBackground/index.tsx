'use client';

// import { TForm } from "@/packages/types/forms";
// import { TProduct } from "@/packages/types/product";

interface MediaBackgroundProps {
    children: React.ReactNode;
    // form: TForm;
    // product: TProduct;
    isEditorView?: boolean;
    isMobilePreview?: boolean;
    ContentRef?: React.RefObject<HTMLDivElement>;
}

export const MediaBackground: React.FC<MediaBackgroundProps> = ({
    children,
    // product,
    // form,
    isEditorView,
    isMobilePreview,
    ContentRef
}) => {
    const renderContent = () => (
        <div className="no-scrollbar absolute flex h-full w-full items-center justify-center overflow-hidden">
          {children}
        </div>
    );

    if (isMobilePreview) {
        return (
            <div
                ref={ContentRef}
                className={`relative h-[90%] max-h-[40rem] w-[22rem] overflow-hidden rounded-[3rem] border-[6px] border-slate-400`}>
                {/* below element is use to create notch for the mobile device mockup   */}
                <div className="absolute left-1/2 right-1/2 top-2 z-20 h-4 w-1/3 -translate-x-1/2 transform rounded-full bg-slate-400"></div>
                {/* {renderBackground()} */}
                {renderContent()}
            </div>
        );
    } else if (isEditorView) {
        return (
            <div ref={ContentRef} className="overflow-hiddem flex flex-grow flex-col rounded-b-lg">
                <div className="relative flex w-full flex-grow flex-col items-center justify-center p-4 py-6">
                    {/* {renderBackground()} */}
                    <div className="flex h-full w-full items-center justify-center">{children}</div>
                </div>
            </div>      
        );
    } else {
        return (
            <div className="flex min-h-dvh flex-col items-center justify-center">
                {/* {renderBackground()} */}
                <div className="relative w-full">{children}</div>
            </div>
        );
    }
};