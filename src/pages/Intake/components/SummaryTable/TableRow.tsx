
import React from "react";

interface TableRowProps {
  label: string;
  children: React.ReactNode;
}

const TableRow: React.FC<TableRowProps> = ({ label, children }) => {
  return (
    <tr>
      <td className="border border-transparent p-4 whitespace-nowrap font-medium">
        {label}
      </td>
      <td className="border border-transparent p-4">
        <div className="min-w-[180px]">
          {children}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
