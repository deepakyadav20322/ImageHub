import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  columns: ColumnDef<any>[];
  onSortChange: (value: string) => void;
}

export const SortDropdown = ({
  sortBy,
  setSortBy,
  columns,
  onSortChange,
}: SortDropdownProps) => {
  const seenKeys = new Set<string>();

  const uniqueColumns = columns.filter((column) => {
    const key = (column as any).accessorKey || column.id;
    if (!key || seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  const baseOptions = [
    { value: "_score", label: "Relevance" },
    { value: "createdAt:desc", label: "Newest first" },
    { value: "createdAt:asc", label: "Oldest first" },
  ];

  // Create toggleable sort options
const columnOptions = uniqueColumns
  .map((column, index) => {
    const key = (column as any).accessorKey || column.id;
    if (!key) return null; // skip completely invalid columns

    let label: string;

    if (typeof column.header === "string") {
      label = column.header;
    } else if (typeof column.header === "function") {
      label = key; // fallback to key if dynamic header
    } else {
      label = String(column.header ?? `Column ${index + 1}`);
    }

    if (!label || label.trim() === "") return null; // skip unnamed

    const current = sortBy.startsWith(key);
    const isAsc = sortBy === `${key}:asc`;
    const nextValue = isAsc ? `${key}:desc` : `${key}:asc`;
    const nextLabel = `${label} (${isAsc ? "Z-A" : "A-Z"})`;

    return { value: nextValue, label: nextLabel, key };
  })
  .filter((opt): opt is { value: string; label: string; key: string } => opt !== null);


  const allOptions = [...baseOptions, ...columnOptions];

  const currentLabel =
    allOptions.find((opt) => opt.value === sortBy)?.label || "Sort by";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {currentLabel}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={sortBy}
          onValueChange={(value) => {
            setSortBy(value);
            onSortChange(value);
          }}
        >
          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
            Default Sorting
          </div>
          {baseOptions.map((option,ind) => (
           <DropdownMenuRadioItem
           key={ind}
           value={option.value}
           className={cn("cursor-pointer", {
             "font-semibold text-primary": sortBy === option.value,
           })}
         >
           {option.label}
         </DropdownMenuRadioItem>
         
          ))}

          <div className="px-2 py-1 text-xs font-semibold text-muted-foreground mt-2">
            Sort By Column
          </div>
          {columnOptions.map((option) => (
            <DropdownMenuRadioItem key={option.key} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
