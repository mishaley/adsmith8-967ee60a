
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useCallback, useState } from "react";
import { PostgrestResponse } from "@supabase/supabase-js";

type Tables = Database['public']['Tables'];

interface ChangeHistoryEntry {
  rowId: string;
  field: string;
  oldValue: any;
  newValue: any;
  tableName: TableName;
}

interface TableMutationsResult {
  updateMutation: ReturnType<typeof useMutation>;
  createMutation: ReturnType<typeof useMutation>;
}

const MAX_HISTORY = 100;

export function useTableMutations(
  tableName: TableName,
  idField: string
): TableMutationsResult {
  const queryClient = useQueryClient();
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, isUndo = false }: { 
      rowId: string; 
      field: string; 
      value: any;
      isUndo?: boolean;
    }) => {
      const table = supabase.from(tableName);
      const updateData = { [field]: value };

      if (tableName === 'b1offerings') {
        const { data, error } = await table
          .update(updateData)
          .eq(idField, rowId)
          .select(`*, a1organizations (organization_name)`);
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from update');
        
        if (!isUndo) {
          updateChangeHistory(rowId, field, data[0][field], value);
        }
        
        return data[0];
      } else {
        const { data, error } = await table
          .update(updateData)
          .eq(idField, rowId)
          .select();
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from update');
        
        if (!isUndo) {
          updateChangeHistory(rowId, field, data[0][field], value);
        }
        
        return data[0];
      }
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
    mutationFn: async (record: any) => {
      const table = supabase.from(tableName);
      
      if (tableName === 'b1offerings') {
        const { data, error } = await table
          .insert([record])
          .select(`*, a1organizations (organization_name)`);
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from insert');
        
        return data[0];
      } else {
        const { data, error } = await table
          .insert([record])
          .select();
        
        if (error) throw error;
        if (!data?.length) throw new Error('No data returned from insert');

        if (tableName === 'a1organizations' && data[0].organization_id) {
          const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
            body: { organization_id: data[0].organization_id }
          });
          
          if (folderError) {
            console.error('Error creating folders:', folderError);
            toast.error("Organization created but failed to create folders");
            throw folderError;
          }
        }
        
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Record created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  const updateChangeHistory = (rowId: string, field: string, oldValue: any, newValue: any) => {
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
  };

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
