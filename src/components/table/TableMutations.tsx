
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName, TableData } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useCallback, useState } from "react";

type Tables = Database['public']['Tables'];
type TableColumns<T extends TableName> = keyof Tables[T]['Row'];
type TableUpdate<T extends TableName> = Tables[T]['Update'];
type TableInsert<T extends TableName> = Tables[T]['Insert'];
type TableRow<T extends TableName> = Tables[T]['Row'];

interface ChangeHistoryEntry<T extends TableName = TableName> {
  rowId: string;
  field: TableColumns<T>;
  oldValue: any;
  newValue: any;
  tableName: T;
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

  const getSelectQuery = (table: T) => {
    if (table === 'b1offerings') {
      return `
        *,
        a1organizations (
          organization_name
        )
      `;
    }
    return '*';
  };

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, isUndo = false }: { 
      rowId: string; 
      field: TableColumns<T>; 
      value: any;
      isUndo?: boolean;
    }) => {
      const table = supabase.from(tableName);
      const updateData = { [field]: value };
      
      const { data, error } = await table
        .update(updateData)
        .eq(idField, rowId)
        .select(getSelectQuery(tableName));
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from update');
      }

      // Only add to history if it's not an undo/redo operation
      if (!isUndo && data?.[0]) {
        // Remove any future history if we're not at the end
        const newHistory = changeHistory.slice(0, currentIndex + 1);
        
        // Add the new change
        const newChange: ChangeHistoryEntry<T> = {
          rowId,
          field,
          oldValue: data[0][field as keyof typeof data[0]],
          newValue: value,
          tableName
        };

        // Keep only the last MAX_HISTORY changes
        const updatedHistory = [...newHistory, newChange].slice(-MAX_HISTORY);
        setChangeHistory(updatedHistory);
        setCurrentIndex(updatedHistory.length - 1);
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Update successful");
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    }
  });

  const createMutation = useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Partial<TableData<T>>) => {
      const table = supabase.from(tableName);
      const insertData = record;
      
      const { data, error } = await table
        .insert([insertData])
        .select(getSelectQuery(tableName));
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from insert');
      }

      // Handle organization creation specifically
      if (tableName === 'a1organizations' && data?.[0]) {
        const org = data[0] as Tables['a1organizations']['Row'];
        if (org.organization_id) {
          const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
            body: { organization_id: org.organization_id }
          });
          
          if (folderError) {
            console.error('Error creating folders:', folderError);
            toast.error("Organization created but failed to create folders");
            throw folderError;
          }
        }
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Record created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  const undo = useCallback(async () => {
    if (currentIndex >= 0) {
      const change = changeHistory[currentIndex];
      try {
        await updateMutation.mutateAsync({
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
  }, [currentIndex, changeHistory, updateMutation]);

  const redo = useCallback(async () => {
    if (currentIndex < changeHistory.length - 1) {
      const change = changeHistory[currentIndex + 1];
      try {
        await updateMutation.mutateAsync({
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
  }, [currentIndex, changeHistory, updateMutation]);

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
