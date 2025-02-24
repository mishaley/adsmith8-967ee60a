import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName, TableData } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useCallback, useState } from "react";

type Tables = Database['public']['Tables'];

// Helper type to get column names for a specific table
type TableColumns<T extends TableName> = keyof Tables[T]['Row'];

interface ChangeHistoryEntry<T extends TableName = TableName> {
  rowId: string;
  field: TableColumns<T>;
  oldValue: any;
  newValue: any;
  tableName: T;
  isDelete?: boolean;
  oldData?: any;
}

interface TableMutationsResult<T extends TableName> {
  updateMutation: ReturnType<typeof useMutation>;
  createMutation: ReturnType<typeof useMutation>;
}

const MAX_HISTORY = 100;

export function useTableMutations<T extends TableName>(
  tableName: T,
  idField: string
): TableMutationsResult<T> {
  const queryClient = useQueryClient();
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry<T>[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, isUndo = false, isDelete = false, oldData }: { 
      rowId: string; 
      field: TableColumns<T>; 
      value: any;
      isUndo?: boolean;
      isDelete?: boolean;
      oldData?: any;
    }) => {
      type TableUpdate = Tables[T]['Update'];
      const table = supabase.from(tableName);
      
      if (isDelete) {
        const { error } = await table.delete().eq(idField, rowId);
        if (error) throw error;
      } else {
        // Get the current value before updating
        const { data: currentData } = await (table as any)
          .select(String(field))
          .eq(idField, rowId)
          .single();
        
        const updateData = { [field]: value } as TableUpdate;
        
        const { error } = await (table as any)
          .update(updateData)
          .eq(idField, rowId);
        
        if (error) throw error;

        // Only add to history if it's not an undo/redo operation
        if (!isUndo && currentData) {
          // Remove any future history if we're not at the end
          const newHistory = changeHistory.slice(0, currentIndex + 1);
          
          // Add the new change
          const newChange: ChangeHistoryEntry<T> = {
            rowId,
            field,
            oldValue: isDelete ? oldData : currentData[field as keyof typeof currentData],
            newValue: value,
            tableName,
            isDelete,
            oldData
          };

          // Keep only the last MAX_HISTORY changes
          const updatedHistory = [...newHistory, newChange].slice(-MAX_HISTORY);
          setChangeHistory(updatedHistory);
          setCurrentIndex(updatedHistory.length - 1);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
    },
  });

  const createMutation = useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Partial<TableData<T>>) => {
      type TableInsert = Tables[T]['Insert'];
      const table = supabase.from(tableName);
      const insertData = record as unknown as TableInsert;
      
      const { data, error } = await (table as any)
        .insert([insertData])
        .select();
      
      if (error) throw error;
      
      if (tableName === 'a1organizations' && data?.[0]?.organization_id) {
        const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
          body: { organization_id: data[0].organization_id }
        });
        
        if (folderError) {
          console.error('Error creating folders:', folderError);
          toast.error("Organization created but failed to create folders");
          throw folderError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  const undo = useCallback(async () => {
    if (currentIndex >= 0) {
      const change = changeHistory[currentIndex];
      try {
        if (change.isDelete) {
          // If it was a delete operation, we need to re-insert the record
          const table = supabase.from(tableName);
          const { error } = await table.insert([change.oldData]);
          if (error) throw error;
        } else {
          // For normal updates, revert to the old value
          await updateMutation.mutateAsync({
            rowId: change.rowId,
            field: change.field,
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
  }, [currentIndex, changeHistory, updateMutation, tableName]);

  const redo = useCallback(async () => {
    if (currentIndex < changeHistory.length - 1) {
      const change = changeHistory[currentIndex + 1];
      try {
        if (change.isDelete) {
          // If it was a delete operation, delete the record again
          const table = supabase.from(tableName);
          const { error } = await table.delete().eq(idField, change.rowId);
          if (error) throw error;
        } else {
          // For normal updates, apply the new value
          await updateMutation.mutateAsync({
            rowId: change.rowId,
            field: change.field,
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
  }, [currentIndex, changeHistory, updateMutation, tableName, idField]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
      } else if (
        ((event.metaKey || event.ctrlKey) && event.key === 'y') ||
        ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'z')
      ) {
        event.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { updateMutation, createMutation };
}
