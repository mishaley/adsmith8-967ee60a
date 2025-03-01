
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseTranscriptionCorrectionProps {
  value: string;
}

export const useTranscriptionCorrection = ({ value }: UseTranscriptionCorrectionProps) => {
  const [originalTranscription, setOriginalTranscription] = useState("");
  const [transcriptionChanged, setTranscriptionChanged] = useState(false);
  const [previousValue, setPreviousValue] = useState("");
  const { toast } = useToast();
  
  // Track when user manually edits the transcription
  useEffect(() => {
    if (originalTranscription && value !== originalTranscription) {
      setTranscriptionChanged(true);
    }
  }, [value, originalTranscription]);

  const setTranscription = (text: string) => {
    setOriginalTranscription(text);
    setTranscriptionChanged(false);
  };

  const saveOriginalValue = (text: string) => {
    setPreviousValue(text);
  };

  const getOriginalValue = () => previousValue;

  // Save the correction when the user moves away from the field
  const handleBlur = async () => {
    if (transcriptionChanged && originalTranscription && value !== originalTranscription) {
      try {
        await supabase.functions.invoke('save-transcription-correction', {
          body: { 
            original: originalTranscription,
            corrected: value
          }
        });
        
        setTranscriptionChanged(false);
        toast({
          title: "Correction saved",
          description: "Thank you for helping us improve!",
        });
      } catch (error) {
        console.error('Failed to save correction:', error);
      }
    }
  };

  return {
    setTranscription,
    saveOriginalValue,
    getOriginalValue,
    handleBlur
  };
};
