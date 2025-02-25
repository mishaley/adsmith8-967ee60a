
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName, DbRecord, asTableField, asDbRecord } from "@/types/table";

interface UpdateMutationParams<T extends TableName> {
  tableName: T;
  idField: keyof DbRecord<T>;
  onHistoryChange?: (change: {
    rowId: string;
    field: keyof DbRecord<T>;
    oldValue: any;
    newValue: any;
    tableName: T;
    isDelete?: boolean;
    oldData?: Partial<DbRecord<T>>;
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
      field: keyof DbRecord<T>; 
      value: any;
      isUndo?: boolean;
      isDelete?: boolean;
      oldData?: Partial<DbRecord<T>>;
    }) => {
      if (isDelete) {
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(String(idField), rowId);
        if (error) throw error;
      } else {
        const { data: currentData, error: selectError } = await supabase
          .from(tableName)
          .select()
          .eq(String(idField), rowId)
          .single();
        
        if (selectError) throw selectError;

        if (currentData) {
          const updateData = { [String(field)]: value };
          
          const { error } = await supabase
            .from(tableName)
            .update(updateData)
            .eq(String(idField), rowId);
          
          if (error) throw error;

          if (!isUndo && onHistoryChange) {
            onHistoryChange({
              rowId,
              field,
              oldValue: isDelete ? oldData : currentData[String(field)],
              newValue: value,
              tableName,
              isDelete,
              oldData: asDbRecord<T>(oldData)
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
