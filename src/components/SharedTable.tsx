
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

// Define the shape of the variables
type UpdateVariables = {
  rowId: string;
  field: string;
  value: any;
};

// Extract the mutation function
const updateRow = async (
  tableName: TableName,
  idField: string,
  variables: UpdateVariables
): Promise<void> => {
  const { error } = await supabase
    .from(tableName)
    .update({ [variables.field]: variables.value })
    .eq(idField, variables.rowId);

  if (error) throw error;
};

const SharedTable = ({ data, columns, tableName, idField }: SharedTableProps) => {
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);
  const queryClient = useQueryClient();

  // Store the query key in a variable
  const queryKey = tableName.replace(/^\w+/, "").toLowerCase();

  const updateMutation = useMutation<void, Error, UpdateVariables>({
    mutationFn: (variables) => updateRow(tableName, idField, variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setEditingCell(null);
    },
  });

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
        // TODO: Implement image upload functionality
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
