
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Organizations = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "organization_name",
      header: "Organization",
      inputMode: "text",
      editable: true,
      required: true,
    },
    {
      field: "created_at",
      header: "Created",
      inputMode: "text",
      editable: false,
      required: false,
      format: "M/D/YY",
    },
  ];

  const { data = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const { data } = await supabase
        .from("a1organizations")
        .select("*");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="a1organizations"
            columns={columns}
            data={data}
            refetchKey="organizations"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Organizations;
