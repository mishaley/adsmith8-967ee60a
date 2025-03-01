
import QuadrantLayout from "@/components/QuadrantLayout";
import SharedTable from "@/components/SharedTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useRef } from "react";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Loader, Upload, Video, Download } from "lucide-react";
import { Input } from "@/components/ui/input";

const Images = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
      console.log('Ideogram API response:', data);
      
      if (data.success) {
        if (data.imageUrl) {
          setGeneratedImageUrl(data.imageUrl);
          toast({
            title: "Image Generated Successfully",
            description: "The test image has been generated.",
          });
        } 
        else if (data.data && data.data.length > 0 && data.data[0].url) {
          setGeneratedImageUrl(data.data[0].url);
          toast({
            title: "Image Generated Successfully",
            description: "The test image has been generated.",
          });
        } else {
          toast({
            title: "API Connection Successful",
            description: "API connected but no image URL was found. Check the logs for details.",
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
      
      const previews = filesArray.map(file => URL.createObjectURL(file));
      setPreviewImages(previews);
      
      setVideoUrl(null);
      
      toast({
        title: "Images Selected",
        description: `${filesArray.length} images have been selected.`,
      });
    }
  };

  const createVideo = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to create a video.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingVideo(true);
    
    try {
      // Create a temporary canvas to get image dimensions
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Unable to create canvas context");
      }
      
      // Load the first image to set dimensions
      const firstImage = new Image();
      await new Promise((resolve, reject) => {
        firstImage.onload = resolve;
        firstImage.onerror = reject;
        firstImage.src = previewImages[0];
      });
      
      // Set canvas dimensions to match the image
      const width = firstImage.width;
      const height = firstImage.height;
      canvas.width = width;
      canvas.height = height;
      
      // Configure higher quality stream
      const stream = canvas.captureStream(30); // 30fps for smoother transitions
      
      // Use higher bitrate and quality settings
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9', // VP9 codec for better quality/compression balance
        videoBitsPerSecond: 5000000 // 5 Mbps bitrate for higher quality
      });
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Create a more substantial video file
        const videoBlob = new Blob(chunks, { type: 'video/mp4' });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        setIsCreatingVideo(false);
        
        console.log(`Generated video size: ${(videoBlob.size / 1024 / 1024).toFixed(2)} MB`);
        
        toast({
          title: "Video Created",
          description: `Video created successfully (${(videoBlob.size / 1024 / 1024).toFixed(2)} MB)`,
        });
      };
      
      mediaRecorder.start();
      
      // Increase the frame duration for better quality per frame
      const frameDuration = 2000; // 2 seconds per image
      
      // Process each image
      for (let i = 0; i < previewImages.length; i++) {
        // Load the image
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = previewImages[i];
        });
        
        // Clear canvas and draw the current image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        
        // For smoother transitions, add a small fade effect
        if (i < previewImages.length - 1) {
          // Wait for the frame duration
          await new Promise(resolve => setTimeout(resolve, frameDuration));
          
          // Load the next image
          const nextImg = new Image();
          await new Promise((resolve, reject) => {
            nextImg.onload = resolve;
            nextImg.onerror = reject;
            nextImg.src = previewImages[i + 1];
          });
          
          // Create a cross-fade transition (optional)
          // This is a simple fade transition - can be enhanced further
          const transitionFrames = 15; // Number of transition frames
          const transitionDuration = 500; // 500ms transition
          
          for (let j = 0; j < transitionFrames; j++) {
            const alpha = j / transitionFrames;
            
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
            
            // Draw current image
            ctx.globalAlpha = 1 - alpha;
            ctx.drawImage(img, 0, 0, width, height);
            
            // Draw next image with increasing opacity
            ctx.globalAlpha = alpha;
            ctx.drawImage(nextImg, 0, 0, width, height);
            
            // Reset alpha
            ctx.globalAlpha = 1;
            
            // Wait a small amount for the transition frame
            await new Promise(resolve => 
              setTimeout(resolve, transitionDuration / transitionFrames)
            );
          }
        } else {
          // For the last image, just display it for the full duration
          await new Promise(resolve => setTimeout(resolve, frameDuration));
        }
      }
      
      // Stop recording after all images have been processed
      mediaRecorder.stop();
      
    } catch (error) {
      console.error('Error creating video:', error);
      setIsCreatingVideo(false);
      toast({
        title: "Video Creation Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = 'image-slideshow.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: "Your video has been downloaded successfully!",
    });
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
            
            <div className="w-1/2 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Image to video converter</h3>
                <div className="flex gap-2">
                  <Button 
                    onClick={triggerFileInput} 
                    variant="outline" 
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Select Images
                  </Button>
                  <Input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageSelect} 
                    className="hidden"
                  />
                  <Button 
                    onClick={createVideo} 
                    disabled={isCreatingVideo || selectedImages.length === 0}
                    className="gap-2"
                  >
                    {isCreatingVideo ? <Loader className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                    {isCreatingVideo ? "Creating..." : "Create Video"}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Create a video slideshow from your selected images. Each image appears for 2 seconds.
              </div>
              
              {previewImages.length > 0 && (
                <div className="mt-4 mb-4">
                  <h4 className="text-sm font-medium mb-2">Selected Images ({previewImages.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewImages.map((src, index) => (
                      <div key={index} className="h-16 w-16 relative">
                        <img 
                          src={src} 
                          alt={`Selected image ${index + 1}`}
                          className="h-full w-full object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {videoUrl && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Generated Video</h4>
                    <Button
                      onClick={handleDownloadVideo}
                      variant="secondary"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  <div className="border rounded-md overflow-hidden bg-black">
                    <video 
                      ref={videoRef}
                      src={videoUrl} 
                      controls 
                      className="w-full h-auto"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
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
