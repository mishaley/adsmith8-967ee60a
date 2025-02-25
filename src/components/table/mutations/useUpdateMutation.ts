
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { PostgrestResponse } from "@supabase/postgrest-js";

interface UseUpdateMutationOptions<TData = any> {
  client: SupabaseClient;
  table: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useUpdateMutation<TData = any>({
  client,
  table,
  onSuccess,
  onError,
}: UseUpdateMutationOptions<TData>) {
  return useMutation({
    mutationFn: async (variables: { id: string; data: Partial<TData> }) => {
      const { data, error } = await client
        .from(table)
        .update(variables.data)
        .eq('id', variables.id)
        .select()
        .single();

      if (error) throw error;
      return data as TData;
    },
    onSuccess,
    onError,
  });
}
