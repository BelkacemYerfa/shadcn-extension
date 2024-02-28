import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "@/components/provider";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shadcn extension",
  description:
    "Shadcn extension for Next.js with Tailwind CSS and TypeScript , sonner and vercel analytics , and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <SiteHeader />
          {children}
          <Toaster richColors position="bottom-center" />
          <SiteFooter />
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
