
/**
 * Dispatch an event with deduplication to avoid multiple identical events
 * @param eventName The name of the event to dispatch
 * @param detail The data to include with the event
 * @param dedupeTimeout Time in ms to dedupe identical events (default: 100ms)
 */
export const dispatchDedupedEvent = (
  eventName: string, 
  detail: Record<string, any>, 
  dedupeTimeout = 100
) => {
  // Create a unique identifier for this event based on its name and data
  const eventId = `${eventName}-${JSON.stringify(detail)}`;
  
  // Check if we've recently dispatched this exact event
  if (window._lastDispatchedEvents && window._lastDispatchedEvents[eventId]) {
    const lastDispatched = window._lastDispatchedEvents[eventId];
    const now = Date.now();
    
    // If the same event was dispatched less than dedupeTimeout ms ago, skip it
    if (now - lastDispatched < dedupeTimeout) {
      return;
    }
  }
  
  // Initialize the tracking object if it doesn't exist
  if (!window._lastDispatchedEvents) {
    window._lastDispatchedEvents = {};
  }
  
  // Record this event dispatch
  window._lastDispatchedEvents[eventId] = Date.now();
  
  // Dispatch the event
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
  
  // Clean up the tracking object after a while to prevent memory leaks
  const maxEvents = 100;
  const keys = Object.keys(window._lastDispatchedEvents);
  if (keys.length > maxEvents) {
    // Remove the oldest entries
    const sortedKeys = keys.sort((a, b) => 
      window._lastDispatchedEvents[a] - window._lastDispatchedEvents[b]
    );
    
    // Remove the oldest half of the entries
    const toRemove = sortedKeys.slice(0, Math.floor(maxEvents / 2));
    toRemove.forEach(key => {
      delete window._lastDispatchedEvents[key];
    });
  }
};

// Augment the Window interface to include our tracking object
declare global {
  interface Window {
    _lastDispatchedEvents?: Record<string, number>;
  }
}
