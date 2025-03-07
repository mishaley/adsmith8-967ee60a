
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt } from "../utils/portraitUtils";

export interface PortraitResult {
  imageUrl?: string;
  error?: string;
}

export const generatePersonaPortrait = async (
  persona: Persona,
  customPrompt?: string
): Promise<PortraitResult> => {
  try {
    // Use custom prompt if provided, otherwise generate one
    const prompt = customPrompt || createPortraitPrompt(persona);
    console.log(`Generating portrait with prompt: ${prompt}`);

    // Call Supabase Edge function to generate the portrait
    const { data, error } = await supabase.functions.invoke('generate-persona-image', {
      body: { prompt }
    });

    if (error) {
      console.error('Error generating portrait:', error);
      return { error: error.message };
    }

    if (data && data.success && data.imageUrl) {
      return { imageUrl: data.imageUrl };
    } else {
      console.error('Invalid response from portrait generation:', data);
      return { error: data?.error || 'Failed to generate portrait' };
    }
  } catch (error) {
    console.error('Exception in portrait generation:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
