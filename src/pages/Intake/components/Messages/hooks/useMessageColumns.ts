import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export interface MessageColumn {
  id: string;
  type: string;
  content?: string;
}

export function useMessageColumns() {
  // Use a counter for unique column IDs
  const nextColumnIdRef = useRef(1);
  
  // Track active message columns - initialize with one column
  const [messageColumns, setMessageColumns] = useState<MessageColumn[]>([
    { id: `column-${nextColumnIdRef.current}`, type: "" }
  ]);
  
  // Keep a reference to any newly created user-provided cell that needs focus
  const [columnToFocus, setColumnToFocus] = useState<string | null>(null);

  // Effect to handle auto-focusing on newly selected user-provided cells
  useEffect(() => {
    if (columnToFocus) {
      // Find the editable div for this column and focus it
      const editableDiv = document.querySelector(`[data-column-id="${columnToFocus}"]`) as HTMLElement;
      if (editableDiv) {
        // Direct focus on the editable element
        editableDiv.focus();
        
        // Place cursor at the end of any existing content
        if (editableDiv.textContent) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(editableDiv);
          range.collapse(false); // collapse to end
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        
        // Reset after focusing
        setColumnToFocus(null);
      }
    }
  }, [columnToFocus]);

  // Add a new column
  const handleAddColumn = () => {
    // Increment the counter for next column ID
    nextColumnIdRef.current += 1;
    const newColumnId = `column-${nextColumnIdRef.current}`;
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
      
      // If the new type is user-provided, set this column for focusing
      if (newType === "user-provided") {
        setColumnToFocus(columnId);
      }
    }
  };

  // Handle user-provided content changes
  const handleContentChange = (columnId: string, newContent: string) => {
    setMessageColumns(messageColumns.map(column => 
      column.id === columnId ? { ...column, content: newContent } : column
    ));
  };

  return {
    messageColumns,
    handleAddColumn,
    handleMessageTypeChange,
    handleContentChange
  };
}
