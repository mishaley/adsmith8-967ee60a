import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from "../../../utils/localStorageUtils";

export interface MessageColumn {
  id: string;
  type: string;
  content?: string;
}

export function useMessageColumns() {
  // Use a counter for unique column IDs
  const nextColumnIdRef = useRef(1);
  
  // Track active message columns - initialize with one column or from localStorage
  const [messageColumns, setMessageColumns] = useState<MessageColumn[]>(() => {
    const savedColumns = loadFromLocalStorage<MessageColumn[]>(STORAGE_KEYS.MESSAGES + "_columns", [
      { id: `column-${nextColumnIdRef.current}`, type: "" }
    ]);
    
    // Find the highest column ID number to set nextColumnIdRef properly
    if (savedColumns.length > 0) {
      const columnIds = savedColumns
        .map(col => {
          const match = col.id.match(/column-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter(num => !isNaN(num));
      
      if (columnIds.length > 0) {
        nextColumnIdRef.current = Math.max(...columnIds) + 1;
      }
    }
    
    return savedColumns;
  });
  
  // Keep a reference to any newly created user-provided cell that needs focus
  const [columnToFocus, setColumnToFocus] = useState<string | null>(null);

  // Save message columns to localStorage when they change
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.MESSAGES + "_columns", messageColumns);
  }, [messageColumns]);

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
