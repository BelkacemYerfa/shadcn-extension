export type DocsConfig = {
  title: string;
  path?: string;
  pages?: DocsConfig[];
};

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
        title: "File upload",
        path: "/docs/file-upload",
      },
    ],
  },
];
