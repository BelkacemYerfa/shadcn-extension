import { Icons } from "@/components/icons";
import { SiteFooter } from "@/components/layouts/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

export default async function Home() {
  return (
    <main className="max-w-2xl mx-auto flex-1 flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center gap-4 ">
        <h1
          className="text-center animate-fade-up text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
          style={{
            animationDelay: "0.25s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>
            <span className="text-muted-foreground">Extend</span> your component
            library
          </Balancer>
        </h1>
        <span
          className="text-center animate-fade-up text-base text-muted-foreground sm:text-xl opacity-0"
          style={{
            animationDelay: "0.35s",
            animationFillMode: "forwards",
          }}
        >
          <Balancer>{siteConfig.description}</Balancer>
        </span>
        <div
          className="animate-fade-up flex items-center gap-4 opacity-0"
          style={{
            animationDelay: "0.4s",
            animationFillMode: "forwards",
          }}
        >
          <Link
            href={siteConfig.links.docs}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Get Started
          </Link>
          <Link
            href={siteConfig.links.github}
            className={cn("gap-2", buttonVariants({ variant: "outline" }))}
          >
            <span>GitHub</span>
            <Icons.gitHub className="h-4 w-4 fill-current" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
