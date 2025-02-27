
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Images = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  const { data = [], refetch } = useQuery({
    queryKey: ["images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("e1images")
        .select(`
          id:image_id,
          image_storage,
          message_id,
          message:d1messages(message_name),
          image_format,
          image_resolution,
          image_style,
          image_model,
          image_inputprompt,
          image_magicprompt,
          image_status,
          created_at
        `);
      
      return (data || []).map(row => ({
        id: row.id,
        image_storage: row.image_storage,
        message_id: row.message_id,
        message_name: row.message?.message_name,
        image_format: row.image_format,
        image_resolution: row.image_resolution,
        image_style: row.image_style,
        image_model: row.image_model,
        image_inputprompt: row.image_inputprompt,
        image_magicprompt: row.image_magicprompt,
        image_status: row.image_status,
        created_at: row.created_at
      }));
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
          table: 'e1images'
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

  const testIdeogramApi = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-ideogram-api', {
        body: { test: true }
      });

      if (error) {
        toast({
          title: "API Test Failed",
          description: `Error: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      if (data.error) {
        toast({
          title: "API Test Failed",
          description: data.error + (data.details ? `: ${JSON.stringify(data.details)}` : ''),
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "API Test Successful",
        description: "Successfully connected to Ideogram API",
      });
    } catch (err) {
      toast({
        title: "API Test Failed",
        description: `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="flex flex-col space-y-4">
            <SharedTable 
              data={data} 
              columns={getColumns(messageOptions)} 
              tableName="e1images" 
              idField="image_id" 
            />
            <div className="border rounded-md p-4 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI image generation test</h3>
                <Button 
                  onClick={testIdeogramApi} 
                  disabled={isLoading}
                >
                  {isLoading ? "Testing..." : "Test API"}
                </Button>
              </div>
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
