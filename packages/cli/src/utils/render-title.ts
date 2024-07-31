import figlet from "figlet";

export function renderTitle(type: string) {
  const text = figlet.textSync(type, {
    font: "Small",
  });
  console.log(`\n${text}\n`);
}
