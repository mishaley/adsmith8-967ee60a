
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

type OfferingWithOrganization = {
  offering_id: string;
  offering_name: string;
  organization_id: string;
  created_at: string;
  a1organizations?: {
    organization_name: string;
  } | null;
};

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
      let query = supabase
        .from(tableName)
        .update({ [field]: value })
        .eq(idField, rowId);

      // Add join for b1offerings table
      if (tableName === 'b1offerings') {
        const { data, error } = await query
          .select(`
            offering_id,
            offering_name,
            organization_id,
            created_at,
            a1organizations (
              organization_name
            )
          `)
          .maybeSingle();

        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('No data returned from update');
        }

        // Transform the data
        const transformedData = {
          id: data.offering_id,
          offering_name: data.offering_name,
          organization_id: data.organization_id,
          organization_name: data.a1organizations?.organization_name || null,
          created_at: data.created_at
        };

        // Call the success callback if this isn't an undo operation
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
        }

        return transformedData;
      } else {
        // For other tables, just select all columns
        const { data, error } = await query.select().maybeSingle();
        
        if (error) {
          console.error('Update error:', error);
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('No data returned from update');
        }

        // Call the success callback if this isn't an undo operation
        if (!isUndo && onSuccessfulUpdate) {
          onSuccessfulUpdate(rowId, field, currentValue, value);
        }

        return data;
      }
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
