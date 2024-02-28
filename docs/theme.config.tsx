import { useRouter } from "next/router";
import type { DocsThemeConfig } from "nextra-theme-docs";

const logo = (
  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fill: "currentColor", height: "1.25rem", width: "1.25rem" }}
    >
      <path d="M8 4C8 2.34315 9.34315 1 11 1C12.6569 1 14 2.34315 14 4C14 4.35064 13.9398 4.68722 13.8293 5H18C18.5523 5 19 5.44772 19 6V10.1707C19.3128 10.0602 19.6494 10 20 10C21.6569 10 23 11.3431 23 13C23 14.6569 21.6569 16 20 16C19.6494 16 19.3128 15.9398 19 15.8293V20C19 20.5523 18.5523 21 18 21H4C3.44772 21 3 20.5523 3 20V6C3 5.44772 3.44772 5 4 5H8.17071C8.06015 4.68722 8 4.35064 8 4Z" />
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
    component: footer,
  },
  toc: {
    backToTop: true,
  },
};

export default config;
