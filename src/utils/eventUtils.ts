import { logDebug } from "@/utils/logging";

// Keep track of last dispatched event details to prevent duplicates
const lastDispatchedEvents: Record<string, { detail: any; timestamp: number }> = {};

/**
 * Dispatches a custom event with deduplication to prevent duplicate events
 * within a specified time window
 * 
 * @param eventName The name of the custom event to dispatch
 * @param detail The event detail object
 * @param dedupWindow Time window in ms for deduplication (default: 200ms)
 * @returns boolean indicating if the event was dispatched
 */
export const dispatchDedupedEvent = (
  eventName: string, 
  detail: any, 
  dedupWindow = 200
): boolean => {
  // Create a string key for the event based on name and details
  const detailString = JSON.stringify(detail);
  const eventKey = `${eventName}:${detailString}`;
  
  // Check if this exact event was recently dispatched
  const lastEvent = lastDispatchedEvents[eventKey];
  const now = Date.now();
  
  if (lastEvent && (now - lastEvent.timestamp) < dedupWindow) {
    // Skip duplicate event within the deduplication window
    logDebug(`Skipped duplicate event: ${eventName}`, 'events');
    return false;
  }
  
  // Create and dispatch the custom event
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
  
  // Record this event
  lastDispatchedEvents[eventKey] = {
    detail,
    timestamp: now
  };
  
  logDebug(`Dispatched event: ${eventName}`, 'events');
  return true;
};

/**
 * Simple wrapper to dispatch a custom event without deduplication
 * 
 * @param eventName The name of the custom event to dispatch
 * @param detail The event detail object
 */
export const dispatchEvent = (eventName: string, detail: any): void => {
  const event = new CustomEvent(eventName, { detail });
  window.dispatchEvent(event);
  logDebug(`Dispatched event: ${eventName}`, 'events');
};
