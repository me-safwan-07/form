// 'use client';

// import { cn } from "@/packages/lib/cn";
// import { TEnvironment } from "@/packages/types/environment"
// import { TProduct } from "@/packages/types/product";
// import type { Session } from "next-auth";
// import Image from "next/image";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useMemo, useState } from "react";
// import FBLogo from "@/images/formbricks-wordmark.svg";
// import { Button } from "@/packages/ui/Button";
// import { MessageCircle, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
// import {
//   ArrowUpRightIcon,
//   BlocksIcon,
//   ChevronRightIcon,
//   Cog,
//   CreditCardIcon,
//   KeyIcon,
//   LogOutIcon,
//   MessageCircle,
//   MousePointerClick,
//   PanelLeftCloseIcon,
//   PanelLeftOpenIcon,
//   PlusIcon,
//   UserCircleIcon,
//   UserIcon,
//   UsersIcon,
// } from "lucide-react";

// interface NavigationProps {
//     environment: TEnvironment;
//     session: Session;
//     products: TProduct[];
// }

// export const MainNavigation = ({
//     environment,
//     session,
//     products
// }: NavigationProps) => {
//     const router = useRouter();
//     const pathname = usePathname();

//     const [isCollapsed, setIsCollapsed] = useState(true);
//     const [isTextVisible, setIsTextVisible] = useState(true);

//     const product = products.find((product) => product.id === environment.productId);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//         localStorage.setItem("isMainNavCollapsed", isCollapsed ? "false" : "true");
//     };

//     // const mainNavigation = useMemo(
//     //     () => [
//     //     {
//     //         name: "Surveys",
//     //         href: `/environments/${environment.id}/surveys`,
//     //         icon: MessageCircle,
//     //         isActive: pathname?.includes("/surveys"),
//     //         isHidden: false,
//     //     },
//     //     {
//     //         name: "People",
//     //         href: `/environments/${environment.id}/people`,
//     //         icon: UserIcon,
//     //         isActive:
//     //         pathname?.includes("/people") ||
//     //         pathname?.includes("/segments") ||
//     //         pathname?.includes("/attributes"),
//     //     },
//     //     {
//     //         name: "Actions",
//     //         href: `/environments/${environment.id}/actions`,
//     //         icon: MousePointerClick,
//     //         isActive: pathname?.includes("/actions") || pathname?.includes("/actions"),
//     //         isHidden: product?.config.channel === "link",
//     //     },
//     //     {
//     //         name: "Integrations",
//     //         href: `/environments/${environment.id}/integrations`,
//     //         icon: BlocksIcon,
//     //         isActive: pathname?.includes("/integrations"),
//     //         isHidden: isViewer,
//     //     },
//     //     {
//     //         name: "Configuration",
//     //         href: `/environments/${environment.id}/product/general`,
//     //         icon: Cog,
//     //         isActive: pathname?.includes("/product"),
//     //         isHidden: isViewer,
//     //     },
//     //     ],
//     //     [environment.id, pathname, isViewer]
//     // );
//     return (
//         <>
//             {product && (
//                 <aside
//                     className={cn(
//                         "z-40 flex flex-col justify-between rounded-r-xl border-r border-slate-200 bg-white pt-3 shadow-md transition-all duration-100 h-screen",
//                         !isCollapsed ? "w-sidebar-collapsed" : "w-sidebar-expanded"
//                     )}
//                 >
//                     <div className="flex items-center justify-between px-3 pb-4">
//                         {!isCollapsed && (
//                             <Link
//                                 href={`/environments/${environment.id}/surveys/`}
//                                 className={cn(
//                                     "flex items-center justify-center transition-opacity duration-100",
//                                     isTextVisible ? "opacity-0" : "opacity-100"
//                             )}>
//                                 <Image src={FBLogo} width={160} height={30} alt="Formbricks Logo" />
//                             </Link>
//                         )}
//                         <Button
//                             size="icon"
//                             tooltipSide="right"
//                             onClick={toggleSidebar}
//                             className={cn(
//                             "rounded-xl bg-slate-50 p-1 text-slate-600 transition-all hover:bg-slate-100 focus:outline-none focus:ring-0 focus:ring-transparent"
//                             )}>
//                             {isCollapsed ? (
//                                 <PanelLeftOpenIcon strokeWidth={1.5} />
//                             ) : (
//                                 <PanelLeftCloseIcon strokeWidth={1.5} />
//                             )}
//                         </Button>
//                     </div>

//                 </aside>
//             )}
//         </>
//     )
// }