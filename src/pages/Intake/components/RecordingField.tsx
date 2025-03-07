
import React, { useState, useRef, useEffect } from "react";
import RecordingButton from "./RecordingButton";
import { useAudioRecording } from "../hooks/useAudioRecording";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useTextareaResize } from "../hooks/useTextareaResize";

interface RecordingFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const RecordingField: React.FC<RecordingFieldProps> = ({ 
  label, 
  value, 
  onChange,
  placeholder = "Hold to record",
  disabled = false
}) => {
  // Get all recording functionality
  const { 
    isRecording,
    startRecording,
    stopRecording,
    timer,
    audioBlob
  } = useAudioRecording();
  
  // Speech recognition functionality
  const {
    isTranscribing,
    transcription,
    startTranscription,
    resetTranscription
  } = useSpeechRecognition();
  
  // Textarea auto-resizing
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useTextareaResize(textareaRef, value);
  
  // Handle recording start/stop
  const handleStartRecording = () => {
    if (disabled) return;
    startRecording();
  };
  
  const handleStopRecording = async () => {
    if (!isRecording) return;
    const blob = await stopRecording();
    if (blob) {
      startTranscription(blob);
    }
  };
  
  // When transcription is complete, update the value
  useEffect(() => {
    if (transcription && !isTranscribing) {
      onChange(transcription);
      resetTranscription();
    }
  }, [transcription, isTranscribing, onChange, resetTranscription]);

  return (
    <tr className="border-transparent">
      <td className="py-4 pr-4 text-lg whitespace-nowrap min-w-[180px]">
        <div>{label}</div>
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
            value={value}
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
