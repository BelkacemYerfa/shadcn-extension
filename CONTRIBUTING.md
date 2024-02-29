# CONTRIBUTING

All Contributions are welcome, no matter how large or small.

Some thoughts to help you contribute to this project

## Recommended Communication Style

1. Always leave screenshots for visuals changes
1. Always leave a detailed description in the Pull Request. Leave nothing ambiguous for the reviewer.
1. Always review your code first. Do this by leaving comments in your coding noting questions, or interesting things for the reviewer.
1. Always communicate. Whether it is in the issue or the pull request, keeping the lines of communication helps everyone around you.

## Setup (forks are preferred).

```sh
$ git clone https://github.com/<your-name>/shadcn-extension.git
$ cd shadcn-extension
```

then choose one of the following:

1. `cd packages` and run `npm install`
2. `cd docs` and run `npm install`

## Building

```sh
$ npm run build
```

## Pull Requests

### _We actively welcome your pull requests, however linking your work to an existing issue is preferred._

1. Fork the repo and create your branch
2. Name your branch something that is descriptive to the work you are doing. i.e. adds-new-thing or fixes-issue-thing
3. Make sure you address any lint warnings.
4. If you make the existing code better, please let us know in your PR description.
5. A PR description and title are required. The title is required to begin with: "fix:" or "feat:" or "refactor:" .

### PR Validation

Examples for valid PR titles:

- `fix: add missing type to the Button component`
- `feat: add new prop to the Avatar component`
- `refactor!: remove unused imports from the Avatar component`

_Note that since PR titles only have a single line, you have to use the ! syntax for breaking changes._

See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more examples.

## License

This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details.
