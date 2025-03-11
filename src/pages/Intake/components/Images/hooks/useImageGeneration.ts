
import { useState, useCallback } from "react";
import { Persona } from "../../Personas/types";
import { supabase } from "@/integrations/supabase/client";
import { logDebug, logError } from "@/utils/logging";

interface UseImageGenerationParams {
  currentPersona: Persona;
  adPlatform: string;
  toast: any;
  offering?: string;
  imageFormat?: string;
}

export const useImageGeneration = ({
  currentPersona,
  adPlatform,
  toast,
  offering = "",
  imageFormat = "graphic-variety"
}: UseImageGenerationParams) => {
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [errorDetails, setErrorDetails] = useState<any>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  // Generate prompt based on persona and message
  const handleGeneratePrompt = useCallback(async () => {
    if (!currentPersona) {
      toast({
        title: "Error",
        description: "No persona selected",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPrompt(true);
    setGeneratedPrompt("");
    
    try {
      // Construct a prompt for image generation
      const promptFormat = imageFormat === "brand-aesthetic" 
        ? "brand aesthetic consistent with company identity" 
        : "graphic variety with visual interest";
        
      const persona = currentPersona.attributes 
        ? `${currentPersona.name}, a ${currentPersona.attributes.join(', ')}`
        : currentPersona.name;
      
      const platformInfo = adPlatform ? `for ${adPlatform} advertisement` : "";
      const offeringInfo = offering ? `related to ${offering}` : "";
      
      const prompt = `Create a photorealistic image of ${persona} ${platformInfo} ${offeringInfo}. 
      The image should have ${promptFormat}. 
      Make sure the image is high quality, well-lit, and visually appealing.`;
      
      setGeneratedPrompt(prompt);
      
      // Log the generated prompt
      logDebug(`Generated prompt: ${prompt}`, 'images');
      
      toast({
        title: "Prompt Generated",
        description: "You can now generate an image or modify the prompt"
      });
    } catch (error) {
      logError("Error generating prompt:", 'images', error);
      toast({
        title: "Error",
        description: "Failed to generate prompt",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPrompt(false);
    }
  }, [currentPersona, adPlatform, offering, toast, imageFormat]);

  // Generate image using the prompt
  const handleGenerateImages = useCallback(async () => {
    if (!generatedPrompt) {
      // If no prompt exists, generate one first
      await handleGeneratePrompt();
      return;
    }
    
    setIsGeneratingImages(true);
    setGeneratedImageUrl("");
    setErrorDetails(null);
    
    try {
      // Call Supabase Edge Function to generate image
      const { data, error } = await supabase.functions.invoke('generate-persona-image', {
        body: { prompt: generatedPrompt }
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }
      
      setGeneratedImageUrl(data.imageUrl);
      
      toast({
        title: "Image Generated",
        description: "Your image has been generated successfully"
      });
    } catch (error) {
      logError("Error generating image:", 'images', error);
      setErrorDetails(error);
      setShowErrorDialog(true);
      
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImages(false);
    }
  }, [generatedPrompt, handleGeneratePrompt, toast]);

  return {
    isGeneratingPrompt,
    isGeneratingImages,
    generatedPrompt,
    generatedImageUrl,
    errorDetails,
    showErrorDialog,
    handleGeneratePrompt,
    handleGenerateImages,
    setGeneratedPrompt,
    setShowErrorDialog
  };
};
