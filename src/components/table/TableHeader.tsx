
import { TableHead, TableHeader as TableHeaderBase, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import { ColumnDef } from "@/types/table";
import { RefObject } from "react";

interface TableHeaderProps {
  columns: ColumnDef[];
  activeFilter: string | null;
  setActiveFilter: (field: string | null) => void;
  handleSort: (field: string, direction: "asc" | "desc") => void;
  searchInputRef: RefObject<HTMLInputElement>;
}

export function TableHeader({
  columns,
  activeFilter,
  setActiveFilter,
  handleSort,
  searchInputRef,
}: TableHeaderProps) {
  return (
    <TableHeaderBase className="bg-[#154851]">
      <TableRow>
        {columns.map((column) => (
          <TableHead 
            key={column.field} 
            className="text-white font-bold uppercase h-10 whitespace-nowrap"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{column.header}</span>
              <Popover 
                open={activeFilter === column.field}
                onOpenChange={(open) => {
                  setActiveFilter(open ? column.field : null);
                  if (open) {
                    setTimeout(() => {
                      searchInputRef.current?.focus();
                    }, 0);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6 shrink-0 text-white hover:bg-[#1e5f6a]"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="start">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleSort(column.field, "asc")}
                      >
                        Sort A to Z
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => handleSort(column.field, "desc")}
                      >
                        Sort Z to A
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Input
                        ref={searchInputRef}
                        placeholder="Search..."
                        className="h-8"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TableHead>
        ))}
      </TableRow>
    </TableHeaderBase>
  );
}
