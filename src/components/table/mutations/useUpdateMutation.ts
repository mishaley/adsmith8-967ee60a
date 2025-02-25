
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
      if (tableName === 'b1offerings') {
        // First update the record
        const { error: updateError } = await supabase
          .from('b1offerings')
          .update({ [field]: value })
          .eq('offering_id', rowId);
        
        if (updateError) throw updateError;

        // Then fetch the updated record with organization data
        const { data, error: fetchError } = await supabase
          .from('b1offerings')
          .select(`
            offering_id,
            offering_name,
            organization_id,
            created_at,
            a1organizations (
              organization_name
            )
          `)
          .eq('offering_id', rowId)
          .single();
        
        if (fetchError) throw fetchError;
        
        const result = {
          ...data,
          organization_name: data.a1organizations?.organization_name
        };
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }
        
        return result;
      } else {
        const { data, error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId)
          .select()
          .single();
        
        if (error) throw error;
        
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, data[field], value);
        }
        
        return data;
      }
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
