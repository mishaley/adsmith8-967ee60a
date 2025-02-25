
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

type MutationResponse = {
  rowId: string;
  field: string;
  value: any;
  data: any[] | null;
} | null;

export const useUpdateMutation = (
  tableName: TableName,
  idField: string,
  onSuccessfulUpdate?: (rowId: string, field: string, oldValue: any, newValue: any) => void
) => {
  const queryClient = useQueryClient();

  return useMutation<MutationResponse, Error, UpdateParams>({
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }) => {
      console.log('🟦 Starting mutation with params:', {
        tableName,
        idField,
        rowId,
        field,
        value,
        currentValue,
        isUndo
      });

      if (JSON.stringify(value) === JSON.stringify(currentValue)) {
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
    },
    onError: (error: Error) => {
      console.error('🟥 Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["offerings"] });
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success("Update successful");
      }
    }
  });
};
