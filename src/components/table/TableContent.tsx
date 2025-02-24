
import { TableBody, TableRow } from "@/components/ui/table";
import { ColumnDef, TableRow as ITableRow } from "@/types/table";
import { TableCellComponent } from "./TableCell";

interface TableContentProps {
  data: ITableRow[];
  columns: ColumnDef[];
  activeCell: { rowId: string; field: string } | null;
  handleCellUpdate: (field: string, value: any) => void;
  handleSave: (rowId: string, field: string) => void;
  handleCellClick: (rowId: string, field: string) => void;
}

export function TableContent({
  data,
  columns,
  activeCell,
  handleCellUpdate,
  handleSave,
  handleCellClick,
}: TableContentProps) {
  return (
    <TableBody className="bg-white">
      {data.map((row) => (
        <TableRow 
          key={row.id}
          className="hover:bg-gray-50/80 table-row"
        >
          {columns.map((column) => (
            <TableCellComponent
              key={column.field}
              row={row}
              column={column}
              isEditing={activeCell?.rowId === row.id && activeCell?.field === column.field}
              onUpdate={(value) => handleCellUpdate(column.field, value)}
              onSave={() => handleSave(row.id, column.field)}
              onCancel={() => {
                handleCellClick("", "");
              }}
              onClick={() => handleCellClick(row.id, column.field)}
            />
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}
