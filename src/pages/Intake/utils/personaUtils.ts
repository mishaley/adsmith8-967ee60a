
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
