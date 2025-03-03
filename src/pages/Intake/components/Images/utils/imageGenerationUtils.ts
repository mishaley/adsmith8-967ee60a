
import { supabase } from "@/integrations/supabase/client";

// Function to generate a random 3-word phrase
export const generateRandomPhrase = () => {
  const adjectives = ["amazing", "innovative", "exciting", "remarkable", "incredible", "outstanding", "impressive", "extraordinary"];
  const nouns = ["experience", "solution", "feature", "product", "service", "design", "technology", "value"];
  const verbs = ["transforms", "elevates", "enhances", "revolutionizes", "improves", "optimizes", "maximizes", "delivers"];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  
  return `${randomAdjective} ${randomNoun} ${randomVerb}`;
};

// Function to get random approved style
export const getRandomApprovedStyle = async () => {
  try {
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name')
      .eq('style_status', 'Approved');
      
    if (error) {
      console.error('Error fetching styles:', error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.warn('No approved styles found');
      return "Vibrant and Modern";  // Fallback style
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].style_name;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    return "Vibrant and Modern";  // Fallback style
  }
};
