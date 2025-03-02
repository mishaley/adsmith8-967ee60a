
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt, getRandomRace } from "../utils/portraitUtils";

export interface PortraitResponse {
  imageUrl: string | null;
  error: Error | null;
}

// Generate portrait for a single persona
export const generatePersonaPortrait = async (persona: Persona): Promise<PortraitResponse> => {
  try {
    // Create a persona with race if not already present
    const personaWithRace = { ...persona };
    if (!personaWithRace.race) {
      personaWithRace.race = getRandomRace();
    }
    
    const prompt = createPortraitPrompt(personaWithRace);
    
    const { data, error } = await supabase.functions.invoke('ideogram-test', {
      body: { prompt }
    });
    
    if (error) {
      console.error('Error generating portrait:', error);
      return { imageUrl: null, error };
    }
    
    // Extract image URL from response data
    let imageUrl = null;
    if (data.imageUrl) {
      imageUrl = data.imageUrl;
    } else if (data.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }
    
    return { imageUrl, error: null };
  } catch (error) {
    console.error('Error in portrait generation:', error);
    return { 
      imageUrl: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};
