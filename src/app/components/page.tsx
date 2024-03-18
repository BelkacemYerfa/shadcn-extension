import { Index } from "@/__registry__";
import { SiteFooter } from "@/components/layouts/site-footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
              const componentName = key
                .replace("example", "")
                .split("-")
                .join(" ");
              const Component = newValue.component;
              return newValue.type === "components:example" ? (
                <Card key={key} className="space-y-2 border-0">
                  <CardTitle>
                    <Link
                      href={`/docs/${componentName
                        .trim()
                        .toLowerCase()
                        .split(" ")
                        .join("-")}`}
                      className="flex items-center gap-2 group"
                    >
                      <span className="capitalize text-foreground/80 text-base font-semibold duration-300 ease-in-out group-hover:text-foreground ">
                        {componentName}
                      </span>
                      <ArrowRight className="size-3 duration-200 ease-in-out group-hover:translate-x-1" />
                    </Link>
                  </CardTitle>
                  <CardContent className="relative h-60 dark:bg-grid-small-white/[0.2] bg-grid-small-black/[0.2] rounded-md p-3 flex items-center justify-center ring-1 ring-border overflow-hidden">
                    <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                    <Suspense fallback={<p>loading</p>}>
                      <div className=" mx-auto scale-75 w-full ">
                        {<Component />}
                      </div>
                    </Suspense>
                  </CardContent>
                </Card>
              ) : null;
            }
          );
        })}
      </div>
      <SiteFooter />
    </main>
  );
}
