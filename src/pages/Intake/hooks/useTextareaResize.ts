import { useState, useEffect, RefObject } from "react";

export const useTextareaResize = (
  textareaRef: RefObject<HTMLTextAreaElement>, 
  value: string, 
  tempTranscript: string = ""
) => {
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  
  // Update height only when the content grows
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Store the original height
      const originalHeight = textarea.style.height;
      
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      
      // Get the new scrollHeight
      const newHeight = textarea.scrollHeight;
      
      // Only update if the new height is greater than the current height
      // This prevents the textarea from shrinking
      if (currentHeight === null || newHeight > currentHeight) {
        textarea.style.height = `${newHeight}px`;
        setCurrentHeight(newHeight);
      } else {
        // Keep the larger height
        textarea.style.height = `${currentHeight}px`;
      }
    }
  }, [value, tempTranscript, currentHeight, textareaRef]);
  
  // Reset height when the field is cleared
  useEffect(() => {
    if (!value && !tempTranscript && currentHeight !== null) {
      setCurrentHeight(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [value, tempTranscript, textareaRef, currentHeight]);
  
  return {
    currentHeight
  };
};
