
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
    console.log(`Generating portrait for ${personaWithRace.gender}, age ${personaWithRace.ageMin}-${personaWithRace.ageMax} with prompt: ${prompt.substring(0, 50)}...`);
    
    // Add a timeout to the fetch request
    const timeoutPromise = new Promise<{ data: null, error: Error }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: null, 
          error: new Error('Request timed out after 45 seconds') 
        });
      }, 45000); // Increased timeout to 45 seconds
    });
    
    // Race the actual request against the timeout
    console.log("Calling Supabase edge function: ideogram-test");
    
    // Start the timer for latency measurement
    const startTime = Date.now();
    
    try {
      const { data, error } = await Promise.race([
        supabase.functions.invoke('ideogram-test', {
          body: { prompt }
        }),
        timeoutPromise
      ]);
      
      // Calculate and log the latency
      const latency = Date.now() - startTime;
      console.log(`Ideogram API latency: ${latency}ms`);
      
      if (error) {
        console.error('Error generating portrait:', error.message, error);
        
        // Log more details about the error
        if (error instanceof Error) {
          console.error('Error stack:', error.stack);
          console.error('Error name:', error.name);
        }
        
        // Retry logic if we have retries left
        if (retryCount > 0) {
          console.log(`Retrying portrait generation. Attempts left: ${retryCount}`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
          return generatePersonaPortrait(persona, retryCount - 1);
        }
        
        return { imageUrl: null, error };
      }
      
      console.log("Portrait generation response data:", data);
      
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
        console.log(`Successfully generated portrait with URL: ${imageUrl.substring(0, 50)}...`);
        return { imageUrl, error: null };
      } catch (urlError) {
        console.error('Invalid image URL:', imageUrl);
        return { 
          imageUrl: null, 
          error: new Error('Invalid image URL received') 
        };
      }
    } catch (fetchError) {
      console.error('Fetch error details:', {
        name: fetchError.name,
        message: fetchError.message,
        code: fetchError.code,
        cause: fetchError.cause,
      });
      
      if (retryCount > 0) {
        console.log(`Network error occurred. Retrying portrait generation. Attempts left: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
        return generatePersonaPortrait(persona, retryCount - 1);
      }
      
      return { 
        imageUrl: null, 
        error: fetchError instanceof Error 
          ? fetchError 
          : new Error('Failed to fetch from edge function')
      };
    }
  } catch (error) {
    console.error('Error in portrait generation:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    
    return { 
      imageUrl: null, 
      error: error instanceof Error ? error : new Error('Unknown error occurred') 
    };
  }
};
