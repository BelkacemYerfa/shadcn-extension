import Link from "next/link";
import { Icons } from "../icons";
import { siteConfig } from "@/config/site-config";

export const SiteFooter = () => {
  return (
    <footer className="py-2 px-4 w-full">
      <p className="text-center flex items-center justify-center w-full text-sm leading-loose md:text-left">
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
