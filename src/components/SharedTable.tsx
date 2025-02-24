import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface SharedTableProps {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: TableName;
  idField: string;
}

type UpdateVariables = {
  rowId: string;
  field: string;
  value: any;
};

type SortConfig = {
  field: string;
  direction: "asc" | "desc";
};

const SharedTable = ({ data: initialData, columns, tableName, idField }: SharedTableProps) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: "created_at", direction: "desc" });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let sortedData = [...initialData];
    
    if (sort.field) {
      sortedData.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        
        return sort.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    setData(sortedData);
  }, [initialData, sort]);

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value }: UpdateVariables) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      setEditingCell(null);
    },
  });

  const createMutation = useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Record<string, any>) => {
      const { error } = await supabase
        .from(tableName)
        .insert([record]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      setNewRecord({});
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
    setActiveFilter(null);
  };

  const handleAdd = () => {
    const missingFields = columns
      .filter(col => col.required && !newRecord[col.field])
      .map(col => col.header);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    createMutation.mutate(newRecord);
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const formatCell = (value: any, columnFormat?: string) => {
    if (!value) return "";
    if (columnFormat === "M/D/YY") {
      return format(new Date(value), "M/d/yy");
    }
    if (columnFormat === "image" && typeof value === "string") {
      const imageUrl = supabase.storage
        .from("adsmith_assets")
        .getPublicUrl(value).data.publicUrl;
      return <img src={imageUrl} alt="thumbnail" className="w-16 h-16 object-cover rounded" />;
    }
    return value;
  };

  const renderCell = (row: ITableRow, column: ColumnDef) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
    const value = row[column.field];
    const displayValue = column.displayField ? row[column.displayField] : value;

    if (isEditing) {
      if (column.format === "image") {
        return <div>Image upload not implemented yet</div>;
      }

      if (column.inputMode === "select" && column.options) {
        return (
          <Select
            defaultValue={value}
            onValueChange={(newValue) => {
              updateMutation.mutate({ rowId: row.id, field: column.field, value: newValue });
            }}
          >
            <SelectTrigger>
              <SelectValue>{displayValue}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {column.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      return (
        <Input
          defaultValue={value}
          onBlur={(e) => {
            updateMutation.mutate({ rowId: row.id, field: column.field, value: e.target.value });
          }}
        />
      );
    }

    if (column.format) {
      return formatCell(value, column.format);
    }

    return displayValue;
  };

  const renderInput = (column: ColumnDef) => {
    if (column.field === 'created_at') return null;

    if (column.inputMode === "select" && column.options) {
      return (
        <Select
          value={newRecord[column.field] || ""}
          onValueChange={(value) => handleInputChange(column.field, value)}
        >
          <SelectTrigger className="h-10 bg-white">
            <SelectValue placeholder="" />
          </SelectTrigger>
          <SelectContent>
            {column.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={newRecord[column.field] || ""}
        onChange={(e) => handleInputChange(column.field, e.target.value)}
        className="h-10 bg-white"
        placeholder=""
      />
    );
  };

  return (
    <div>
      <div className="mb-[9px]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-4 bg-[#d3e4fd] p-4">
          {columns.map((column) => (
            <div key={column.field} className="relative">
              {renderInput(column)}
              {column.field === 'created_at' && (
                <Button
                  onClick={handleAdd}
                  className="absolute -bottom-[50px] left-0 h-10 w-[100px] rounded-full bg-[#ecb652] font-bold text-[#154851] border-2 border-white hover:bg-[#ecb652]/90"
                >
                  ADD
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Table>
        <TableHeader className="bg-[#154851]">
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
        </TableHeader>
        <TableBody className="bg-white">
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  className="text-[#2A2A2A]"
                  onClick={() => {
                    if (column.editable) {
                      setEditingCell({ rowId: row.id, field: column.field });
                    }
                  }}
                >
                  {renderCell(row, column)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SharedTable;
