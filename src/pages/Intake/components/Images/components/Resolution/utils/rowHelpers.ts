
/**
 * Helper functions to determine the row type based on the index
 */

// Since we only have the top row now, all indexes (0-2) are top row
export const isTopRow = (index: number): boolean => index >= 0 && index < 3;
export const isMiddleRow = (): boolean => false; // No middle row
export const isBottomRow = (): boolean => false; // No bottom row
export const isNewBottomRow = (): boolean => false; // No new bottom row
