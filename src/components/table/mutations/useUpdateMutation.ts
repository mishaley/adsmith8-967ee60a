
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
          .eq(idField as string, rowId);
        if (error) throw error;
      } else {
        const { data: currentData, error: selectError } = await supabase
          .from(tableName)
          .select()
          .eq(idField as string, rowId)
          .single();
        
        if (selectError) throw selectError;

        if (currentData) {
          const updateData = { [field]: value } as Partial<Tables[T]['Update']>;
          
          const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq(idField as string, rowId);
          
          if (error) throw error;

          if (!isUndo && onHistoryChange) {
            onHistoryChange({
              rowId,
              field,
              oldValue: isDelete ? oldData : currentData[field],
              newValue: value,
              tableName,
              isDelete,
              oldData
            });
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
    },
  });
}
