import { Registry } from "./schema";

const extension: Registry = [
  {
    name: "tree-view",
    type: "components:extension",
    dependencies: ["@tanstack/react-virtual", "use-resize-observer"],
    registryDependencies: ["tree-view-api"],
    files: [
      {
        path: "extension/tree-view.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tree-view-api",
    type: "components:extension",
    dependencies: ["@radix-ui/react-accordion"],
    uiDependencies: ["button", "scroll-area"],
    files: [
      {
        path: "extension/tree-view-api.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "file-upload",
    type: "components:extension",
    dependencies: ["react-dropzone", "sonner"],
    uiDependencies: ["button", "input"],
    files: [
      {
        path: "extension/file-upload.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "multi-select",
    type: "components:extension",
    dependencies: ["command", "cmdk"],
    uiDependencies: ["badge", "command"],
    files: [
      {
        path: "extension/multi-select.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "otp-input",
    type: "components:extension",
    dependencies: ["react-otp-input"],
    uiDependencies: ["input"],
    files: [
      {
        path: "extension/otp-input.tsx",
        type: "components:example",
      },
    ],
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
    files: [
      {
        path: "extension/carousel.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb",
    type: "components:extension",
    dependencies: ["@radix-ui/react-popover"],
    uiDependencies: ["button", "popover"],
    files: [
      {
        path: "extension/breadcrumb.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "smart-datetime-input",
    type: "components:extension",
    dependencies: ["chrono-node", "react-day-picker"],
    uiDependencies: ["popover", "calendar", "input", "button", "scroll-area"],
    files: [
      {
        path: "extension/smart-datetime-input.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "datetime-picker",
    type: "components:extension",
    dependencies: ["timescape"],
    uiDependencies: ["input"],
    files: [
      {
        path: "extension/datetime-picker.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tags-input",
    type: "components:extension",
    dependencies: ["badge"],
    uiDependencies: ["input", "badge"],
    files: [
      {
        path: "extension/tags-input.tsx",
        type: "components:example",
      },
    ],
  },
];

const demos: Registry = [
  {
    name: "tree-view-demo",
    type: "components:demo",
    registryDependencies: ["tree-view-api"],
    files: [
      {
        path: "example/tree-view-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "file-upload-demo",
    type: "components:demo",
    registryDependencies: ["file-upload"],
    files: [
      {
        path: "example/file-upload-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "multi-select-demo",
    type: "components:demo",
    registryDependencies: ["multi-select"],
    files: [
      {
        path: "example/multi-select-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "otp-input-demo",
    type: "components:demo",
    registryDependencies: ["otp-input"],
    files: [
      {
        path: "example/otp-input-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "carousel-demo",
    type: "components:demo",
    registryDependencies: ["carousel"],
    files: [
      {
        path: "example/carousel-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-demo",
    type: "components:demo",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "smart-datetime-input-demo",
    type: "components:demo",
    registryDependencies: ["smart-datetime-input"],
    files: [
      {
        path: "example/smart-datetime-input-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "datetime-picker-demo",
    type: "components:demo",
    registryDependencies: ["datetime-picker"],
    files: [
      {
        path: "example/datetime-picker-demo.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tags-input-demo",
    type: "components:demo",
    registryDependencies: ["tags-input"],
    files: [
      {
        path: "example/tags-input-demo.tsx",
        type: "components:example",
      },
    ],
  },
];

const examples: Registry = [
  {
    name: "tree-view-builtin-indicator",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: [
      {
        path: "example/tree-view/tree-view-builtin-indicator.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tree-view-builtin-expand",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: [
      {
        path: "example/tree-view/tree-view-builtin-expand.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tree-view-builtin-select",
    type: "components:example",
    registryDependencies: ["tree-view"],
    files: [
      {
        path: "example/tree-view/tree-view-builtin-select.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tree-view-guide",
    type: "components:example",
    registryDependencies: ["tree-view-api"],
    files: [
      {
        path: "example/tree-view/tree-view-guide.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "carousel-orientation",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: [
      {
        path: "example/carousel/carousel-orientation.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "carousel-plugin",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: [
      {
        path: "example/carousel/carousel-plugin.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "carousel-indicator",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: [
      {
        path: "example/carousel/carousel-indicator.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "carousel-rtl-support",
    type: "components:example",
    registryDependencies: ["carousel"],
    files: [
      {
        path: "example/carousel/carousel-rtl-support.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "multi-select-state",
    type: "components:example",
    registryDependencies: ["multi-select"],
    files: [
      {
        path: "example/multi-select/multi-select-state.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "multi-select-zod",
    type: "components:example",
    registryDependencies: ["multi-select"],
    files: [
      {
        path: "example/multi-select/multi-select-zod.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "otp-input-zod",
    type: "components:example",
    registryDependencies: ["otp-input"],
    files: [
      {
        path: "example/otp-input/otp-input-zod.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "file-upload-dropzone",
    type: "components:example",
    registryDependencies: ["file-upload"],
    files: [
      {
        path: "example/file-upload/file-upload-dropzone.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "file-upload-zod",
    type: "components:example",
    registryDependencies: ["file-upload"],
    files: [
      {
        path: "example/file-upload/file-upload-zod.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-separator",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb/breadcrumb-separator.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-variants",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb/breadcrumb-variants.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-popover",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb/breadcrumb-popover.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-active",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb/breadcrumb-active.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "breadcrumb-orientation",
    type: "components:example",
    registryDependencies: ["breadcrumb"],
    files: [
      {
        path: "example/breadcrumb/breadcrumb-orientation.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "smart-datetime-input-zod",
    type: "components:example",
    registryDependencies: ["smart-datetime-input"],
    files: [
      {
        path: "example/smart-datetime-input/smart-datetime-input-zod.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "datetime-picker-zod",
    type: "components:example",
    registryDependencies: ["datetime-picker"],
    files: [
      {
        path: "example/datetime-picker/datetime-picker-zod.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tags-input-state",
    type: "components:example",
    registryDependencies: ["tags-input"],
    files: [
      {
        path: "example/tags-input/tags-input-state.tsx",
        type: "components:example",
      },
    ],
  },
  {
    name: "tags-input-zod",
    type: "components:example",
    registryDependencies: ["tags-input"],
    files: [
      {
        path: "example/tags-input/tags-input-zod.tsx",
        type: "components:example",
      },
    ],
  },
];

export const registry: Registry = [...extension, ...demos, ...examples];
