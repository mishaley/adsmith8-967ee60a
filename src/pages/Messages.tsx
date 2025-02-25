
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
    
    return (data || []).map(row => ({
      id: row.id,
      message_name: row.message_name,
      persona_id: row.persona_id,
      persona_name: row.persona?.persona_name,
      message_type: row.message_type,
      message_url: row.message_url,
      message_status: row.message_status,
      created_at: row.created_at
    }));
  };

  // Initial data fetch
  const { data: messagesData } = useQuery({
    queryKey: ["messages"],
    queryFn: fetchMessages
  });

  useEffect(() => {
    if (messagesData) {
      setTableData(messagesData);
    }
  }, [messagesData]);

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
        async (payload) => {
          if (payload.new && payload.new.message_id) {
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
              `)
              .eq('message_id', payload.new.message_id)
              .single();

            if (data) {
              const updatedRow = {
                id: data.id,
                message_name: data.message_name,
                persona_id: data.persona_id,
                persona_name: data.persona?.persona_name,
                message_type: data.message_type,
                message_url: data.message_url,
                message_status: data.message_status,
                created_at: data.created_at
              };

              setTableData(prevData => 
                prevData.map(row => 
                  row.id === updatedRow.id ? updatedRow : row
                )
              );
            }
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
