
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt, getRandomRace } from "../utils/portraitUtils";

export interface PortraitResponse {
  imageUrl: string | null;
  error: Error | null;
}

// Generate portrait for a single persona with reliable generation
export const generatePersonaPortrait = async (persona: Persona): Promise<PortraitResponse> => {
  try {
    // Create a persona with race if not already present
    const personaWithRace = { ...persona };
    if (!personaWithRace.race) {
      personaWithRace.race = getRandomRace();
    }
    
    const prompt = createPortraitPrompt(personaWithRace);
    console.log(`Generating portrait for ${personaWithRace.gender}, age ${personaWithRace.ageMin}-${personaWithRace.ageMax} with prompt: ${prompt.substring(0, 50)}...`);
    
    // First attempt with a 2-minute timeout
    const timeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: null, 
          error: new Error('Request timed out after 120 seconds') 
        });
      }, 120000); // 2 minutes timeout for initial generation
    });
    
    // Make the API call with high priority flag
    console.log("Calling Supabase edge function: ideogram-test (first attempt)");
    const { data, error } = await Promise.race([
      supabase.functions.invoke('ideogram-test', {
        body: { 
          prompt,
          highPriority: true,
          forceGeneration: true,
          retryAttempt: 0
        }
      }),
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Error in first portrait generation attempt:', error);
      
      // Immediately try a second attempt with different parameters
      console.log("Starting second attempt for portrait generation");
      
      const secondTimeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
        setTimeout(() => {
          resolve({ 
            data: null, 
            error: new Error('Second attempt timed out after 120 seconds') 
          });
        }, 120000);
      });
      
      const secondAttempt = await Promise.race([
        supabase.functions.invoke('ideogram-test', {
          body: { 
            prompt,
            highPriority: true,
            forceGeneration: true,
            retryAttempt: 1,
            emergencyGeneration: true
          }
        }),
        secondTimeoutPromise
      ]);
      
      if (secondAttempt.error) {
        console.error('Error in second portrait generation attempt:', secondAttempt.error);
        return { imageUrl: null, error: secondAttempt.error };
      }
      
      return extractImageUrl(secondAttempt.data);
    }
    
    return extractImageUrl(data);
  } catch (error) {
    console.error('Unexpected error in portrait generation:', error);
    return { imageUrl: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Helper function to extract image URL from response data
const extractImageUrl = (data: any): PortraitResponse => {
  console.log("Portrait generation response data:", data);
  
  // Extract image URL from response data
  let imageUrl = null;
  if (data?.imageUrl) {
    imageUrl = data.imageUrl;
  } else if (data?.data && data.data.length > 0 && data.data[0].url) {
    imageUrl = data.data[0].url;
  }
  
  // If we got a response but no image URL, that's an error
  if (!imageUrl) {
    console.error('No image URL in response:', data);
    return { imageUrl: null, error: new Error('No image URL in response') };
  }
  
  // Validate image URL
  try {
    new URL(imageUrl);
    console.log(`Successfully generated portrait with URL: ${imageUrl.substring(0, 50)}...`);
    return { imageUrl, error: null };
  } catch (urlError) {
    console.error('Invalid image URL:', imageUrl);
    return { imageUrl: null, error: new Error('Invalid image URL returned from API') };
  }
};
