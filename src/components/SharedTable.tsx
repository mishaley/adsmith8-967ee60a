
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ColumnDef, TableRow as ITableRow } from "@/types/table";

interface SharedTableProps {
  data: ITableRow[];
  columns: ColumnDef[];
}

const SharedTable = ({ data, columns }: SharedTableProps) => {
  const formatCell = (value: any, columnFormat?: string) => {
    if (!value) return "";
    if (columnFormat === "M/D/YY") {
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
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.field} className="text-[#2A2A2A]">
                {formatCell(row[column.field], column.format)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SharedTable;
