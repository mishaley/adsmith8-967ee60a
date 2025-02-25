
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
        const { data, error } = await supabase
          .from('b1offerings')
          .update({ [field]: value })
          .eq('offering_id', rowId)
          .select(`offering_id, offering_name, organization_id, created_at`)
          .single();
        
        if (error) throw error;
        
        // Fetch the organization name in a separate query
        const { data: orgData } = await supabase
          .from('a1organizations')
          .select('organization_name')
          .eq('organization_id', data.organization_id)
          .single();
        
        const result = {
          ...data,
          organization_name: orgData?.organization_name
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
