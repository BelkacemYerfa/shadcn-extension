# CONTRIBUTING

All Contributions are welcome, no matter how large or small.

Some thoughts to help you contribute to this project

## Recommended Communication Style



1. Always leave screenshots for visuals changes
2. Always leave a detailed description in the Pull Request. Leave nothing ambiguous for the reviewer.
3. Always review your code first. Do this by leaving comments in your coding noting questions, or interesting things for the reviewer.
4. Always communicate. Whether it is in the issue or the pull request, keeping the lines of communication helps everyone around you.



## Development (forks are preferred)

To fork the repo click here: [**fork shadcn-extenion**](https://github.com/BelkacemYerfa/shadcn-extension/fork)

```shell
$ git clone https://github.com/<your-name>/shadcn-extension.git
$ cd shadcn-extension
```



### Adding New Components

1. Create a new file with the components name in `src/registry/default/extension`

   ```tsx
   // src/registry/default/extension/sample-component.tsx
   
   interface SampleComponentProps {
     content: string;
   }
   
   const SampleComponent = ({content}:SampleComponentProps) => {
     return (
     	<div>{content ?? "Hello World!"}</div>
     );
   };
   
   export default SampleComponent;
   ```

   > Be sure to follow best practices and guidelines set forth in this document.

   

2. Add a new object for the component to the `extension` array in `src/registry/default/components.ts`

   ```ts
   import { Registry } from "./schema";
   
   const extension: Registry = [
   	{
   		name: "sample-component",
   		type: "components:extension",
   		dependencies: [], // include names of any packages this component depends on.
   		files: ["extension/sample-component.tsx"]
   	}
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
     return (
       <SampleComponent />
     );
   };
   
   export default SampleComponent;
   ```

2. Then add the demo to the `demos` array in the component registry file: `src/registry/default/components.ts`

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

1. Create a new folder for the examples in `src/registry/default/example/<component-name>.tsx`

   ```tsx
   // src/registry/default/example/sample-component/sample-component-content.tsx
   
   import { SampleComponent } from "@/registry/default/extension/sample-component";
   
   const SampleComponentContentTest = () => {
     return (
       <SampleComponent content="This is how we use the content prop" />
     );
   };
   
   export default SampleComponentContentTest;
   ```

2. Then add the demo to the `examples` array in the component registry file: `src/registry/default/components.ts`

   ```ts
   // src/registry/default/components.ts
   
   const examples: Registry = [
     {
       name: "sample-component-content",
       type: "components:demo",
       registryDependencies: [], // include names of any packages this component depends on.
       files: ["example/sample-component/sample-component-content.tsx"],
     },
   ];
   ```

   

### Adding New Docs

```js
// todo: add instructions for contributing to documentation
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

*Note that since PR titles only have a single line, you have to use the ! syntax for breaking changes.*

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more examples.

## License



This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/BelkacemYerfa/shadcn-extension/blob/master/LICENSE.md) file for details.