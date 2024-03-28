import { Registry } from "./schema";

const extension: Registry = [
  {
    name: "tree-view",
    type: "components:extension",
    dependencies: ["@radix-ui/react-accordion"],
    files: ["extension/tree-view.tsx"],
  },
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

const demos: Registry = [
  {
    name: "tree-view-demo",
    type: "components:demo",
    registryDependencies: ["tree-view-api"],
    files: ["example/tree-view-demo.tsx"],
  },
  {
    name: "file-upload-demo",
    type: "components:demo",
    registryDependencies: ["file-upload"],
    files: ["example/file-upload-demo.tsx"],
  },
  {
    name: "multi-select-demo",
    type: "components:demo",
    registryDependencies: ["multi-select"],
    files: ["example/multi-select-demo.tsx"],
  },
  {
    name: "otp-input-demo",
    type: "components:demo",
    registryDependencies: ["otp-input"],
    files: ["example/otp-input-demo.tsx"],
  },
  {
    name: "carousel-demo",
    type: "components:demo",
    registryDependencies: ["carousel"],
    files: ["example/carousel-demo.tsx"],
  },
  {
    name: "breadcrumb-demo",
    type: "components:demo",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb-demo.tsx"],
  },
];

const examples: Registry = [
  {
    name: "tree-view-builtin-indicator",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: ["example/tree-view/tree-view-builtin-indicator.tsx"],
  },
  {
    name: "tree-view-builtin-expand",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: ["example/tree-view/tree-view-builtin-expand.tsx"],
  },
  {
    name: "tree-view-builtin-select",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: ["example/tree-view/tree-view-builtin-select.tsx"],
  },
  {
    name: "tree-view-guide",
    type: "components:example",
    registryDependencies: ["tree-view-api"],
    files: ["example/tree-view/tree-view-guide.tsx"],
  },
  {
    name: "carousel-orientation",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: ["example/carousel/carousel-orientation.tsx"],
  },
  {
    name: "carousel-plugin",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: ["example/carousel/carousel-plugin.tsx"],
  },
  {
    name: "carousel-indicator",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: ["example/carousel/carousel-indicator.tsx"],
  },
  {
    name: "multi-select-state",
    type: "components:example",
    registryDependencies: ["multi-select"],
    files: ["example/multi-select/multi-select-state.tsx"],
  },
  {
    name: "multi-select-zod",
    type: "components:example",
    registryDependencies: ["multi-select"],
    files: ["example/multi-select/multi-select-zod.tsx"],
  },
  {
    name: "otp-input-zod",
    type: "components:example",
    registryDependencies: ["otp-input"],
    files: ["example/otp-input/otp-input-zod.tsx"],
  },
  {
    name: "file-upload-dropzone",
    type: "components:example",
    registryDependencies: ["file-upload"],
    files: ["example/file-upload/file-upload-dropzone.tsx"],
  },
  {
    name: "file-upload-zod",
    type: "components:example",
    registryDependencies: ["file-upload"],
    files: ["example/file-upload/file-upload-zod.tsx"],
  },
  {
    name: "breadcrumb-separator",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb/breadcrumb-separator.tsx"],
  },
  {
    name: "breadcrumb-variants",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb/breadcrumb-variants.tsx"],
  },
  {
    name: "breadcrumb-popover",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb/breadcrumb-popover.tsx"],
  },
  // Under development
  {
    name: "image-carousel-upload-example",
    type: "components:example",
    registryDependencies: ["image-carousel-upload"],
    files: ["example/image-carousel-upload-example.tsx"],
  },
];

export const registry: Registry = [...extension, ...demos, ...examples];
