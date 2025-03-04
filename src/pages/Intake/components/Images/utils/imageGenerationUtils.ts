
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

// Function to get random style from the database
export const getRandomApprovedStyle = async () => {
  try {
    console.log("Fetching random style from database...");
    
    // Fetch all styles from the y1styles table
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name')
      .not('style_name', 'is', null);
    
    if (error) {
      console.error('Error fetching styles:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.warn('No styles found in the database');
      // Return a default style if no styles found
      return "photographic";
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedStyle = data[randomIndex].style_name;
    console.log(`Selected style: ${selectedStyle}`);
    
    return selectedStyle;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    // Return a default style in case of any error
    console.warn('Using default style due to error');
    return "photographic";
  }
};
