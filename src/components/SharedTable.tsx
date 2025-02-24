
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition, TableData, TableName } from "@/types/table";
import { format } from "date-fns";

interface SharedTableProps {
  tableName: TableName;
  columns: ColumnDefinition[];
  data: TableData[];
  refetchKey: string;
}

const SharedTable = ({ tableName, columns, data = [], refetchKey }: SharedTableProps) => {
  const [editingCell, setEditingCell] = useState<{
    rowId: string;
    field: string;
  } | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const queryClient = useQueryClient();

  const { mutate: updateCell } = useMutation({
    mutationFn: async ({ rowId, field, value }: { rowId: string; field: string; value: any }) => {
      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq('id', rowId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [refetchKey] });
      setEditingCell(null);
    },
  });

  const renderCell = (row: TableData, column: ColumnDefinition) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
    const value = row[column.field];

    if (isEditing) {
      switch (column.inputMode) {
        case "text":
          return (
            <Input
              defaultValue={value}
              onBlur={(e) => {
                updateCell({ rowId: row.id, field: column.field, value: e.target.value });
              }}
            />
          );
        default:
          return value;
      }
    }

    if (column.format === "M/D/YY" && value) {
      return format(new Date(value), "M/d/yy");
    }

    return value;
  };

  return (
    <Table>
      <TableHeader className="bg-[#154851]">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.field} className="text-white font-bold uppercase">
              {column.header}
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
                    setEditValue(row[column.field]);
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
  );
};

export default SharedTable;
