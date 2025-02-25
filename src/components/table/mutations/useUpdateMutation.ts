
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { toast } from "sonner";

interface UpdateParams {
  rowId: string;
  field: string;
  value: any;
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
    mutationFn: async ({ rowId, field, value, isUndo = false }: UpdateParams) => {
      // Simple update operation
      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select()
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      // If this is an offering, we need to refetch to get the organization name
      if (tableName === 'b1offerings') {
        const { data: fullData, error: fetchError } = await supabase
          .from('b1offerings')
          .select('*, a1organizations(organization_name)')
          .eq('offering_id', rowId)
          .single();
        
        if (fetchError) throw fetchError;
        if (!fullData) throw new Error('Failed to fetch updated data');

        const result = {
          ...fullData,
          organization_name: fullData.a1organizations?.organization_name
        };

        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }

        return result;
      }

      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, data[field], value);
      }

      return data;
    },
    onError: (error: Error) => {
      console.error('Mutation error:', error);
      toast.error(`Failed to update: ${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
      toast.success("Update successful");
    },
  });
};
