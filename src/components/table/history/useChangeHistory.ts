
import { useState, useCallback } from 'react';
import { TableName } from "@/types/table";
import { toast } from "sonner";

export interface ChangeHistoryEntry {
  rowId: string;
  field: string;
  oldValue: any;
  newValue: any;
  tableName: TableName;
}

const MAX_HISTORY = 100;

export const useChangeHistory = (updateFn: (params: any) => Promise<any>) => {
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((rowId: string, field: string, oldValue: any, newValue: any, tableName: TableName) => {
    const newHistory = changeHistory.slice(0, currentIndex + 1);
    const newChange: ChangeHistoryEntry = {
      rowId,
      field,
      oldValue,
      newValue,
      tableName
    };
    const updatedHistory = [...newHistory, newChange].slice(-MAX_HISTORY);
    setChangeHistory(updatedHistory);
    setCurrentIndex(updatedHistory.length - 1);
  }, [changeHistory, currentIndex]);

  const undo = useCallback(async () => {
    if (currentIndex >= 0) {
      const change = changeHistory[currentIndex];
      try {
        await updateFn({
          rowId: change.rowId,
          field: change.field,
          value: change.oldValue,
          isUndo: true
        });
        setCurrentIndex(currentIndex - 1);
        toast.success("Change undone");
      } catch (error) {
        toast.error("Failed to undo change");
      }
    }
  }, [currentIndex, changeHistory, updateFn]);

  const redo = useCallback(async () => {
    if (currentIndex < changeHistory.length - 1) {
      const change = changeHistory[currentIndex + 1];
      try {
        await updateFn({
          rowId: change.rowId,
          field: change.field,
          value: change.newValue,
          isUndo: true
        });
        setCurrentIndex(currentIndex + 1);
        toast.success("Change redone");
      } catch (error) {
        toast.error("Failed to redo change");
      }
    }
  }, [currentIndex, changeHistory, updateFn]);

  return {
    addToHistory,
    undo,
    redo,
    hasUndo: currentIndex >= 0,
    hasRedo: currentIndex < changeHistory.length - 1
  };
};
