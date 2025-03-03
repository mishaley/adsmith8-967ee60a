import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Loader, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../../Personas/types";
import { generateRandomPhrase, getRandomApprovedStyle } from "../utils/imageGenerationUtils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";

interface ImageGeneratorProps {
  currentPersona: Persona | null;
  adPlatform: string;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ currentPersona, adPlatform }) => {
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const { toast } = useToast();
  
  const getResolutionsForPlatform = () => {
    const platformResolutions = {
      "Google": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "21:11", value: "RESOLUTION_1344_704" }
      ],
      "Meta": [
        { label: "1:1", value: "RESOLUTION_1024_1024" },
        { label: "4:5", value: "RESOLUTION_896_1120" },
        { label: "9:16", value: "RESOLUTION_720_1280" }
      ]
    };
    
    return adPlatform && platformResolutions[adPlatform] ? platformResolutions[adPlatform] : [];
  };
  
  const handleGeneratePrompt = async () => {
    if (!currentPersona) return;
    
    setIsGeneratingPrompt(true);
    
    try {
      const style = await getRandomApprovedStyle();
      const phrase = generateRandomPhrase();
      const demographics = `${currentPersona.gender}, ${currentPersona.ageMin}-${currentPersona.ageMax}`;
      
      const prompt = `Style: ${style}\nSubject: ${demographics}\nMessage: '${phrase}'${currentPersona.interests ? `\nInterests: ${currentPersona.interests.join(", ")}` : ""}`;
      
      setGeneratedPrompt(prompt);
      
      toast({
        title: "Prompt Generated",
        description: "Image prompt has been created.",
      });
    } catch (error) {
      console.error('Error generating prompt:', error);
      toast({
        title: "Prompt Generation Failed",
        description: "Failed to generate image prompt.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  };
  
  const handleGenerateImages = async () => {
    if (!currentPersona || !adPlatform) return;
    
    setIsGeneratingImages(true);
    setGeneratedImageUrl(null);
    setErrorDetails(null);
    
    try {
      let prompt = generatedPrompt;
      if (!prompt) {
        const style = await getRandomApprovedStyle();
        const phrase = generateRandomPhrase();
        const demographics = `${currentPersona.gender}, ${currentPersona.ageMin}-${currentPersona.ageMax}`;
        
        prompt = `Style: ${style}\nSubject: ${demographics}\nMessage: '${phrase}'${currentPersona.interests ? `\nInterests: ${currentPersona.interests.join(", ")}` : ""}`;
      }

      console.log("Image generation prompt:", prompt);
      
      const platformResolutions = getResolutionsForPlatform();
      const resolution = platformResolutions.length > 0 ? platformResolutions[0].value : "RESOLUTION_1024_1024";

      const { data, error } = await supabase.functions.invoke('generate-persona-image', {
        body: { 
          prompt, 
          resolution 
        }
      });
      
      console.log('Image generation response:', { data, error });
      
      if (error) {
        const errorMessage = error.message || "Failed to generate image";
        console.error('Error calling edge function:', errorMessage);
        setErrorDetails(`Edge Function Error: ${errorMessage}`);
        setShowErrorDialog(true);
        throw new Error(errorMessage);
      }
      
      if (data && data.success && data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        toast({
          title: "Image Generated",
          description: "Image has been successfully generated.",
        });
      } else {
        const errorMsg = data?.error || "Unknown error occurred";
        const details = data?.details ? JSON.stringify(data.details, null, 2) : "No details available";
        const fullError = `Error: ${errorMsg}\n\nDetails: ${details}`;
        console.error('Error generating image:', fullError);
        setErrorDetails(fullError);
        setShowErrorDialog(true);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Exception in image generation:', error);
      
      if (!errorDetails) {
        setErrorDetails(`Error: ${error.message || "Unknown error"}`);
      }
      
      toast({
        title: "Generation Failed",
        description: "Click 'View Details' for more information.",
        variant: "destructive",
        action: (
          <Button onClick={() => setShowErrorDialog(true)} variant="outline" size="sm">
            View Details
          </Button>
        )
      });
    } finally {
      setIsGeneratingImages(false);
    }
  };
  
  return (
    <div className="flex flex-col items-center min-h-52">
      <div className="mb-4 w-full">
        {!generatedPrompt ? (
          <Button 
            onClick={handleGeneratePrompt}
            disabled={isGeneratingPrompt || !currentPersona}
            className="px-6 mb-4 w-full"
          >
            {isGeneratingPrompt ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating Prompt...</span>
              </>
            ) : (
              <>
                <MessageSquare className="mr-2 h-4 w-4" />
                Generate Prompt
              </>
            )}
          </Button>
        ) : (
          <div className="mb-4 w-full">
            <Textarea 
              value={generatedPrompt}
              readOnly
              className="min-h-20 mb-2 font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleGeneratePrompt} 
                variant="outline"
                size="sm"
                disabled={isGeneratingPrompt}
                className="w-1/2"
              >
                {isGeneratingPrompt ? (
                  <>
                    <Loader className="mr-2 h-3 w-3 animate-spin" />
                    <span>Regenerate</span>
                  </>
                ) : (
                  "Regenerate Prompt"
                )}
              </Button>
              <Button 
                onClick={handleGenerateImages} 
                disabled={isGeneratingImages || !adPlatform}
                className="w-1/2"
                size="sm"
              >
                {isGeneratingImages ? (
                  <>
                    <Loader className="mr-2 h-3 w-3 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Image className="mr-2 h-3 w-3" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        {!generatedPrompt && (
          <Button 
            onClick={handleGenerateImages} 
            disabled={isGeneratingImages || !adPlatform}
            className="px-6 w-full"
          >
            {isGeneratingImages ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Image className="mr-2 h-4 w-4" />
                Generate Image
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="w-full h-40 bg-gray-50 rounded-md border border-dashed border-gray-300 flex items-center justify-center">
        {generatedImageUrl ? (
          <img 
            src={generatedImageUrl} 
            alt="Generated persona image" 
            className="max-w-full max-h-40 object-contain"
          />
        ) : (
          <span className="text-gray-400">Images will appear here after generation</span>
        )}
      </div>

      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Image Generation Error</AlertDialogTitle>
            <AlertDialogDescription className="max-h-80 overflow-y-auto whitespace-pre-wrap font-mono text-xs">
              {errorDetails}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerateImages}>Retry</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImageGenerator;
