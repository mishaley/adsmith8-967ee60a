
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { Database } from "@/integrations/supabase/types";
import { ChangeHistoryEntry } from "../hooks/useTableHistory";

type Tables = Database['public']['Tables'];
type TableColumns<T extends TableName> = keyof Tables[T]['Row'];

interface UpdateMutationParams<T extends TableName> {
  tableName: T;
  idField: keyof Tables[T]['Row'] & string;
  onHistoryChange?: (change: ChangeHistoryEntry<T>) => void;
}

export function useUpdateMutation<T extends TableName>({ 
  tableName, 
  idField, 
  onHistoryChange 
}: UpdateMutationParams<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, isUndo = false, isDelete = false, oldData }: { 
      rowId: string; 
      field: TableColumns<T>; 
      value: any;
      isUndo?: boolean;
      isDelete?: boolean;
      oldData?: Partial<Tables[T]['Row']>;
    }) => {
      if (isDelete) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(idField, rowId);
        if (error) throw error;
      } else {
        // Get the current value before updating
        const { data: currentData, error: selectError } = await supabase
          .from(tableName)
          .select()
          .eq(idField, rowId)
          .maybeSingle();
        
        if (selectError) throw selectError;

        const updateData: Partial<Tables[T]['Update']> = { [field]: value };
        
        const { error } = await supabase
          .from(tableName)
          .update(updateData)
          .eq(idField, rowId);
        
        if (error) throw error;

        if (!isUndo && currentData && onHistoryChange) {
          onHistoryChange({
            rowId,
            field,
            oldValue: isDelete ? oldData : currentData[field as keyof Tables[T]['Row']],
            newValue: value,
            tableName,
            isDelete,
            oldData
          });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
    },
  });
}
