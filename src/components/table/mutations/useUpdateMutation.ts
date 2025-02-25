
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";

type MutationParams = {
  rowId: string;
  field: string;
  value: string;
  currentValue: string;
};

export const useUpdateMutation = (tableName: TableName, idField: string) => {
  return useMutation({
    mutationFn: async ({ rowId, field, value }: MutationParams) => {
      console.log('Running update mutation with:', { rowId, field, value });
      
      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;
      return { success: true };
    }
  });
};
