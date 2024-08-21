import { Registry } from "./schema";

const extension: Registry = [
  {
    name: "tree-view",
    type: "components:extension",
    dependencies: ["@tanstack/react-virtual", "use-resize-observer"],
    registryDependencies: ["tree-view-api"],
    files: ["extension/tree-view.tsx"],
  },
  {
    name: "tree-view-api",
    type: "components:extension",
    dependencies: ["@radix-ui/react-accordion"],
    uiDependencies: ["button", "scroll-area"],
    files: ["extension/tree-view-api.tsx"],
  },
  {
    name: "file-upload",
    type: "components:extension",
    dependencies: ["react-dropzone", "sonner"],
    uiDependencies: ["button", "input"],
    files: ["extension/file-upload.tsx"],
  },
  {
    name: "multi-select",
    type: "components:extension",
    dependencies: ["command", "cmdk"],
    uiDependencies: ["badge", "command"],
    files: ["extension/multi-select.tsx"],
  },
  {
    name: "otp-input",
    type: "components:extension",
    dependencies: ["react-otp-input"],
    uiDependencies: ["input"],
    files: ["extension/otp-input.tsx"],
  },
  {
    name: "carousel",
    type: "components:extension",
    dependencies: [
      "embla-carousel-react",
      "embla-carousel",
      "@radix-ui/react-icons",
    ],
    uiDependencies: ["button"],
    files: ["extension/carousel.tsx"],
  },
  {
    name: "breadcrumb",
    type: "components:extension",
    dependencies: ["@radix-ui/react-popover"],
    uiDependencies: ["button", "popover"],
    files: ["extension/breadcrumb.tsx"],
  },
  {
    name: "image-carousel-upload",
    type: "components:extension",
    dependencies: ["react-dropzone", "embla-carousel-react", "embla-carousel"],
    registryDependencies: ["carousel"],
    uiDependencies: ["input"],
    files: ["extension/image-carousel-upload.tsx"],
  },
  {
    name: "smart-datetime-input",
    type: "components:extension",
    dependencies: ["chrono-node", "react-day-picker"],
    uiDependencies: ["popover", "calendar", "input", "button", "scroll-area"],
    files: ["extension/smart-datetime-input.tsx"],
  },
  {
    name: "datetime-picker",
    type: "components:extension",
    dependencies: ["timescape"],
    uiDependencies: ["input"],
    files: ["extension/datetime-picker.tsx"],
  },
  {
    name: "tags-input",
    type: "components:extension",
    dependencies: ["badge"],
    uiDependencies: ["input", "badge"],
    files: ["extension/tags-input.tsx"],
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
  {
    name: "smart-datetime-input-demo",
    type: "components:demo",
    registryDependencies: ["smart-datetime-input"],
    files: ["example/smart-datetime-input-demo.tsx"],
  },
  {
    name: "datetime-picker-demo",
    type: "components:demo",
    registryDependencies: ["datetime-picker"],
    files: ["example/datetime-picker-demo.tsx"],
  },
  {
    name: "tags-input-demo",
    type: "components:demo",
    registryDependencies: ["tags-input"],
    files: ["example/tags-input-demo.tsx"],
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
    name: "carousel-rtl-support",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: ["example/carousel/carousel-rtl-support.tsx"],
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
  {
    name: "breadcrumb-active",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb/breadcrumb-active.tsx"],
  },
  {
    name: "breadcrumb-orientation",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: ["example/breadcrumb/breadcrumb-orientation.tsx"],
  },

  // Under development
  {
    name: "image-carousel-upload-example",
    type: "components:example",
    registryDependencies: ["image-carousel-upload"],
    files: ["example/image-carousel-upload-example.tsx"],
  },
  //
  {
    name: "smart-datetime-input-zod",
    type: "components:example",
    registryDependencies: ["smart-datetime-input"],
    files: ["example/smart-datetime-input/smart-datetime-input-zod.tsx"],
  },
  {
    name: "datetime-picker-zod",
    type: "components:example",
    registryDependencies: ["datetime-picker"],
    files: ["example/datetime-picker/datetime-picker-zod.tsx"],
  },
  {
    name: "tags-input-state",
    type: "components:example",
    registryDependencies: ["tags-input"],
    files: ["example/tags-input/tags-input-state.tsx"],
  },
  {
    name: "tags-input-zod",
    type: "components:example",
    registryDependencies: ["tags-input"],
    files: ["example/tags-input/tags-input-zod.tsx"],
  },
];

export const registry: Registry = [...extension, ...demos, ...examples];
