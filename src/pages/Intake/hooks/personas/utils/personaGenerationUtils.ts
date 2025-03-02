
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
