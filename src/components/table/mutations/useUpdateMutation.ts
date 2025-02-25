
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

type TableValue = string | number | boolean | null;

type UpdateParams = {
  rowId: string;
  field: string;
  value: TableValue;
  currentValue: TableValue;
};

const useUpdateMutation = (tableName: TableName, idField: string) => {
  const updateMutation = useMutation({
    mutationFn: async (params: UpdateParams) => {
      const { error } = await supabase
        .from(tableName)
        .update({ [params.field]: params.value })
        .eq(idField, params.rowId);

      if (error) throw error;
      return { success: true };
    },
    onError: (error: Error) => {
      toast.error("Failed to update: " + error.message);
    }
  });

  return { updateMutation };
};

export { useUpdateMutation };
