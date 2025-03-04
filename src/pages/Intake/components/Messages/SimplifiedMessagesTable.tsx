import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SimplifiedMessagesTable: React.FC = () => {
  // Track active message columns - initialize with one column
  const [messageColumns, setMessageColumns] = useState<{id: string, type: string}[]>([
    { id: "column-1", type: "" }
  ]);
  
  const messageTypes = ["pain-point", "unique-offering", "value-prop", "user-provided"];

  // Add a new column
  const handleAddColumn = () => {
    const newColumnId = `column-${messageColumns.length + 1}`;
    setMessageColumns([...messageColumns, { id: newColumnId, type: "" }]);
    toast.success("New message column added");
  };

  // Update message type for a specific column
  const handleMessageTypeChange = (columnId: string, newType: string) => {
    if (newType === "remove") {
      // If "remove" is selected, remove this column
      setMessageColumns(messageColumns.filter(column => column.id !== columnId));
      toast.success("Message column removed");
    } else {
      // Otherwise update the column type
      setMessageColumns(messageColumns.map(column => 
        column.id === columnId ? { ...column, type: newType } : column
      ));
    }
  };

  return (
    <div className="mt-6 border rounded overflow-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-64" /> {/* Fixed width for persona column */}
          {messageColumns.map(column => (
            <col key={`col-${column.id}`} /> /* Auto width for message columns */
          ))}
          <col className="w-16" /> {/* Fixed width for add column button */}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-64">Persona</th>
            
            {/* Render each message type column */}
            {messageColumns.map(column => (
              <th key={column.id} className="border p-2 text-left">
                <Select 
                  value={column.type} 
                  onValueChange={(value) => handleMessageTypeChange(column.id, value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select message type" />
                  </SelectTrigger>
                  <SelectContent>
                    {messageTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </SelectItem>
                    ))}
                    {/* Add remove option with red text */}
                    <SelectItem key="remove" value="remove" className="text-red-500">
                      <div className="flex items-center">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </th>
            ))}
            
            {/* Add column button */}
            <th className="border p-2 text-center w-16">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-8 w-8"
                onClick={handleAddColumn}
                title="Add another message column"
              >
                <PlusCircle className="h-6 w-6 text-gray-500 hover:text-[#0c343d]" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="border p-2">
              {/* Placeholder persona cell with gray box and blank text */}
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center mr-2">
                  {/* Empty gray placeholder box */}
                </div>
                <div>
                  <div className="text-sm text-gray-300">
                    {/* Blank gender and age */}
                    Gender, Age Range
                  </div>
                  <div className="text-sm text-gray-300">
                    {/* Blank interests */}
                    Interests
                  </div>
                </div>
              </div>
            </td>
            
            {/* Render message cells for each column */}
            {messageColumns.map(column => (
              <td key={column.id} className="border p-2 align-top">
                <div className="min-h-[60px] flex items-center justify-center">
                  {column.type ? (
                    <div className="text-gray-400 text-center">
                      Select a message type to generate content
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center">
                      No message selected
                    </div>
                  )}
                </div>
              </td>
            ))}
            
            {/* Empty cell for "+" button column */}
            <td className="border p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SimplifiedMessagesTable;
