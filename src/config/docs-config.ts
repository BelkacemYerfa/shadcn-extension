export type DocsConfig = {
  title: string;
  path?: string;
  pages?: DocsConfig[];
};

export const Pages: DocsConfig[] = [
  {
    title: "Docs",
    path: "/docs/introduction",
  },
  {
    title: "Components",
    path: "/components",
  },
];

export const docsConfig: DocsConfig[] = [
  {
    title: "Getting Started",
    pages: [
      {
        title: "Introduction",
        path: "/docs/introduction",
      },
      {
        title: "Installation",
        path: "/docs/installation",
      },
      {
        title: "Changelog",
        path: "/docs/changelog",
      },
    ],
  },
  {
    title: "Components",
    pages: [
      {
        title: "Tree view",
        path: "/docs/tree-view",
      },
      {
        title: "Carousel",
        path: "/docs/carousel",
      },
      {
        title: "Multi select",
        path: "/docs/multi-select",
      },
      {
        title: "Breadcrumb",
        path: "/docs/breadcrumb",
      },
      {
        title: "Otp input",
        path: "/docs/otp-input",
      },
      {
        title: "Smart DateTime input",
        path: "/docs/smart-datetime-input",
      },
      {
        title: "Datetime picker",
        path: "/docs/datetime-picker",
      },
      {
        title: "File upload",
        path: "/docs/file-upload",
      },
    ],
  },
];
