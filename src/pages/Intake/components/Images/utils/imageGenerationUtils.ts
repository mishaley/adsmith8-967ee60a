
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
    
    // Get the count of approved styles first
    const { count, error: countError } = await supabase
      .from('y1styles')
      .select('*', { count: 'exact', head: true })
      .eq('style_status', 'Approved');
      
    if (countError) {
      console.error('Error checking style count:', countError);
      throw new Error(`Database count error: ${countError.message}`);
    }
    
    console.log(`Found ${count} total styles in the database`);
    
    // Now fetch all approved styles
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name, style_status')
      .eq('style_status', 'Approved');
      
    if (error) {
      console.error('Error fetching styles:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`Fetched data:`, data);
    
    if (!data || data.length === 0) {
      console.error('No approved styles found. Checking for any styles in the database...');
      
      // Check if there are any styles at all (regardless of status)
      const { data: allStyles, error: allStylesError } = await supabase
        .from('y1styles')
        .select('style_name, style_status');
        
      if (allStylesError) {
        console.error('Error fetching all styles:', allStylesError);
      } else {
        console.log(`Found ${allStyles?.length || 0} total styles with various statuses:`, 
          allStyles?.map(s => `${s.style_name} (${s.style_status})`));
      }
      
      throw new Error('No approved styles found in database');
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedStyle = data[randomIndex].style_name;
    console.log(`Selected style: ${selectedStyle}`);
    
    return selectedStyle;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    throw new Error('Failed to get an approved style: ' + (error instanceof Error ? error.message : String(error)));
  }
};
