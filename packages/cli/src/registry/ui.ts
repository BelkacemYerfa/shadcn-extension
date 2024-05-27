import { Registry } from "./schema";

export const ui: Registry = [
  {
    "name": "banner-content",
    "dependencies": [],
    "registryDependencies": [],
    "uiDependencies": [],
    "files": [
      "library/banner/banner-content.tsx"
    ],
    "type": "components:library"
  },
  {
    "name": "banner-shell",
    "dependencies": [
      "@radix-ui/react-slot",
      "@trnsprncy/oss"
    ],
    "registryDependencies": [
      "banner-content",
      "banner-trigger"
    ],
    "uiDependencies": [],
    "files": [
      "library/banner/banner-shell.tsx"
    ],
    "type": "components:library"
  },
  {
    "name": "banner-switch",
    "dependencies": [],
    "registryDependencies": [
      "switch-w-thumb"
    ],
    "uiDependencies": [],
    "files": [
      "library/banner/banner-switch.tsx"
    ],
    "type": "components:library"
  },
  {
    "name": "banner-trigger",
    "dependencies": [
      "@trnsprncy/oss"
    ],
    "registryDependencies": [],
    "fileDependencies": [
      "utils"
    ],
    "uiDependencies": [
      "button"
    ],
    "files": [
      "library/banner/banner-trigger.tsx",
      "library/banner/utils/triggers.ts"
    ],
    "type": "components:library"
  },
  {
    "name": "bare-banner-trigger",
    "dependencies": [
      "@trnsprncy/oss"
    ],
    "registryDependencies": [],
    "fileDependencies": [
      "utils"
    ],
    "uiDependencies": [
      "toast",
      "button"
    ],
    "files": [
      "library/banner/bare-banner-trigger.tsx",
      "library/banner/utils/triggers.ts"
    ],
    "type": "components:library"
  },
  {
    "name": "switch-w-thumb",
    "dependencies": [
      "@radix-ui/react-switch"
    ],
    "registryDependencies": [],
    "uiDependencies": [],
    "files": [
      "library/banner/switch-w-thumb.tsx"
    ],
    "type": "components:library"
  },
  {
    "name": "trnsprncy-button",
    "fileDependencies":[
      "logic"
    ],
    "uiDependencies": [
      "button",
      "popover"
    ],
    "files": [
      "library/banner/trnsprncy-button.tsx",
      "library/banner/logic/banner-options.tsx",
    ],
    "type": "components:library"
  },
  {
    "name": "categorized-options",
    "dependencies": [
      "@trnsprncy/oss"
    ],
    "registryDependencies": [
      "banner-switch"
    ],
    "uiDependencies": [
      "accordion"
    ],
    "files": [
      "library/banner/categorized-options.tsx"
    ],
    "type": "components:library"
  },
  {
    "name": "fake-banner-demo",
    "dependencies": [
      "@trnsprncy/oss"
    ],
    "registryDependencies": [
      "banner-shell",
      "trnsprncy-button",
      "banner-trigger"
    ],
    "fileDependencies":[
      "logic",
      "demo",
      "hooks"
    ],
    "files": [
      "demo/fake-banner-demo.tsx",
      "library/banner/logic/banner-opt-base.tsx",
      "hooks/use-mock-browser-cookies"
    ],
    "type": "components:demo"
  }
];
