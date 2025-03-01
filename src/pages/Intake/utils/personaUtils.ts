
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
