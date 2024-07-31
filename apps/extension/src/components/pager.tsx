import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Doc } from "contentlayer/generated";

import { DocsConfig, docsConfig } from "@/config/docs-config";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between not-prose">
      {pager?.prev?.path && (
        <Link
          href={pager.prev.path}
          className={buttonVariants({ variant: "outline" })}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          {pager.prev.title}
        </Link>
      )}
      {pager?.next?.path && (
        <Link
          href={pager.next.path}
          className={cn(buttonVariants({ variant: "outline" }), "ml-auto")}
        >
          {pager.next.title}
          <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export function getPagerForDoc(doc: Doc) {
  const flattenedLinks = [null, ...flatten(docsConfig), null];
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.path
  );
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null;
  return {
    prev,
    next,
  };
}

export type FlatDocsConfig = {
  title: string;
  path?: string;
};

function flatten(
  links: DocsConfig[],
  parentPath: string = ""
): FlatDocsConfig[] {
  return links.reduce<FlatDocsConfig[]>((acc, link) => {
    const currentPath = parentPath ? `${parentPath}/${link.title}` : link.title;
    const flatLink: FlatDocsConfig = {
      title: link.title,
      path: link.path,
    };
    if (link.path) {
      acc.push(flatLink);
    }

    if (link.pages) {
      acc.push(...flatten(link.pages, currentPath));
    }

    return acc;
  }, []);
}
