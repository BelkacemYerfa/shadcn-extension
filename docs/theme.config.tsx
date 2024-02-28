import { useRouter } from "next/router";
import type { DocsThemeConfig } from "nextra-theme-docs";

const logo = (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <svg
      width="14"
      height="15"
      viewBox="0 0 14 15"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: "currentColor", height: "1.25rem", width: "1.25rem" }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0.833333C7.59393 4.2391 10.2609 6.90607 13.6667 7.5C10.2609 8.09393 7.59393 10.7609 7 14.1667C6.40607 10.7609 3.7391 8.09393 0.333333 7.5C3.7391 6.90607 6.40607 4.2391 7 0.833333Z"
      />
    </svg>
    <span style={{ fontWeight: "bold" }}>Shadcn Extension</span>
  </div>
);

const footer = <></>;

const config: DocsThemeConfig = {
  project: {
    link: "https://github.com/BelkacemYerfa/shadcn-extension-components",
  },
  docsRepositoryBase:
    "https://github.com/BelkacemYerfa/shadcn-extension-components/tree/master/package/src/app",
  useNextSeoProps() {
    const { asPath } = useRouter();
    if (asPath !== "/") {
      return {
        titleTemplate: "%s – Shadcn Extension",
        icon: "/favicon.ico",
      };
    }
  },
  logo,
  sidebar: {
    titleComponent({ title, type }) {
      if (type === "separator") {
        return <span className="cursor-default">{title}</span>;
      }
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  footer: {
    text: footer,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
