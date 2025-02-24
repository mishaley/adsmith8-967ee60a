import { useState } from "react";
import { TableName } from "@/types/table";
import { Database } from "@/integrations/supabase/types";

type Tables = Database['public']['Tables'];
type TableColumns<T extends TableName> = keyof Tables[T]['Row'];

export interface ChangeHistoryEntry<T extends TableName = TableName> {
  rowId: string;
  field: TableColumns<T>;
  oldValue: any;
  newValue: any;
  tableName: T;
  isDelete?: boolean;
  oldData?: any;
}

const MAX_HISTORY = 100;

export function useTableHistory<T extends TableName>() {
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = (change: ChangeHistoryEntry<T>) => {
    // Remove any future history if we're not at the end
    const newHistory = changeHistory.slice(0, currentIndex + 1);
    
    // Add the new change and keep only the last MAX_HISTORY changes
    const updatedHistory = [...newHistory, change].slice(-MAX_HISTORY);
    setChangeHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  };

  return {
    changeHistory,
    currentIndex,
    setCurrentIndex,
    addToHistory
  };
}
