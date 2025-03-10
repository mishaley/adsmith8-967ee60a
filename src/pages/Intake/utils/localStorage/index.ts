
// Export all localStorage utilities from a single entry point
export * from './constants';
export * from './core';
export * from './cleanup';
export * from './formClear';

// Re-export validation functions using a namespace to avoid naming conflicts
import * as validationFuncs from './validation';
export const validationFunctions = validationFuncs;
