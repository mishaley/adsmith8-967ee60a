
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SharedTableProps {
  data: Array<{
    name: string;
    created_at: string;
    [key: string]: any;
  }>;
}

const SharedTable = ({ data }: SharedTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#154851]">
        <TableRow>
          <TableHead className="text-white font-bold uppercase">Name</TableHead>
          <TableHead className="text-white font-bold uppercase">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="text-[#2A2A2A]">{row.name}</TableCell>
            <TableCell className="text-[#2A2A2A]">
              {new Date(row.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SharedTable;
