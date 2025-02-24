
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { ColumnDef, TableRow as ITableRow, TableName, TableData } from "@/types/table";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TableHeader } from "./table/TableHeader";
import { InputRow } from "./table/InputRow";
import { TableCellComponent } from "./table/TableCell";
import { TableCell } from "./ui/table";
import { Database } from "@/integrations/supabase/types";

interface SharedTableProps<T extends TableName> {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: T;
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

function SharedTable<T extends TableName>({ data: initialData, columns, tableName, idField }: SharedTableProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: "created_at", direction: "desc" });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Partial<TableData<T>>>({});
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
      const updateData = { [field]: value };
      
      const { error } = await supabase
        .from(tableName)
        .update(updateData)
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
    mutationFn: async (record: Partial<TableData<T>>) => {
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

  return (
    <div>
      <InputRow<T>
        tableName={tableName}
        columns={columns}
        newRecord={newRecord}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
      />

      <Table>
        <TableHeader
          columns={columns}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          handleSort={handleSort}
          searchInputRef={searchInputRef}
        />
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
                  <TableCellComponent
                    row={row}
                    column={column}
                    isEditing={editingCell?.rowId === row.id && editingCell?.field === column.field}
                    onUpdate={(value) => {
                      updateMutation.mutate({ rowId: row.id, field: column.field, value });
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SharedTable;
