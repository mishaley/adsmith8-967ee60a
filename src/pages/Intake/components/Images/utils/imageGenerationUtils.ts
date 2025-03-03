
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

// Default styles to use if database has no approved styles
const defaultStyles = [
  "Digital Art",
  "Photorealistic",
  "Watercolor",
  "Abstract",
  "Cinematic",
  "Vintage",
  "Illustration",
  "Minimalist"
];

// Function to get random approved style
export const getRandomApprovedStyle = async () => {
  try {
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name')
      .eq('style_status', 'Approved');
      
    if (error) {
      console.error('Error fetching styles:', error);
      console.warn('Using default styles due to database error');
      return getRandomDefaultStyle();
    }
    
    if (!data || data.length === 0) {
      console.warn('No approved styles found in database, using default styles');
      return getRandomDefaultStyle();
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex].style_name;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    console.warn('Using default styles due to exception');
    return getRandomDefaultStyle();
  }
};

// Function to get a random style from our default styles
const getRandomDefaultStyle = () => {
  const randomIndex = Math.floor(Math.random() * defaultStyles.length);
  return defaultStyles[randomIndex];
};
