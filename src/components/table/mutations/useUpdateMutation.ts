
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

// Explicitly type the offering response to avoid deep type instantiation
interface OfferingResponse {
  offering_id: string;
  offering_name: string;
  organization_id: string;
  created_at: string;
  a1organizations?: {
    organization_name: string;
  } | null;
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
      let result;

      if (tableName === 'b1offerings') {
        // Perform the update
        const { error: updateError } = await supabase
          .from('b1offerings')
          .update({ [field]: value })
          .eq('offering_id', rowId);
        
        if (updateError) throw updateError;

        // Fetch the updated data
        const { data, error: fetchError } = await supabase
          .from('b1offerings')
          .select('*, a1organizations!inner(organization_name)')
          .eq('offering_id', rowId)
          .limit(1)
          .maybeSingle();
        
        if (fetchError) throw fetchError;
        if (!data) throw new Error('Record not found after update');
        
        result = {
          ...data,
          organization_name: data.a1organizations?.organization_name
        };
      } else {
        const { data, error } = await supabase
          .from(tableName)
          .update({ [field]: value })
          .eq(idField, rowId)
          .select()
          .maybeSingle();
        
        if (error) throw error;
        if (!data) throw new Error('Record not found after update');
        
        result = data;
      }

      if (!isUndo && onSuccessfulUpdate) {
        onSuccessfulUpdate(rowId, field, result[field], value);
      }

      return result;
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
