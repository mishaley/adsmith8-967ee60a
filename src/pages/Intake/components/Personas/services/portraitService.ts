
import { supabase } from "@/integrations/supabase/client";
import { Persona } from "../types";
import { createPortraitPrompt, getRandomRace } from "../utils/portraitUtils";

export interface PortraitResponse {
  imageUrl: string | null;
  error: Error | null;
}

// Generate portrait for a single persona with retry logic
export const generatePersonaPortrait = async (persona: Persona): Promise<PortraitResponse> => {
  try {
    // Create a persona with race if not already present
    const personaWithRace = { ...persona };
    if (!personaWithRace.race) {
      personaWithRace.race = getRandomRace();
    }
    
    const prompt = createPortraitPrompt(personaWithRace);
    console.log(`Generating portrait for ${personaWithRace.gender}, age ${personaWithRace.ageMin}-${personaWithRace.ageMax} with prompt: ${prompt.substring(0, 50)}...`);
    
    // Add a longer timeout - 90 seconds for initial generation
    const timeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: null, 
          error: new Error('Request timed out after 90 seconds') 
        });
      }, 90000); // Increased timeout to 90 seconds for initial generation
    });
    
    // Race the actual request against the timeout
    console.log("Calling Supabase edge function: ideogram-test");
    const { data, error } = await Promise.race([
      supabase.functions.invoke('ideogram-test', {
        body: { 
          prompt,
          highPriority: true, // Mark this as high priority
          retryAttempt: 0 // Initial attempt
        }
      }),
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Error generating portrait:', error.message, error);
      
      // Retry once more immediately with a different timeout
      console.log(`Retrying portrait generation immediately after error.`);
      
      const secondTimeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
        setTimeout(() => {
          resolve({ 
            data: null, 
            error: new Error('Second attempt timed out after 90 seconds') 
          });
        }, 90000);
      });
      
      const secondAttempt = await Promise.race([
        supabase.functions.invoke('ideogram-test', {
          body: { 
            prompt,
            highPriority: true,
            retryAttempt: 1 // Mark as retry attempt
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
