
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

// Function to get random approved style from the database
export const getRandomApprovedStyle = async () => {
  try {
    console.log("Fetching approved styles from y1styles table...");
    
    // Fetch all styles with status "Approved"
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name')
      .eq('style_status', 'Approved');
      
    if (error) {
      console.error('Error fetching styles:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    // Add some default styles in case there are none in the database
    let approvedStyles = data || [];
    console.log(`Retrieved ${approvedStyles.length} approved styles`);
    
    if (approvedStyles.length === 0) {
      // Fallback styles if none are found in the database
      const fallbackStyles = [
        { style_name: "Vibrant Watercolor" },
        { style_name: "Modern Minimalist" },
        { style_name: "Vintage Photography" },
        { style_name: "Bold Graphic" },
        { style_name: "Elegant Monochrome" }
      ];
      console.log("No approved styles found in database, using fallback styles");
      approvedStyles = fallbackStyles;
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * approvedStyles.length);
    const selectedStyle = approvedStyles[randomIndex].style_name;
    console.log(`Selected style: ${selectedStyle}`);
    
    return selectedStyle;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    // Provide fallback styles even in case of error
    const fallbackStyles = [
      "Cinematic", "Photorealistic", "Impressionist", "Digital Art", "Anime"
    ];
    const randomFallback = fallbackStyles[Math.floor(Math.random() * fallbackStyles.length)];
    console.log(`Error occurred, using fallback style: ${randomFallback}`);
    return randomFallback;
  }
};
