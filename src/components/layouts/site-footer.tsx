import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { SocialLinks } from "../social-links";

export const SiteFooter = () => {
  return (
    <footer className="py-2 px-4 flex items-center justify-between xs:justify-center w-full">
      <p className="text-sm leading-loose xs:text-left">
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
      <SocialLinks className="flex xs:hidden" />
    </footer>
  );
};
