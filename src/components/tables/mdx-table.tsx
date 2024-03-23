import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

const NonValue = "--";

type TableData = {
  [key: string]: {
    value: string | string[];
    required?: boolean;
    description?: string | React.ReactNode;
  };
};

type MDXTableProps = {
  data: TableData[];
};

export function MDXTable({ data }: MDXTableProps) {
  const fields = Object.keys(data[0]);
  const fRowValues = Object.values(data[0]);
  return (
    <Table className="overflow-hidden">
      <TableHeader className="overflow-hidden bg-muted/60">
        <TableRow>
          {fRowValues.map((field) => (
            <TableHead
              key={field.value as string}
              className="w-fit capitalize text-sm text-foreground"
            >
              {field.value}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(
          (row, rowIndex) =>
            rowIndex !== 0 && (
              <TableRow
                key={`${rowIndex}-${fields[rowIndex]}`}
                className="hover:bg-transparent "
              >
                {fields.map((field) => {
                  const isArray = row[field].value instanceof Array;
                  const length = row[field].value.length;
                  return (
                    <TableCell key={`${rowIndex}-${row[field].value}`}>
                      <div className="flex items-center gap-1">
                        <kbd
                          className={cn(
                            "pointer-events-none select-none rounded px-1 font-mono font-medium opacity-100 flex items-center gap-1",
                            {
                              "bg-primary/95 text-primary-foreground ":
                                field === fields[0],
                              "bg-muted":
                                field !== fields[0] &&
                                row[field].value !== NonValue &&
                                isArray,
                            }
                          )}
                        >
                          {isArray
                            ? (row[field].value as string[]).map(
                                (value, index) => (
                                  <div
                                    key={`${index}-${value}`}
                                    className="flex items-center gap-1"
                                  >
                                    <span>
                                      {length > 1 ? (
                                        <span>&quot;{value}&quot;</span>
                                      ) : (
                                        value
                                      )}
                                    </span>
                                    {index !== row[field].value.length - 1 && (
                                      <span key={`${index}-separator`}>|</span>
                                    )}
                                  </div>
                                )
                              )
                            : row[field].value}
                          {row[field].required && (
                            <span className="text-primary-foreground font-bold text-sm">
                              *
                            </span>
                          )}
                        </kbd>
                        {row[field].description && (
                          <MiniInfoPopover>
                            {row[field].description ||
                              "This field is required."}
                          </MiniInfoPopover>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
}

type MiniInfoPopoverProps = {
  children: React.ReactNode;
};

const MiniInfoPopover = ({ children }: MiniInfoPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "size-6"
        )}
      >
        <span className="text-foreground text-xs font-bold">
          <Info className="size-4" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        sideOffset={5}
        align="center"
        className="p-2 rounded-lg text-sm "
      >
        {children}
      </PopoverContent>{" "}
    </Popover>
  );
};
