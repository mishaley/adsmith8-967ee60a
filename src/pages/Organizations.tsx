
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";

const Organizations = () => {
  const columns: ColumnDef[] = [
    {
      field: "offering_name",
      header: "OFFERING",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "organization_name",
      header: "ORGANIZATION",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "created_at",
      header: "CREATED",
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
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'a1organizations'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

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
