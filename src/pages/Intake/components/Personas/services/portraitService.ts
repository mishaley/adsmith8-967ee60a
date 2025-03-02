
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt, getRandomRace } from "../utils/portraitUtils";

export interface PortraitResponse {
  imageUrl: string | null;
  error: Error | null;
}

// Generate portrait for a single persona with retry logic
export const generatePersonaPortrait = async (persona: Persona, retryCount = 2): Promise<PortraitResponse> => {
  try {
    // Create a persona with race if not already present
    const personaWithRace = { ...persona };
    if (!personaWithRace.race) {
      personaWithRace.race = getRandomRace();
    }
    
    const prompt = createPortraitPrompt(personaWithRace);
    console.log(`Generating portrait for ${personaWithRace.title} with prompt: ${prompt.substring(0, 50)}...`);
    
    // Add a timeout to the fetch request
    const timeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: null, 
          error: new Error('Request timed out after 15 seconds') 
        });
      }, 15000);
    });
    
    // Race the actual request against the timeout
    const { data, error } = await Promise.race([
      supabase.functions.invoke('ideogram-test', {
        body: { prompt }
      }),
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Error generating portrait:', error);
      
      // Retry logic if we have retries left
      if (retryCount > 0) {
        console.log(`Retrying portrait generation for ${personaWithRace.title}. Attempts left: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait before retry
        return generatePersonaPortrait(persona, retryCount - 1);
      }
      
      return { imageUrl: null, error };
    }
    
    // Extract image URL from response data
    let imageUrl = null;
    if (data?.imageUrl) {
      imageUrl = data.imageUrl;
    } else if (data?.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }
    
    // If we got a response but no image URL, that's also an error
    if (!imageUrl) {
      console.error('No image URL in response:', data);
      return { 
        imageUrl: null, 
        error: new Error('No image URL in response') 
      };
    }
    
    // Validate image URL by checking if it's a valid URL
    try {
      new URL(imageUrl);
      console.log(`Successfully generated portrait for ${personaWithRace.title}`);
      return { imageUrl, error: null };
    } catch (urlError) {
      console.error('Invalid image URL:', imageUrl);
      return { 
        imageUrl: null, 
        error: new Error('Invalid image URL received') 
      };
    }
  } catch (error) {
    console.error('Error in portrait generation:', error);
    return { 
      imageUrl: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};
