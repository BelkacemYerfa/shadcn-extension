import Link from "next/link";
import { Icons } from "../icons";
import { siteConfig } from "@/config/siteconfig";

export const SiteFooter = () => {
  return (
    <footer className="fixed bottom-0 border-t border-border/40 py-2 px-4 w-full ">
      <p className="text-center flex items-center justify-between w-full text-sm leading-loose md:text-left">
        <span>&copy; {new Date().getFullYear()} . All rights reserved </span>
        <span>
          Built by{" "}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Yerfa Belkacem
          </Link>
        </span>
      </p>
    </footer>
  );
};
