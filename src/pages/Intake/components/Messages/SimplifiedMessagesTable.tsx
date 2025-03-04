
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SimplifiedMessagesTable: React.FC = () => {
  const [selectedMessageType, setSelectedMessageType] = useState<string>("");
  const messageTypes = ["pain-point", "unique-offering", "value-prop", "user-provided"];

  return (
    <div className="mt-6 border rounded overflow-auto">
      <table className="w-full table-fixed border-collapse">
        <colgroup>
          <col className="w-64" /> {/* Fixed width for persona column */}
          <col /> {/* Auto width for message column */}
        </colgroup>
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left w-64">Persona</th>
            <th className="border p-2 text-left">
              <Select value={selectedMessageType} onValueChange={setSelectedMessageType}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  {messageTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <td className="border p-2 align-top">
              <div className="min-h-[60px] flex items-center justify-center">
                {selectedMessageType ? (
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
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SimplifiedMessagesTable;
