# Schadcn Extension Turborepo

This is the official starter for the Schadcn Extension Turborepo, a monorepo setup for developing and sharing reusable UI components.

## What is Turborepo?

Turborepo is a high-performance build system for JavaScript and TypeScript codebases. It is designed for scaling monorepos and also makes workflows in single-package workspaces faster, too. Turborepo optimizes build and development processes by caching, parallel execution, and dependency graph analysis.

## About This Repository

This repository is a monorepo, which means it contains multiple projects managed in a single codebase. This approach simplifies dependency management and sharing code between projects.

### Tools and Technologies Used:

- **pnpm**: A fast, disk space-efficient package manager.
- **Turborepo**: A build system for monorepos.
- **TypeScript**: A statically typed superset of JavaScript.
- **Next.js**: A React framework for production.

## Structure

The repository is structured as follows:

```
schadcn-extension-turborepo/
├── apps/
│   └── extension/
│       ├── content/
│       │   └── docs/
│       ├── public/
│       │   ├── registry/
│       │   ├── next.svg
│       │   ├── og.png
│       │   └── vercel.svg
│       ├── src/
│       │   ├── __registry__/
│       │   ├── app/
│       │   ├── components/
│       │   ├── config/
│       │   ├── hooks/
│       │   ├── lib/
│       │   ├── registry/
│       │   ├── script/
│       │   ├── types/
│       │   └── env.ts
├── packages/
│   ├── CLI/
│   │   ├── src/
│   │   ├── __tests__/
│   │   ├── commands/
│   │   ├── utils/
│   │   └── index.ts
│   ├── eslint-config/
│   │   ├── library.js
│   │   ├── next.js
│   │   ├── package.json
│   │   ├── react-internal.js
│   │   └── README.md
│   └── typescript-config/
│       ├── base.json
│       ├── nextjs.json
│       ├── package.json
│       └── react-library.json
└── pnpm-workspace.yaml
```

## Getting Started

### Cloning the Repository

First, clone the monorepo to your local machine:

```sh
git clone https://github.com/gaurangrshah/ext-temp.git
cd ext-temp
```

### Installation

Install all dependencies using `pnpm`:

```sh
pnpm install
```

### Building the Project

To build all apps and packages, run the following command:

```sh
pnpm build
```

This will compile the TypeScript code and prepare the project for development and production.

### Development

To start the development server for all apps and packages, run:

```sh
pnpm dev
```

This command will run the development servers and watch for changes, enabling live reload for a smoother development experience.

## CLI

The `@raphael-08/cli` package is a command-line interface (CLI) for adding components to your project. It helps automate repetitive tasks, such as creating new components or setting up configurations.

You can find detailed instructions for using the CLI in the [CLI README](https://github.com/BelkacemYerfa/shadcn-extension/blob/master/packages/cli/README.md).

## Additional Resources

- [pnpm Documentation](https://pnpm.io)
- [Turborepo Documentation](https://turbo.build/repo)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your changes. Make sure to follow the project's code of conduct and guidelines for contributing.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/BelkacemYerfa/shadcn-extension/blob/master/LICENSE.md) file for details.
