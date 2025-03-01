
import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAudioRecording } from "../hooks/useAudioRecording";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { supabase } from "@/integrations/supabase/client";

interface RecordingFieldProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RecordingField = ({ 
  label, 
  helperText, 
  value, 
  onChange,
  placeholder 
}: RecordingFieldProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const [originalTranscription, setOriginalTranscription] = useState("");
  const [transcriptionChanged, setTranscriptionChanged] = useState(false);
  const [currentHeight, setCurrentHeight] = useState<number | null>(null);
  const [previousValue, setPreviousValue] = useState("");
  
  const { 
    isRecording, 
    isTranscribing, 
    timer, 
    startRecording, 
    stopRecording 
  } = useAudioRecording({
    onTranscriptionComplete: (text) => {
      // Append new transcription to existing value instead of replacing it
      const newValue = value.trim() ? `${value.trim()} ${text}` : text;
      setOriginalTranscription(text);
      onChange(newValue);
      setTempTranscript("");
      setTranscriptionChanged(false);
      setPreviousValue(newValue);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const [tempTranscript, setTempTranscript] = useState("");
  
  const { initializeSpeechRecognition, stopSpeechRecognition } = useSpeechRecognition({
    onTranscript: (interimTranscript) => {
      // Store the value before starting recording
      if (!tempTranscript && interimTranscript) {
        setPreviousValue(value);
      }
      
      setTempTranscript(interimTranscript);
      
      // Append interim transcript to existing text instead of replacing it
      const newValue = previousValue.trim() && interimTranscript.trim() 
        ? `${previousValue.trim()} ${interimTranscript}`
        : previousValue.trim() || interimTranscript;
        
      onChange(newValue);
    }
  });
  
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
  }, [value, tempTranscript, currentHeight]);
  
  // Reset height when the field is cleared
  useEffect(() => {
    if (!value && !tempTranscript && currentHeight !== null) {
      setCurrentHeight(null);
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  }, [value, tempTranscript]);
  
  // Track when user manually edits the transcription
  useEffect(() => {
    if (originalTranscription && value !== originalTranscription && !isRecording && !isTranscribing) {
      setTranscriptionChanged(true);
    }
  }, [value, originalTranscription, isRecording, isTranscribing]);

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
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleStartRecording = async () => {
    try {
      // Store the current value before recording starts
      setPreviousValue(value);
      await startRecording();
      initializeSpeechRecognition();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to access microphone: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };
  
  const handleStopRecording = () => {
    stopRecording();
    stopSpeechRecognition();
  };
  
  return (
    <tr className="border-b">
      <td className="py-4 pr-4 text-lg whitespace-nowrap w-auto">
        <div>{label}</div>
        {helperText && <div className="text-sm text-gray-500 mt-1">{helperText}</div>}
      </td>
      <td className="py-4 w-full">
        <div className="w-96 flex flex-col">
          <div className="relative w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`text-sm text-gray-500 cursor-pointer w-full border border-input rounded-t-md rounded-b-none ${isRecording ? 'bg-red-50' : isTranscribing ? 'bg-yellow-50' : 'bg-white/80'}`}
              onMouseDown={handleStartRecording}
              onMouseUp={handleStopRecording}
              onMouseLeave={isRecording ? handleStopRecording : undefined}
              onTouchStart={handleStartRecording}
              onTouchEnd={handleStopRecording}
              disabled={isTranscribing}
            >
              <Mic size={18} className={`${isRecording ? 'text-red-500' : isTranscribing ? 'text-yellow-500' : 'text-blue-500'} mr-1`} />
              {isRecording 
                ? formatTime(timer)
                : isTranscribing 
                  ? 'Transcribing...' 
                  : 'Hold and Talk'}
            </Button>
          </div>
          <div className="w-full">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={handleBlur}
              className="min-h-[36px] w-full overflow-hidden resize-none rounded-t-none rounded-b-md text-left placeholder:text-center placeholder:italic"
              style={{ height: 'auto' }}
              rows={1}
              placeholder={placeholder}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default RecordingField;
