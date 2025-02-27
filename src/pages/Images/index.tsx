
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Images = () => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

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

  const handleTestApiKey = async () => {
    try {
      setIsTesting(true);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { test: true }
      });
      
      if (error) {
        toast.error('Error: ' + error.message);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.status === 'API Key is valid') {
        toast.success('API key is valid!');
      } else {
        toast.error('Unexpected response from server');
      }
    } catch (error) {
      toast.error('Error: ' + (error as Error).message);
    } finally {
      setIsTesting(false);
    }
  };

  const handleGenerateImage = async () => {
    try {
      setIsGenerating(true);
      setGeneratedImageUrl(null);
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: "Cute doggy" }
      });
      
      if (error) {
        toast.error('Error: ' + error.message);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      if (data?.image_url) {
        setGeneratedImageUrl(data.image_url);
        toast.success('Image generated successfully!');
      } else {
        toast.error('No image URL in response');
      }
    } catch (error) {
      toast.error('Error: ' + (error as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="space-y-6">
            <SharedTable 
              data={data} 
              columns={getColumns(messageOptions)} 
              tableName="e1images" 
              idField="image_id" 
            />
            
            <div className="w-1/2 bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">AI image generation test</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={handleTestApiKey}
                    disabled={isTesting}
                  >
                    {isTesting ? 'Testing...' : 'Test API Key'}
                  </Button>
                  <Button 
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Run'}
                  </Button>
                </div>
              </div>
              
              <div className={cn(
                "w-full h-[300px] border rounded-lg",
                "flex items-center justify-center",
                !generatedImageUrl && "bg-gray-50"
              )}>
                {generatedImageUrl ? (
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500">
                    {isGenerating ? 'Generating image...' : 'Generated image will appear here'}
                  </p>
                )}
              </div>
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
