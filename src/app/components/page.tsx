import { Index } from "@/__registry__";
import { ComponentCard } from "@/components/cards/component-card";
import { SiteFooter } from "@/components/layouts/site-footer";

export default function ComponentsPage() {
  return (
    <main className="mx-auto max-w-7xl flex-1 pt-20 pb-3 px-4 space-y-6">
      <div className="">
        <h1 className="text-base text-foreground sm:text-2xl font-semibold ">
          Browse Components
        </h1>
        <p className="text-sm text text-muted-foreground">
          Navigate to all the components available in the registry.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
        {Object.entries(Index).map(([_, value]) => {
          return Object.entries(value).map(
            ([key, newValue]: [key: string, newValue: any]) => {
              const componentName = key;
              return newValue.type === "components:example" ? (
                <ComponentCard key={key} name={componentName} />
              ) : null;
            }
          );
        })}
      </div>
      <SiteFooter />
    </main>
  );
}
