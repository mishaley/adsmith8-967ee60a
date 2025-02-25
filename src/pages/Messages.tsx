
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect, useState } from "react";

const Messages = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  
  const { data: personas = [] } = useQuery({
    queryKey: ["personas"],
    queryFn: async () => {
      const { data } = await supabase
        .from("c1personas")
        .select("persona_id, persona_name");
      return data || [];
    },
  });

  const personaOptions = personas.map(persona => ({
    value: persona.persona_id,
    label: persona.persona_name
  }));

  const messageTypeOptions = [
    { value: "0nocategory", label: "No Category" },
    { value: "1painpoint", label: "Pain Point" },
    { value: "2uniqueoffering", label: "Unique Offering" },
    { value: "3valueprop", label: "Value Proposition" },
    { value: "9clientprovided", label: "Client Provided" }
  ];

  const statusOptions = [
    { value: "Generated", label: "Generated" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Archived", label: "Archived" }
  ];

  const columns: ColumnDef[] = [
    {
      field: "message_name",
      header: "Message",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "persona_id",
      header: "Persona",
      inputMode: "select",
      editable: true,
      required: true,
      options: personaOptions,
      displayField: "persona_name"
    },
    {
      field: "message_type",
      header: "Type",
      inputMode: "select",
      editable: true,
      required: true,
      options: messageTypeOptions
    },
    {
      field: "message_url",
      header: "URL",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "message_status",
      header: "Status",
      inputMode: "select",
      editable: true,
      required: true,
      options: statusOptions
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

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("d1messages")
      .select(`
        id:message_id,
        message_name,
        persona_id,
        persona:c1personas(persona_name),
        message_type,
        message_url,
        message_status,
        created_at
      `);
    
    const transformedData = (data || []).map(row => ({
      id: row.id,
      message_name: row.message_name,
      persona_id: row.persona_id,
      persona_name: row.persona?.persona_name,
      message_type: row.message_type,
      message_url: row.message_url,
      message_status: row.message_status,
      created_at: row.created_at
    }));

    setTableData(transformedData);
    return transformedData;
  };

  const { data } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  useEffect(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'd1messages'
        },
        (payload) => {
          if (payload.new && payload.new.message_id) {
            // Update the specific row directly from the payload
            setTableData(prevData => 
              prevData.map(row => {
                if (row.id === payload.new.message_id) {
                  return {
                    ...row,
                    ...payload.new,
                    id: payload.new.message_id,
                  };
                }
                return row;
              })
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable 
          data={tableData} 
          columns={columns} 
          tableName="d1messages" 
          idField="message_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Messages;
