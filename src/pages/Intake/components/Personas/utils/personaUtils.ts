
/**
 * Default persona prompt template with placeholders
 */
export const getPersonaPromptTemplate = (): string => {
  return `Generate [COUNT] target customer personas who would be most likely to benefit from this offering.

For each persona, provide:
1. Gender (IMPORTANT: Choose either Men or Women, do NOT use "Both")
2. Age range ([AGE_MIN]-[AGE_MAX])
3. Two main interests ([INTEREST1], [INTEREST2]) that align with the offering's value proposition

Format the response as a JSON array with objects having these fields:
gender, ageMin, ageMax, interests (as array of strings)`;
};

/**
 * Create a persona generation prompt based on offering and count
 */
export const createPersonaPrompt = (offering: string, count: number): string => {
  return getPersonaPromptTemplate()
    .replace("[COUNT]", String(count))
    .replace("[AGE_MIN]", "min")
    .replace("[AGE_MAX]", "max")
    .replace("[INTEREST1]", "interest1")
    .replace("[INTEREST2]", "interest2");
};
