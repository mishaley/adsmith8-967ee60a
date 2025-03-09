
/**
 * Debounce function to limit how often a function can be called
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined;
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

type EventRecord = {
  value: string;
  timestamp: number;
};

// Track recent events to prevent duplicates
const recentEvents: Record<string, EventRecord> = {};

// How long to consider an event a duplicate (in ms)
const DEDUPLICATION_WINDOW = 1000;

/**
 * Dispatch a custom event with deduplication
 * Only dispatches if the same event+value hasn't been sent in the last second
 */
export function dispatchDedupedEvent(eventName: string, detail: Record<string, any>): void {
  const key = `${eventName}-${JSON.stringify(detail)}`;
  const now = Date.now();
  
  // Check if we've recently dispatched this exact event
  if (recentEvents[key] && (now - recentEvents[key].timestamp) < DEDUPLICATION_WINDOW) {
    return; // Skip this duplicate event
  }
  
  // Record this event
  recentEvents[key] = {
    value: JSON.stringify(detail),
    timestamp: now
  };
  
  // Clean up old events occasionally
  if (Object.keys(recentEvents).length > 50) {
    cleanupOldEvents();
  }
  
  // Dispatch the event
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
}

/**
 * Clean up old event records
 */
function cleanupOldEvents(): void {
  const now = Date.now();
  Object.keys(recentEvents).forEach(key => {
    if (now - recentEvents[key].timestamp > DEDUPLICATION_WINDOW) {
      delete recentEvents[key];
    }
  });
}
