# CONTRIBUTING

All Contributions are welcome, no matter how large or small.

Some thoughts to help you contribute to this project

## Recommended Communication Style

1. Always leave screenshots for visuals changes
2. Always leave a detailed description in the Pull Request. Leave nothing ambiguous for the reviewer.
3. Always review your code first. Do this by leaving comments in your coding noting questions, or interesting things for the reviewer.
4. Always communicate. Whether it is in the issue or the pull request, keeping the lines of communication helps everyone around you.

## Development (forks are preferred)

To fork the repo click here: [**fork shadcn-extension**](https://github.com/BelkacemYerfa/shadcn-extension/fork)

```shell
$ git clone https://github.com/<your-name>/shadcn-extension.git
$ cd shadcn-extension
```

### Setup analytics

1. Create a new project in posthog

2. Copy the env variables to the `.env.example` file

   ```
   POSTHOG_API_KEY=your-api-key
   POSTHOG_HOST=your-host
   ```

3. Rename the `.env.example` file to `.env.local`

### Adding New Components

1. Create a new file with the components name in `src/registry/default/extension`

   ```tsx
   // src/registry/default/extension/sample-component.tsx

   interface SampleComponentProps {
     content: string;
   }

   const SampleComponent = ({ content }: SampleComponentProps) => {
     return <div>{content ?? "Hello World!"}</div>;
   };

   export default SampleComponent;
   ```

   > Be sure to follow best practices and guidelines set forth in this document.

2. Register the component in the `extension` array in `src/registry/default/components.ts`

   ```ts
   import { Registry } from "./schema";

   const extension: Registry = [
     {
       name: "sample-component",
       type: "components:extension",
       dependencies: [], // include names of any packages this component depends on.
       files: ["extension/sample-component.tsx"],
     },
   ];
   ```

3. Then run the **registry build** script

   ```shell
   npm run build:registry
   ```

   > This should generate a new version of the `src/__registry__/index.tsx` file.

### Adding Demos

Demos are used in the docs to show the base implementation of the component using our provided defaults.

1. Create a new file for the demo in `src/registry/default/example/`

   ```tsx
   // src/registry/default/example/sample-component-demo.tsx

   import { SampleComponent } from "@/registry/default/extension/sample-component";

   const SampleComponentTest = () => {
     return <SampleComponent />;
   };

   export default SampleComponentTest;
   ```

2. Then register the demo component in `demos` array in the component registry file: `src/registry/default/components.ts`

   ```ts
   // src/registry/default/components.ts
   
   const demos: Registry = [
     {
       name: "sample-component-demo",
       type: "components:demo",
       registryDependencies: [], // include names of any packages this component depends on.
       files: ["example/sample-component-demo.tsx"],
     },
   ];
   ```

### Adding Examples

Examples are similar to demos, but used to individually demonstrate different variants, props or features of each component.

1. Create a new folder for the examples as `src/registry/default/example/<component-name>.tsx`

   ```tsx
   // src/registry/default/example/sample-component/sample-component-content.tsx

   import { SampleComponent } from "@/registry/default/extension/sample-component";

   const SampleComponentContentTest = () => {
     return <SampleComponent content="This is how we use the content prop" />;
   };

   export default SampleComponentContentTest;
   ```

2. Then register the example to the `examples` array in the component registry file: `src/registry/default/components.ts`

   ```ts
   // src/registry/default/components.ts
      
   const examples: Registry = [
     {
       name: "sample-component-content",
       type: "components:example",
       registryDependencies: [], // include names of any packages this component depends on.
       files: ["example/sample-component/sample-component-content.tsx"],
     },
   ];
   ```

### Adding New Docs

```shell
touch src/content/docs/sample-component.mdx
```

```markdown
---
title: Sample Component
description: A simple sample component
---
```

> We can also include links to our dependencies for each of the components here if we have any:
> ```markd
> ---
> links:
>   - title: shadcn-ui
>     url: https://ui.shadcn.com/docs/components/input
>   - title: react-otp-input
>     url: https://devfolioco.github.io/react-otp-input/
> ---
> ```
>
> > this example shows how we display component dependencies in the docs

````markdown

<ComponentPreview name="sample-component" />

## Installation

<Tabs defaultValue="manual">

<TabsList>
  <TabsTrigger value="manual">Manual</TabsTrigger>
  <TabsTrigger value="cli">CLI</TabsTrigger>
</TabsList>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="sample-component" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

<TabsContent value="cli">

<Callout className="mt-6">
  Currently there is no CLI command for this component. since we haven't created
  it yet.
</Callout>

</TabsContent>

</Tabs>

## Usage

```tsx
import { SampleComponent } from "@/components/extension/sample-component";
```

```tsx
<SampleComponent
	content="this a demo of the SampleComponent"
/>
```

## Example

### Form

```tsx showLineNumbers {1 , 3 , 16-21  }

{...}

const SampleComponentVariant = ()=>{
  return (
     <SampleComponent content="variant" />
  )
}

```

<ComponentPreview name="sample-component-demo" />
````

Add to docs config:
```ts
// src/config/docs-config.ts

export const docsConfig: DocsConfig[] = [
  // ...
  },
  {
    title: "Components",
    pages: [
      {
        title: "Sample component",
        path: "/docs/sample-component",
      },
    ],
  },
];

```





## Builds

```shell
npm run build
```

## PR Validation

Examples for valid PR titles:

- `fix: add missing type to the Button component`
- `feat: add new prop to the Avatar component`
- `refactor!: remove unused imports from the Avatar component`

_Note that since PR titles only have a single line, you have to use the ! syntax for breaking changes._

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more examples.

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/BelkacemYerfa/shadcn-extension/blob/master/LICENSE.md) file for details.
