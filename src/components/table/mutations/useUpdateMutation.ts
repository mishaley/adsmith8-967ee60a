
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
  currentValue: any;
  isUndo?: boolean;
}

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }: UpdateParams) => {
      // Skip if no change
      if (value === currentValue) return null;

      const { error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      if (error) throw error;

      // Call success callback if not undoing
      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, currentValue, value);
      }

      return { rowId, field, value };
    },
    onError: (error: Error) => {
      console.error('Update error:', error);
      toast.error(`Failed to update: ${error.message}`);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["offerings"] });
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success("Update successful");
      }
    },
  });
};
