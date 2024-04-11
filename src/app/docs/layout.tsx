import type { Metadata } from "next";
import { siteConfig } from "@/config/site-config";
import { SideBar } from "@/components/side-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SiteFooter } from "@/components/layouts/site-footer";

export const metadata: Metadata = {
  title: "Docs - Shadcn extension",
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

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container flex-1 items-start md:grid md:grid-cols-[180px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10 pt-14">
        <aside className="fixed left-0 top-14 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <ScrollArea className="h-full max-h-full">
            <SideBar />
          </ScrollArea>
        </aside>
        {children}
      </div>
      <div className="border-t border-t-border">
        <SiteFooter />
      </div>
    </>
  );
}
