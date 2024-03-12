import { Registry } from "./schema";

const extension: Registry = [
  {
    name: "tree-view",
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
    name: "fancy-multi-select",
    type: "components:extension",
    dependencies: ["command", "cmdk"],
    files: ["extension/multi-select-api.tsx"],
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
    name: "breadcrumbs",
    type: "components:extension",
    dependencies: ["button", "@radix-ui/react-popover"],
    files: ["extension/breadcrumbs.tsx"],
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
    dependencies: ["tree-view"],
    files: ["examples/tree-view-example.tsx"],
  },
  {
    name: "file-upload-example",
    type: "components:example",
    dependencies: ["file-upload"],
    files: ["examples/file-upload-example.tsx"],
  },
  {
    name: "fancy-multi-select-example",
    type: "components:example",
    dependencies: ["multi-select"],
    files: ["examples/multi-select-example.tsx"],
  },
  {
    name: "otp-input-example",
    type: "components:example",
    dependencies: ["otp-input"],
    files: ["examples/otp-input-example.tsx"],
  },
  {
    name: "carousel-example",
    type: "components:example",
    dependencies: ["carousel"],
    files: ["examples/carousel-example.tsx"],
  },
  {
    name: "breadcrumbs-example",
    type: "components:example",
    dependencies: ["breadcrumbs"],
    files: ["examples/breadcrumbs-example.tsx"],
  },
  {
    name: "image-carousel-upload-example",
    type: "components:example",
    dependencies: ["image-carousel-upload"],
    files: ["examples/image-carousel-upload-example.tsx"],
  },
];

export const registry: Registry = [...extension, ...examples];
