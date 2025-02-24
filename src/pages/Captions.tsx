
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ColumnDef } from "@/types/table";

const Captions = () => {
  const { data: messages = [] } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data } = await supabase
        .from("d1messages")
        .select("message_id, message_name");
      return data || [];
    },
  });

  const messageOptions = messages.map(message => ({
    value: message.message_id,
    label: message.message_name
  }));

  const captionTypeOptions = [
    { value: "PrimaryText", label: "Primary Text" },
    { value: "Headline", label: "Headline" },
    { value: "Description", label: "Description" },
    { value: "LongHeadline", label: "Long Headline" }
  ];

  const statusOptions = [
    { value: "Generated", label: "Generated" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
    { value: "Archived", label: "Archived" }
  ];

  const columns: ColumnDef[] = [
    {
      field: "caption_name",
      header: "Caption",
      inputMode: "text",
      editable: true,
      required: true
    },
    {
      field: "message_id",
      header: "Message",
      inputMode: "select",
      editable: true,
      required: true,
      options: messageOptions,
      displayField: "message_name"
    },
    {
      field: "caption_type",
      header: "Type",
      inputMode: "select",
      editable: true,
      required: true,
      options: captionTypeOptions
    },
    {
      field: "behavioral_hook",
      header: "Hook",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "brand_voice",
      header: "Voice",
      inputMode: "text",
      editable: true,
      required: false
    },
    {
      field: "caption_status",
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

  const { data = [] } = useQuery({
    queryKey: ["captions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e2captions")
        .select(`
          id:caption_id,
          caption_name,
          message_id,
          message:d1messages(message_name),
          caption_type,
          behavioral_hook,
          brand_voice,
          caption_status,
          created_at
        `);
      
      return (data || []).map(row => ({
        id: row.id,
        caption_name: row.caption_name,
        message_id: row.message_id,
        message_name: row.message?.message_name,
        caption_type: row.caption_type,
        behavioral_hook: row.behavioral_hook,
        brand_voice: row.brand_voice,
        caption_status: row.caption_status,
        created_at: row.created_at
      }));
    },
  });

  return (
    <QuadrantLayout>
      {{
        q4: <SharedTable 
          data={data} 
          columns={columns} 
          tableName="e2captions" 
          idField="caption_id" 
        />,
      }}
    </QuadrantLayout>
  );
};

export default Captions;
