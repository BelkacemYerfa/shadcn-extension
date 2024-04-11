import { Index } from "@/__registry__";
import { ComponentCard } from "@/components/cards/component-card";
import { SiteFooter } from "@/components/layouts/site-footer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description: "Browse all the components available in the registry.",
};

export default function ComponentsPage() {
  return (
    <main
      id="main-content"
      className="mx-auto max-w-6xl w-full flex-1 pt-20 space-y-2"
    >
      <div className="px-4 space-y-6 w-full">
        <div className="">
          <h1 className="text-base text-foreground sm:text-2xl font-semibold ">
            Browse Components
          </h1>
          <p className="text-sm text text-muted-foreground">
            Navigate to all the components available in the registry.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 w-full">
          {Object.entries(Index).map(([_, value]) => {
            return Object.entries(value).map(
              ([key, newValue]: [key: string, newValue: any]) => {
                const componentName = key;
                return newValue.type === "components:demo" ? (
                  <ComponentCard key={key} name={componentName} />
                ) : null;
              }
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
