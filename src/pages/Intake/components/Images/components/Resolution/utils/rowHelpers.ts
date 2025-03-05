
/**
 * Helper functions to determine the row type based on the index
 */

export const isTopRow = (index: number): boolean => index < 3;
export const isMiddleRow = (index: number): boolean => index >= 3 && index < 6;
export const isBottomRow = (index: number): boolean => index >= 6 && index < 9;
export const isNewBottomRow = (index: number): boolean => index >= 9;
