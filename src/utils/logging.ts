
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogCategory = 'localStorage' | 'api' | 'ui' | 'general';

// Set the minimum log level (can be changed based on environment)
let currentLogLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';

// Flag to control verbose debug logging - default to false to reduce console output
let debugMode = false;

// Log category filters - initially all enabled
const enabledCategories: Record<LogCategory, boolean> = {
  localStorage: true,
  api: true,
  ui: true,
  general: true
};

// Map log levels to numeric values for comparison
const LOG_LEVEL_VALUES: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Helper to check if a log level should be displayed
 */
const shouldLog = (level: LogLevel, category: LogCategory = 'general'): boolean => {
  // Check both level and category filters
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[currentLogLevel] && enabledCategories[category];
};

/**
 * Set the current log level
 */
export const setLogLevel = (level: LogLevel): void => {
  currentLogLevel = level;
};

/**
 * Enable or disable debug mode
 */
export const setDebugMode = (enabled: boolean): void => {
  debugMode = enabled;
  if (enabled && currentLogLevel !== 'debug') {
    console.info('Debug mode enabled, but log level is set to', currentLogLevel);
  }
};

/**
 * Enable or disable logging for a specific category
 */
export const setLogCategoryEnabled = (category: LogCategory, enabled: boolean): void => {
  enabledCategories[category] = enabled;
};

/**
 * Logger function for debug messages (only shown in debug mode)
 */
export const logDebug = (message: string, category: LogCategory = 'general', ...args: any[]): void => {
  if (debugMode && shouldLog('debug', category)) {
    console.debug(`[DEBUG:${category}] ${message}`, ...args);
  }
};

/**
 * Logger function for informational messages - minimal output
 */
export const logInfo = (message: string, category: LogCategory = 'general', ...args: any[]): void => {
  if (shouldLog('info', category)) {
    // Simplified output for better console readability
    console.info(`[INFO:${category}] ${message}`);
  }
};

/**
 * Logger function for warning messages
 */
export const logWarning = (message: string, category: LogCategory = 'general', ...args: any[]): void => {
  if (shouldLog('warn', category)) {
    console.warn(`[WARN:${category}] ${message}`, ...args);
  }
};

/**
 * Logger function for error messages - simplified to reduce output
 */
export const logError = (message: string, category: LogCategory = 'general', error?: any, ...args: any[]): void => {
  if (shouldLog('error', category)) {
    // Only log the message and error message, not the full error object
    console.error(`[ERROR:${category}] ${message}`, error?.message || error);
  }
};

// Disable localStorage category by default to reduce noise
// This can be re-enabled when debugging specific localStorage issues
setLogCategoryEnabled('localStorage', false);
