import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    template: "%s | Playform",
    default: "Playform",
  },
  description: "Playerform is a platform for building and deploying form applications.",
};

export default function RootLayout({
  children,
}:  {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      {/* TODO add the speedinsighst of vercel */}
      <body
        className="flex h-dvh flex-col transition-all ease-in-out"
      >
        {children}
      </body>
    </html>
  );
}
