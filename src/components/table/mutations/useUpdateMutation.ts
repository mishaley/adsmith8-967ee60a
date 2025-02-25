
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

type UpdateMutationParams = {
  rowId: string;
  field: string;
  value: string;
  currentValue: string;
  isUndo?: boolean;
};

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  return useMutation({
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }: UpdateMutationParams) => {
      console.log('Update mutation called with:', { rowId, field, value, currentValue });
      
      if (value === currentValue) {
        console.log('Values are identical, skipping update');
        return null;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) {
        console.error('Update failed:', error);
        throw error;
      }

      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, currentValue, value);
      }

      return { success: true, data };
    }
  });
};
