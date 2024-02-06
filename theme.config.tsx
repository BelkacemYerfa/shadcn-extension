export default {
  logo: <span>this is my logo</span>,
  project: {
    link: "https://github.com/BelkacemYerfa/shadcn-extension-components",
  },
  footer: {
    text: (
      <span>
        MIT {new Date().getFullYear()} ©{" "}
        <a href="https://nextra.site" target="_blank">
          Extension
        </a>
        .
      </span>
    ),
  },
  banner: {
    key: "0.1-release",
    text: (
      <a href="https://nextra.site" target="_blank">
        🎉 Extension 0.1 is released. Read more →
      </a>
    ),
  },
  navigation: {
    prev: true,
    next: true,
  },
};
