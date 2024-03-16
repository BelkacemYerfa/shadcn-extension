import { Registry } from "./schema";

const extension: Registry = [
  {
    name: "tree-view-api",
    type: "components:extension",
    dependencies: ["@radix-ui/react-accordion"],
    files: ["extension/tree-view-api.tsx"],
  },
  {
    name: "file-upload",
    type: "components:extension",
    dependencies: ["react-dropzone"],
    files: ["extension/file-upload.tsx"],
  },
  {
    name: "multi-select",
    type: "components:extension",
    dependencies: ["command", "cmdk"],
    files: ["extension/multi-select.tsx"],
  },
  {
    name: "otp-input",
    type: "components:extension",
    dependencies: ["react-otp-input"],
    files: ["extension/otp-input.tsx"],
  },
  {
    name: "carousel",
    type: "components:extension",
    dependencies: ["embla-carousel-react", "embla-carousel"],
    files: ["extension/carousel.tsx"],
  },
  {
    name: "breadcrumb",
    type: "components:extension",
    dependencies: ["Button", "@radix-ui/react-popover"],
    files: ["extension/breadcrumb.tsx"],
  },
  {
    name: "image-carousel-upload",
    type: "components:extension",
    dependencies: ["react-dropzone", "embla-carousel-react", "embla-carousel"],
    files: ["extension/image-carousel-upload.tsx"],
  },
];

const examples: Registry = [
  {
    name: "tree-view-example",
    type: "components:example",
    registryDependencies: ["tree-view-api"],
    files: ["example/tree-view-example.tsx"],
  },
  {
    name: "file-upload-example",
    type: "components:example",
    registryDependencies: ["file-upload"],
    files: ["example/file-upload-example.tsx"],
  },
  {
    name: "multi-select-example",
    type: "components:example",
    registryDependencies: ["multi-select"],
    files: ["example/multi-select-example.tsx"],
  },
  {
    name: "otp-input-example",
    type: "components:example",
    registryDependencies: ["otp-input"],
    files: ["example/otp-input-example.tsx"],
  },
  {
    name: "carousel-example",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: ["example/carousel-example.tsx"],
  },
  {
    name: "breadcrumbs-example",
    type: "components:example",
    registryDependencies: ["breadcrumbs"],
    files: ["example/breadcrumbs-example.tsx"],
  },
  {
    name: "image-carousel-upload-example",
    type: "components:example",
    registryDependencies: ["image-carousel-upload"],
    files: ["example/image-carousel-upload-example.tsx"],
  },
];

export const registry: Registry = [...extension, ...examples];
