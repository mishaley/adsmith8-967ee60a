
import React from "react";
import { MessageColumn } from "../hooks/useMessageColumns";

interface MessageCellProps {
  column: MessageColumn;
  onContentChange: (columnId: string, newContent: string) => void;
}

const MessageCell: React.FC<MessageCellProps> = ({ column, onContentChange }) => {
  if (column.type === "user-provided") {
    return (
      <div 
        className="min-h-[60px] w-full h-full"
        style={{ position: "relative" }}
      >
        <div
          contentEditable
          data-column-id={column.id}
          className="absolute inset-0 overflow-auto flex items-center justify-center"
          style={{ 
            outline: "none",
            resize: "none",
            padding: "0",
            margin: "0",
            background: "transparent",
            textAlign: "center"
          }}
          onInput={(e) => onContentChange(
            column.id, 
            (e.target as HTMLDivElement).textContent || ""
          )}
          suppressContentEditableWarning={true}
        >
          {column.content}
        </div>
      </div>
    );
  } 

  return (
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
  );
};

export default MessageCell;
