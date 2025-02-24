
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SharedTableProps {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: TableName;
  idField: string;
}

const SharedTable = ({ data, columns, tableName, idField }: SharedTableProps) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateCell } = useMutation({
    mutationFn: async ({ rowId, field, value }: { rowId: string; field: string; value: any }) => {
      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the appropriate query based on the table being updated
      const queryKey = [tableName.replace(/^\w+/, "").toLowerCase()];
      queryClient.invalidateQueries({ queryKey });
      setEditingCell(null);
    },
  });

  const formatCell = (value: any, columnFormat?: string) => {
    if (!value) return "";
    if (columnFormat === "M/D/YY") {
      return format(new Date(value), "M/d/yy");
    }
    return value;
  };

  const renderCell = (row: ITableRow, column: ColumnDef) => {
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === column.field;
    const value = row[column.field];
    const displayValue = column.displayField ? row[column.displayField] : value;

    if (isEditing) {
      if (column.inputMode === "select" && column.options) {
        return (
          <Select
            defaultValue={value}
            onValueChange={(newValue) => {
              updateCell({ rowId: row.id, field: column.field, value: newValue });
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
            updateCell({ rowId: row.id, field: column.field, value: e.target.value });
          }}
        />
      );
    }

    if (column.format === "M/D/YY") {
      return formatCell(value, column.format);
    }

    return displayValue;
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
