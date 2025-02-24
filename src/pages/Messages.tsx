
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDefinition } from "@/types/table";

const Messages = () => {
  const columns: ColumnDefinition[] = [
    {
      field: "message_name",
      header: "Message",
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
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("d1messages")
        .select("id:message_id, message_name, created_at");
      return data || [];
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: (
          <SharedTable
            tableName="d1messages"
            columns={columns}
            data={data}
            refetchKey="messages"
          />
        ),
      }}
    </QuadrantLayout>
  );
};

export default Messages;
