
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";

const Organizations = () => {
  const columns: ColumnDef[] = [
    {
      field: "organization_name",
      header: "Organization",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "created_at",
      header: "Created",
      inputMode: "text",
      editable: false,
      required: false,
      format: "M/D/YY"
    }
  ];

  const { data = [], refetch } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("a1organizations")
        .select("id:organization_id, organization_name, created_at");
      return data || [];
    },
  });

  useEffect(() => {
    // Subscribe to changes on the organizations table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'a1organizations'
        },
        () => {
          // Refetch data when any change occurs
          refetch();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable 
          data={data} 
          columns={columns} 
          tableName="a1organizations" 
          idField="organization_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Organizations;
