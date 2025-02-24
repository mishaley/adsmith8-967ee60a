
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TableName } from "@/types/table";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Tables = Database['public']['Tables'];

interface CreateMutationParams<T extends TableName> {
  tableName: T;
  idField: string;
}

export function useCreateMutation<T extends TableName>({ 
  tableName, 
  idField 
}: CreateMutationParams<T>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Tables[T]['Insert']) => {      
      const { data, error } = await supabase
        .from(tableName)
        .insert([record])
        .select();
      
      if (error) throw error;
      
      if (tableName === 'a1organizations' && data?.[0]) {
        const row = data[0] as Tables[T]['Row'];
        const orgId = row[idField];
        if (orgId) {
          const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
            body: { organization_id: orgId }
          });
          
          if (folderError) {
            console.error('Error creating folders:', folderError);
            toast.error("Organization created but failed to create folders");
            throw folderError;
          }
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });
}
