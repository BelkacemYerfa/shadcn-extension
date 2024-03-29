import fs from "fs";

interface Dependency {
  importedItems: string[];
  modulePath: string;
}

function extractDependencies(fileContent: string): Dependency[] {
  const regex = /import\s+\{(.*?)\}\s+from\s+"(.*?)"/gs;
  const dependencies: Dependency[] = [];

  let match: RegExpExecArray | null;
  while ((match = regex.exec(fileContent)) !== null) {
    const importedItems = match[1]
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const modulePath = match[2];

    dependencies.push({
      importedItems,
      modulePath,
    });
  }

  return dependencies;
}

function extractComponentContent(fileContent: string): string {
  // Remove the "use client" line
  const contentWithoutUseClient = fileContent.replace(
    /"use client"\s*;\s*/,
    ""
  );

  // Extract the component content
  const componentRegex =
    /const\s+(\w+)\s*=\s*\(\s*\)\s*=>\s*{([\s\S]*?)}\s*;\s*export\s+default\s+\w+\s*;/g;
  let match = componentRegex.exec(contentWithoutUseClient);
  if (match !== null) {
    return (
      "const " +
      match[1] +
      " = () => {" +
      match[2] +
      "};\n\nrender(<" +
      match[1] +
      " />)"
    );
  }

  return "";
}

export const readFieContent = (name: string) => {
  const correctName = name.toLowerCase().split(" ").join("-") + "-demo";
  const filePath = `src/registry/default/example/${correctName}.tsx`;
  const file = fs.readFileSync(filePath, "utf-8");
  return file;
};

export const getComponentDependencies = (name: string) => {
  const fileContent = readFieContent(name);
  const dependencies = extractDependencies(fileContent);

  return dependencies;
};

export const getComponentContent = (name: string) => {
  const fileContent = readFieContent(name);
  const componentContent = extractComponentContent(fileContent);
  return componentContent;
};
