
import React, { useState, useRef, useEffect } from "react";
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
  helperText?: string; // Added helperText as an optional prop
}

const RecordingField: React.FC<RecordingFieldProps> = ({ 
  label, 
  value, 
  onChange,
  placeholder = "Hold to record",
  disabled = false,
  helperText
}) => {
  // State to temporarily show transcription as it's being processed
  const [tempTranscript, setTempTranscript] = useState("");
  
  // Handle audio recording with error handling
  const { 
    isRecording,
    isTranscribing,
    timer,
    startRecording,
    stopRecording
  } = useAudioRecording({
    onTranscriptionComplete: (text) => {
      onChange(text);
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useTextareaResize(textareaRef, value, tempTranscript);

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

  // Combined value for display (actual value or temporary transcription)
  const displayValue = tempTranscript || value;

  return (
    <tr className="border-transparent">
      <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
        <div>{label}</div>
        {helperText && (
          <div className="text-sm text-gray-500 mt-1">{helperText}</div>
        )}
      </td>
      <td className="py-4">
        <div className="w-96 flex flex-col">
          <RecordingButton
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            timer={timer}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
          
          <textarea
            ref={textareaRef}
            value={displayValue}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-input rounded-b-md focus:outline-none focus:ring focus:border-indigo-500 ${disabled ? 'bg-gray-100' : ''}`}
            placeholder={placeholder}
            rows={1}
            style={{ resize: "none" }}
            disabled={disabled}
          />
        </div>
      </td>
    </tr>
  );
};

export default RecordingField;
