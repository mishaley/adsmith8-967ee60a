
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
      // Skip update if value hasn't changed
      if (value === currentValue) {
        return null;
      }

      // Perform the update
      const { data: updatedData, error: updateError } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select(`*, a1organizations (organization_name)`)
        .maybeSingle();

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(updateError.message);
      }

      if (!updatedData) {
        throw new Error('No data returned from update');
      }

      // Call the success callback if this isn't an undo operation
      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, currentValue, value);
      }

      // Transform the data for offerings table
      if (tableName === 'b1offerings') {
        return {
          id: updatedData.offering_id,
          offering_name: updatedData.offering_name,
          organization_id: updatedData.organization_id,
          organization_name: updatedData.a1organizations?.organization_name,
          created_at: updatedData.created_at
        };
      }

      return updatedData;
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    },
    onSuccess: (data) => {
      if (data) { // Only invalidate queries if the update actually happened
        queryClient.invalidateQueries({ queryKey: ["offerings"] });
        queryClient.invalidateQueries({ queryKey: ["organizations"] });
        toast.success("Update successful");
      }
    },
  });
};
