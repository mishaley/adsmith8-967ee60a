
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: string, newValue: string) => void
) => {
  return useMutation({
    mutationFn: async (params: { 
      rowId: string; 
      field: string; 
      value: string; 
      currentValue: string; 
      isUndo?: boolean 
    }) => {
      const { rowId, field, value } = params;

      console.log('Updating record:', {
        rowId,
        field,
        newValue: value
      });

      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) throw error;

      return data;
    }
  });
};
