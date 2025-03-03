
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
    
    // First, log how many records exist in the table total
    const totalCount = await supabase
      .from('y1styles')
      .select('style_id', { count: 'exact', head: true });
      
    console.log(`Total records in y1styles: ${totalCount.count || 'unknown'}`);
    
    // Now get the approved styles
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name, style_status');
      
    if (error) {
      console.error('Error fetching styles:', error);
      throw new Error(`Failed to fetch approved styles from database: ${error.message}`);
    }
    
    console.log(`Retrieved ${data?.length || 0} total records from y1styles`);
    
    // Log all the records for debugging
    console.log('All styles in database:', data);
    
    // Filter to get only the approved styles (case-insensitive check)
    const approvedStyles = data?.filter(
      style => style.style_status?.toLowerCase() === 'approved'
    );
    
    console.log(`Found ${approvedStyles?.length || 0} approved styles`);
    console.log('Approved styles:', approvedStyles);
    
    if (!approvedStyles || approvedStyles.length === 0) {
      console.error('No approved styles found in database');
      throw new Error('No approved styles found in database');
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * approvedStyles.length);
    const selectedStyle = approvedStyles[randomIndex].style_name;
    console.log(`Selected style: ${selectedStyle}`);
    
    return selectedStyle;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    throw new Error('Failed to get an approved style: ' + (error instanceof Error ? error.message : String(error)));
  }
};
