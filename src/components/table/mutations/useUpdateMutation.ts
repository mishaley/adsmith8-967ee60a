
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
    mutationFn: async ({ rowId, field, value, currentValue, isUndo = false }: UpdateParams) => {
      console.log('🟦 Starting mutation with params:', {
        tableName,
        idField,
        rowId,
        field,
        value,
        currentValue,
        isUndo
      });

      // Skip if no change
      if (value === currentValue) {
        console.log('🟨 Skipping update - value unchanged');
        return null;
      }

      console.log('🟩 Attempting Supabase update:', {
        table: tableName,
        updateData: { [field]: value },
        whereCondition: { [idField]: rowId }
      });

      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select();

      if (error) {
        console.error('🟥 Supabase update error:', error);
        throw error;
      }

      console.log('🟩 Supabase update response:', data);

      // Call success callback if not undoing
      if (!isUndo && onSuccessfulUpdate) {
        console.log('🟩 Calling onSuccessfulUpdate callback with:', {
          rowId,
          field,
          currentValue,
          value
        });
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
        console.log('🟩 Mutation successful, invalidating queries:', data);
        queryClient.invalidateQueries({ queryKey: ["offerings"] });
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success("Update successful");
      } else {
        console.log('🟨 Mutation skipped (no changes)');
      }
    },
    onMutate: (variables) => {
      console.log('🟦 Mutation starting with variables:', variables);
    },
    onSettled: (data, error) => {
      console.log('🟦 Mutation settled:', { data, error });
    }
  });
};
