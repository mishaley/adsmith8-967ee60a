
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Offerings = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "offering_name",
      header: "Offering",
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
    queryKey: ["offerings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("b1offerings")
        .select("id:offering_id, offering_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="b1offerings"
            columns={columns}
            data={data}
            refetchKey="offerings"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Offerings;
