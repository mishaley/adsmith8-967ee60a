
import { toast } from "sonner";
import { TableName, DbRecord, DbInsert, asTableField } from "@/types/table";
import { useUpdateMutation } from "./mutations/useUpdateMutation";
import { useCreateMutation } from "./mutations/useCreateMutation";
import { useTableHistory } from "./hooks/useTableHistory";
import { useTableKeyboardShortcuts } from "./hooks/useTableKeyboardShortcuts";
import { supabase } from "@/integrations/supabase/client";

interface TableMutationsResult<T extends TableName> {
  updateMutation: ReturnType<typeof useUpdateMutation>;
  createMutation: ReturnType<typeof useCreateMutation>;
}

export function useTableMutations<T extends TableName>(
  tableName: T,
  idField: keyof DbRecord<T>
): TableMutationsResult<T> {
  const { changeHistory, currentIndex, setCurrentIndex, addToHistory } = useTableHistory<T>();
  
  const updateMutation = useUpdateMutation({ 
    tableName, 
    idField, 
    onHistoryChange: addToHistory 
  });

  const createMutation = useCreateMutation({ tableName, idField });

  const undo = async () => {
    if (currentIndex >= 0) {
      const change = changeHistory[currentIndex];
      try {
        if (change.isDelete) {
          const insertData = change.oldData as DbInsert<T>;
          const { error } = await supabase
            .from(tableName)
            .insert([insertData]);
            
          if (error) throw error;
        } else {
          await updateMutation.mutateAsync({
            rowId: change.rowId,
            field: asTableField<T>(String(change.field)),
            value: change.oldValue,
            isUndo: true
          });
        }
        setCurrentIndex(currentIndex - 1);
        toast.success("Change undone");
      } catch (error) {
        toast.error("Failed to undo change");
      }
    }
  };

  const redo = async () => {
    if (currentIndex < changeHistory.length - 1) {
      const change = changeHistory[currentIndex + 1];
      try {
        if (change.isDelete) {
          const { error } = await supabase
            .from(tableName)
            .delete()
            .eq(String(idField), change.rowId);
            
          if (error) throw error;
        } else {
          await updateMutation.mutateAsync({
            rowId: change.rowId,
            field: asTableField<T>(String(change.field)),
            value: change.newValue,
            isUndo: true
          });
        }
        setCurrentIndex(currentIndex + 1);
        toast.success("Change redone");
      } catch (error) {
        toast.error("Failed to redo change");
      }
    }
  };

  useTableKeyboardShortcuts({ undo, redo });

  return { updateMutation, createMutation };
}
