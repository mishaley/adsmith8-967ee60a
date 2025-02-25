
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      rowId: string;
      field: string;
      value: any;
      currentValue: any;
      isUndo?: boolean;
    }) => {
      const { rowId, field, value, currentValue, isUndo = false } = params;
      
      console.log('🟦 Starting mutation with params:', {
        tableName,
        idField,
        rowId,
        field,
        value,
        currentValue,
        isUndo
      });

      if (value === currentValue) {
        console.log('🟨 Skipping update - value unchanged');
        return null;
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) {
        console.error('🟥 Supabase update error:', error);
        throw error;
      }

      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, currentValue, value);
      }

      return { rowId, field, value, data };
    }
  });
};
