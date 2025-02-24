
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Personas = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "persona_name",
      header: "Persona",
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
    queryKey: ["personas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("c1personas")
        .select("id:persona_id, persona_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="c1personas"
            columns={columns}
            data={data}
            refetchKey="personas"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Personas;
