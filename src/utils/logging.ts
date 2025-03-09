
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Set the minimum log level (can be changed based on environment)
let currentLogLevel: LogLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'info';

// Flag to control verbose debug logging
let debugMode = false;

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
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVEL_VALUES[level] >= LOG_LEVEL_VALUES[currentLogLevel];
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
 * Logger function for debug messages (only shown in debug mode)
 */
export const logDebug = (message: string, ...args: any[]): void => {
  if (debugMode && shouldLog('debug')) {
    console.debug(`[DEBUG] ${message}`, ...args);
  }
};

/**
 * Logger function for informational messages
 */
export const logInfo = (message: string, ...args: any[]): void => {
  if (shouldLog('info')) {
    console.info(`[INFO] ${message}`, ...args);
  }
};

/**
 * Logger function for warning messages
 */
export const logWarning = (message: string, ...args: any[]): void => {
  if (shouldLog('warn')) {
    console.warn(`[WARN] ${message}`, ...args);
  }
};

/**
 * Logger function for error messages
 */
export const logError = (message: string, error?: any, ...args: any[]): void => {
  if (shouldLog('error')) {
    console.error(`[ERROR] ${message}`, error, ...args);
  }
};
