const themeConfig = {
  logo: <span>This is My logo</span>,
  project: {
    link: "https://github.com/BelkacemYerfa/shadcn-extension-components",
  },
  // ... other theme options
  useNextSeoProps() {
    return {
      icon: "/favicon.ico",
      title: "Shadcn Extension Components",
    };
  },
  footer: {
    text: "CopyRight 2024 - Shadcn Extension Components - All Rights Reserved",
  },
  chat: {
    icon: <span>💬</span>,
    link: "https://twitter.com/bylka0207",
  },
};

export default themeConfig;
