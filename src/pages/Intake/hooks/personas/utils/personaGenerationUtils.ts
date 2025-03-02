
/**
 * Utility functions for persona generation
 */

/**
 * Get a random race based on demographic distribution
 */
export const getRandomRace = (): string => {
  const RACE_DISTRIBUTION = [
    "White", "White", "White", "Latino", "Latino", 
    "Black", "Black", "Asian", "Indian-American", "Biracial"
  ];
  
  const randomIndex = Math.floor(Math.random() * RACE_DISTRIBUTION.length);
  return RACE_DISTRIBUTION[randomIndex];
};

/**
 * Enhance a persona's title based on their interests
 */
export const enhancePersonaTitle = (title: string, interests: string[]): string => {
  if (!interests || interests.length === 0) {
    return title;
  }

  const primaryInterest = interests[0];
  
  if (!title.toLowerCase().includes(primaryInterest.toLowerCase())) {
    const interestWords = primaryInterest.split(' ');
    const interestWord = interestWords[0];
    
    const creativeAdjectives = [
      "Passionate", "Dedicated", "Enthusiastic", "Devoted", "Avid",
      "Expert", "Savvy", "Inspired", "Innovative", "Trendy"
    ];
    const creativeNouns = [
      "Enthusiast", "Aficionado", "Devotee", "Maven", "Explorer",
      "Connoisseur", "Guru", "Pioneer", "Advocate", "Specialist"
    ];
    
    const randomAdjective = creativeAdjectives[Math.floor(Math.random() * creativeAdjectives.length)];
    const randomNoun = creativeNouns[Math.floor(Math.random() * creativeNouns.length)];
    
    return `${interestWord} ${randomAdjective} ${randomNoun}`;
  }
  
  return title;
};
