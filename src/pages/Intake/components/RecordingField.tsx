
import React, { useState, useRef, useEffect, forwardRef } from "react";
import RecordingButton from "./RecordingButton";
import { useAudioRecording } from "../hooks/useAudioRecording";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useTextareaResize } from "../hooks/useTextareaResize";
import { toast } from "@/components/ui/use-toast";

interface RecordingFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  autoFocus?: boolean;
}

const RecordingField = forwardRef<HTMLTextAreaElement, RecordingFieldProps>(({ 
  label, 
  value, 
  onChange,
  placeholder = "Hold to record",
  disabled = false,
  helperText,
  autoFocus = false
}, ref) => {
  // Track the temporary transcript as recording happens
  const [tempTranscript, setTempTranscript] = useState("");
  
  // Prevent textarea from controlling value during prop updates
  const [localValue, setLocalValue] = useState(value);
  
  // Create internal ref if none is provided
  const internalTextareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalTextareaRef;
  
  // Sync local value with prop value when it changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Handle audio recording with error handling
  const { 
    isRecording,
    isTranscribing,
    timer,
    startRecording,
    stopRecording
  } = useAudioRecording({
    onTranscriptionComplete: (text) => {
      // Append the transcribed text to the existing content rather than replacing it
      const updatedText = localValue ? `${localValue} ${text}` : text;
      onChange(updatedText);
      setTempTranscript("");
    },
    onError: (error) => {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description: "There was a problem transcribing your audio. Please try again.",
        variant: "destructive"
      });
      setTempTranscript("");
    }
  });
  
  // Textarea auto-resizing
  useTextareaResize(textareaRef, localValue, tempTranscript);

  // Handle transcription updates during recording
  const handleTranscriptUpdate = (transcript: string) => {
    setTempTranscript(transcript);
  };
  
  // Speech recognition for live feedback during recording
  const { 
    initializeSpeechRecognition,
    stopSpeechRecognition
  } = useSpeechRecognition({
    onTranscript: handleTranscriptUpdate
  });
  
  // Handle recording start/stop
  const handleStartRecording = () => {
    if (disabled) return;
    setTempTranscript("");
    initializeSpeechRecognition();
    startRecording();
  };
  
  const handleStopRecording = () => {
    if (!isRecording) return;
    stopSpeechRecognition();
    stopRecording();
  };
  
  // Handle text input changes
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Auto-focus effect
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Display value should be the temporary transcript if available, otherwise the local value
  // When recording, show both the existing text and the temporary transcript
  const displayValue = isRecording && tempTranscript 
    ? `${localValue} ${tempTranscript}` 
    : localValue;

  return (
    <tr className="border-transparent">
      <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
        <div>{label}</div>
        {helperText && (
          <div className="text-sm text-gray-500 mt-1">{helperText}</div>
        )}
      </td>
      <td className="py-4">
        <div className="w-96 flex items-start">
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={handleTextChange}
            className={`flex-1 px-3 py-2 border border-r-0 border-input rounded-l-md focus:outline-none focus:ring focus:border-indigo-500 ${disabled ? 'bg-gray-100' : ''}`}
            placeholder={placeholder}
            rows={1}
            style={{ resize: "none" }}
            disabled={disabled}
          />
          
          <RecordingButton
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            timer={timer}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </div>
      </td>
    </tr>
  );
});

RecordingField.displayName = "RecordingField";

export default RecordingField;
