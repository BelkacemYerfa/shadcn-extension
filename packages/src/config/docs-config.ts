type DocsConfig = {
  title: string;
  pages: {
    title: string;
    path: string;
  }[];
};

export const docsConfig: DocsConfig[] = [
  {
    title: "Getting Started",
    pages: [
      {
        title: "Introduction",
        path: "/docs/getting-started/introduction",
      },
      {
        title: "Installation",
        path: "/docs/getting-started/installation",
      },
    ],
  },
  {
    title: "Components",
    pages: [
      {
        title: "Button",
        path: "/docs/components/button",
      },
      {
        title: "Search",
        path: "/docs/components/search",
      },
    ],
  },
  {
    title: "pages",
    pages: [
      {
        title: "Home",
        path: "/docs/pages/home",
      },
      {
        title: "About",
        path: "/docs/pages/about",
      },
    ],
  },
];
