
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader } from "lucide-react";

const Images = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

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

  const handleRunImageGeneration = async () => {
    setIsLoading(true);
    setGeneratedImageUrl(null);
    
    try {
      const response = await supabase.functions.invoke('ideogram-test');
      
      if (response.error) {
        toast({
          title: "Image Generation Failed",
          description: `Error: ${response.error.message || 'Unknown error'}`,
          variant: "destructive",
        });
        console.error('API test error:', response.error);
        return;
      }
      
      const data = response.data;
      
      if (data.success) {
        if (data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          toast({
            title: "Image Generated Successfully",
            description: "The test image has been generated.",
          });
        } else {
          toast({
            title: "API Connection Successful",
            description: "API connected but no image URL was returned. Check the logs for details.",
          });
        }
      } else {
        toast({
          title: "Image Generation Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
        console.error('API test details:', data.details);
      }
    } catch (error) {
      toast({
        title: "Image Generation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      console.error('Generate image error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <QuadrantLayout>
      {{
        q4: (
          <div className="flex flex-col gap-6">
            <SharedTable 
              data={data} 
              columns={getColumns(messageOptions)} 
              tableName="e1images" 
              idField="image_id" 
            />
            
            {/* AI Image Generation Test Box */}
            <div className="w-1/2 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">AI image generation test</h3>
                <Button 
                  onClick={handleRunImageGeneration} 
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {isLoading ? "Running..." : "Run"}
                </Button>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Tests connection to the Ideogram API with your credentials.
              </div>
              
              {/* Image display area */}
              {generatedImageUrl && (
                <div className="mt-4 border rounded-md overflow-hidden">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated test image" 
                    className="w-full h-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        ),
      }}
    </QuadrantLayout>
  );
};

export default Images;
