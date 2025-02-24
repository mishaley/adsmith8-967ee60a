
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";
import { useEffect } from "react";

const Messages = () => {
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

  const { data = [], refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
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
    },
  });

  useEffect(() => {
    // Subscribe to changes on the messages table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'd1messages'
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
          tableName="d1messages" 
          idField="message_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Messages;

