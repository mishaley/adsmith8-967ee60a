
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName, TableField, TableRecord } from "@/types/table";

interface UpdateMutationParams<T extends TableName> {
  tableName: T;
  idField: TableField<T>;
  onHistoryChange?: (change: {
    rowId: string;
    field: TableField<T>;
    oldValue: any;
    newValue: any;
    tableName: T;
    isDelete?: boolean;
    oldData?: Partial<TableRecord<T>>;
  }) => void;
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
      field: TableField<T>; 
      value: any;
      isUndo?: boolean;
      isDelete?: boolean;
      oldData?: Partial<TableRecord<T>>;
    }) => {
      if (isDelete) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(idField, rowId);
        if (error) throw error;
      } else {
        const { data: currentData, error: selectError } = await supabase
          .from(tableName)
          .select()
          .eq(idField, rowId)
          .single();
        
        if (selectError) throw selectError;

        if (currentData) {
          const updateData = { [field]: value };
          
          const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq(idField, rowId);
          
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
