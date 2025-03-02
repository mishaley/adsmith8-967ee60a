
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
          error: new Error('Request timed out after 30 seconds') 
        });
      }, 30000); // Increased timeout to 30 seconds
    });
    
    // Race the actual request against the timeout
    console.log("Calling Supabase edge function: ideogram-test");
    const { data, error } = await Promise.race([
      supabase.functions.invoke('ideogram-test', {
        body: { prompt }
      }),
      timeoutPromise
    ]);
    
    if (error) {
      console.error('Error generating portrait:', error.message, error);
      
      // Always retry on error, no limit on retries
      console.log(`Retrying portrait generation. Waiting 3 seconds before retry.`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
      return generatePersonaPortrait(persona, retryCount);
    }
    
    console.log("Portrait generation response data:", data);
    
    // Extract image URL from response data
    let imageUrl = null;
    if (data?.imageUrl) {
      imageUrl = data.imageUrl;
    } else if (data?.data && data.data.length > 0 && data.data[0].url) {
      imageUrl = data.data[0].url;
    }
    
    // If we got a response but no image URL, that's also an error - retry
    if (!imageUrl) {
      console.error('No image URL in response:', data);
      console.log(`No image URL in response. Retrying. Waiting 3 seconds before retry.`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
      return generatePersonaPortrait(persona, retryCount);
    }
    
    // Validate image URL by checking if it's a valid URL
    try {
      new URL(imageUrl);
      console.log(`Successfully generated portrait with URL: ${imageUrl.substring(0, 50)}...`);
      return { imageUrl, error: null };
    } catch (urlError) {
      console.error('Invalid image URL:', imageUrl);
      console.log(`Invalid image URL. Retrying. Waiting 3 seconds before retry.`);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
      return generatePersonaPortrait(persona, retryCount);
    }
  } catch (error) {
    console.error('Error in portrait generation:', error);
    
    // Retry on any error
    console.log(`Exception in portrait generation. Retrying. Waiting 3 seconds before retry.`);
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait before retry
    return generatePersonaPortrait(persona, retryCount);
  }
};
