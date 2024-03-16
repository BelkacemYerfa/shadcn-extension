import type { Metadata } from "next";
import { SiteFooter } from "@/components/layouts/site-footer";
import { siteConfig } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Shadcn extension",
  description:
    "Shadcn extension for Next.js with Tailwind CSS and TypeScript , sonner and vercel analytics , and more.",
  creator: "Belkacem Yerfa",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    url: siteConfig.url,
    locale: "en_US",
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@bylka207",
  },
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      {children}
      <SiteFooter />
    </body>
  );
}
