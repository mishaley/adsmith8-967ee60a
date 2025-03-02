
interface Persona {
  title: string;
  gender: string;
  ageMin: number;
  ageMax: number;
  interests: string[];
}

export const collectInterests = (personaList: Persona[]) => {
  // Get all interests and count occurrences
  const interestCounts: Record<string, number> = {};
  personaList.forEach(persona => {
    persona.interests.forEach(interest => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });
  });
  
  // Sort by count and return top 5
  return Object.entries(interestCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(entry => entry[0]);
};

export const generatePersonaSummary = (offering: string, personas: Persona[]) => {
  const demographics = personas.map((p: Persona) => 
    `${p.gender} aged ${p.ageMin}-${p.ageMax}`
  ).join(", ");
  
  return `Target audience for ${offering || "ramen noodles"}: ${demographics}. Key interests include ${collectInterests(personas).join(", ")}.`;
};

export const normalizeGender = (gender: string): string => {
  // Convert to lowercase for standardized comparison
  const lowerGender = gender.toLowerCase();
  
  // Check if it contains "men" or "women" and return the appropriate value
  if (lowerGender.includes("men") && !lowerGender.includes("women")) {
    return "Men";
  } else if (lowerGender.includes("women")) {
    return "Women";
  } else if (lowerGender.includes("both")) {
    // Randomly choose between "Men" and "Women" if "Both" is specified
    return Math.random() < 0.5 ? "Men" : "Women";
  } else {
    // Default to random gender if the input is unrecognized
    return Math.random() < 0.5 ? "Men" : "Women";
  }
};

/**
 * Ensures we get exactly two relevant and distinct interests for each persona
 * This function would normally be called by the API, but we include it here
 * to document the expected interest format
 */
export const ensureTwoInterests = (interests: string[], offering: string): string[] => {
  // If we have exactly two interests, return them
  if (interests.length === 2) {
    return interests;
  }
  
  // If we have more than two, take the first two
  if (interests.length > 2) {
    return interests.slice(0, 2);
  }
  
  // If we have less than two, generate a second one based on the offering
  if (interests.length === 1) {
    const secondInterest = generateRelatedInterest(interests[0], offering);
    return [interests[0], secondInterest];
  }
  
  // If we have no interests, generate two based on offering
  return [
    `${offering} related activities`,
    generateGenericInterest(offering)
  ];
};

/**
 * Helper function to generate a related but different interest
 */
const generateRelatedInterest = (existingInterest: string, offering: string): string => {
  // Simple implementation - in a real app, this might use AI or a predefined mapping
  const interest = existingInterest.toLowerCase();
  
  if (interest.includes("fitness") || interest.includes("health")) {
    return "Nutrition";
  } else if (interest.includes("tech") || interest.includes("gadget")) {
    return "Innovation";
  } else if (interest.includes("fashion") || interest.includes("style")) {
    return "Design";
  } else if (interest.includes("food") || interest.includes("cooking")) {
    return "Restaurants";
  } else if (interest.includes("travel") || interest.includes("adventure")) {
    return "Photography";
  } else {
    return `${offering} discovery`;
  }
};

/**
 * Helper function to generate a generic interest based on offering
 */
const generateGenericInterest = (offering: string): string => {
  const genericInterests = [
    "Social media",
    "Latest trends",
    "Personal development",
    "Quality products",
    "Value shopping",
    "Community events"
  ];
  
  return genericInterests[Math.floor(Math.random() * genericInterests.length)];
};
