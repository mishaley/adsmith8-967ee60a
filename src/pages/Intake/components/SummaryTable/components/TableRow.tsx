
import React from "react";

interface TableRowProps {
  label: string;
  children: React.ReactNode;
  contentPosition?: "default" | "below";
  centerContent?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({ 
  label, 
  children, 
  contentPosition = "default",
  centerContent = false
}) => {
  if (contentPosition === "below") {
    return (
      <tr>
        <td colSpan={2} className="border border-transparent p-4">
          <div className="font-medium mb-2">{label}</div>
          <div className={`min-w-[180px] ${centerContent ? 'flex justify-center' : ''}`}>
            {children}
          </div>
        </td>
      </tr>
    );
  }

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
