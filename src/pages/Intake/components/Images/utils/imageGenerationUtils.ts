
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

// Function to get random style from the database regardless of status
export const getRandomApprovedStyle = async () => {
  try {
    console.log("Fetching styles from y1styles table...");
    
    // Debug the table structure
    const { data: tables } = await supabase
      .from('_tables')
      .select('table_name');
    
    console.log("Available tables:", tables);
    
    // Check count with explicit schema reference
    const countResult = await supabase
      .from('y1styles')
      .select('*', { count: 'exact', head: true });
      
    if (countResult.error) {
      console.error('Error checking style count:', countResult.error);
      throw new Error(`Database count error: ${countResult.error.message}`);
    }
    
    const totalCount = countResult.count ?? 0;
    console.log(`Found ${totalCount} total styles in the database`);
    
    if (totalCount === 0) {
      // Try alternative query to see if table exists but name is different
      console.log("Trying alternative queries to debug...");
      
      const { data: allStyles, error: stylesError } = await supabase
        .from('y1styles')
        .select('style_id, style_name, style_status')
        .limit(5);
        
      if (stylesError) {
        console.error("Error with alternative query:", stylesError);
      } else {
        console.log("Alternative query found data:", allStyles);
      }
      
      throw new Error('No styles found in database');
    }
    
    // Now fetch all styles with more detailed logging
    console.log("Fetching style records...");
    const { data, error } = await supabase
      .from('y1styles')
      .select('style_name, style_status');
      
    if (error) {
      console.error('Error fetching styles:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`Fetched data:`, data);
    
    if (!data || data.length === 0) {
      console.error('No styles found in result set, despite count showing records');
      throw new Error('No styles found in database');
    }
    
    // Select a random style from the results
    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedStyle = data[randomIndex].style_name;
    console.log(`Selected style: ${selectedStyle} (Status: ${data[randomIndex].style_status})`);
    
    return selectedStyle;
  } catch (error) {
    console.error('Exception fetching styles:', error);
    throw new Error('Failed to get a style: ' + (error instanceof Error ? error.message : String(error)));
  }
};
