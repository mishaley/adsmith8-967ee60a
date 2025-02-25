
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
      // If the value hasn't changed, just fetch the current data
      if (value === currentValue) {
        const { data, error } = await supabase
          .from(tableName)
          .select(tableName === 'b1offerings' ? '*, a1organizations(organization_name)' : '*')
          .eq(idField, rowId)
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('Failed to fetch data');
        
        // For offerings, add the organization name to the response
        if (tableName === 'b1offerings') {
          return {
            ...data,
            organization_name: data.a1organizations?.organization_name
          };
        }
        
        return data;
      }

      // If the value has changed, proceed with the update
      const { data, error } = await supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId)
        .select(tableName === 'b1offerings' ? '*, a1organizations(organization_name)' : '*')
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error('No data returned from update');

      // For offerings, add the organization name to the response
      if (tableName === 'b1offerings') {
        const result = {
          ...data,
          organization_name: data.a1organizations?.organization_name
        };

        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
        }

        return result;
      }

      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, currentValue, value);
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
