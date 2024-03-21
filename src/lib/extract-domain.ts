export const extractDomain = async (link: string) => {
  const domain = new URL(link).hostname
    .replaceAll("www.", "")
    .split(".")[0]
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return domain;
};
