
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAudioRecording } from "../hooks/useAudioRecording";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useTextareaResize } from "../hooks/useTextareaResize";
import { useTranscriptionCorrection } from "../hooks/useTranscriptionCorrection";
import { useToast } from "@/components/ui/use-toast";
import RecordingButton from "./RecordingButton";

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
  const [tempTranscript, setTempTranscript] = useState("");
  
  const { 
    setTranscription, 
    saveOriginalValue, 
    getOriginalValue, 
    handleBlur 
  } = useTranscriptionCorrection({ value });
  
  const { currentHeight } = useTextareaResize(textareaRef, value, tempTranscript);
  
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
      setTranscription(text);
      onChange(newValue);
      setTempTranscript("");
      saveOriginalValue(newValue);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });
  
  const { initializeSpeechRecognition, stopSpeechRecognition } = useSpeechRecognition({
    onTranscript: (interimTranscript) => {
      // Store the value before starting recording
      if (!tempTranscript && interimTranscript) {
        saveOriginalValue(value);
      }
      
      setTempTranscript(interimTranscript);
      
      // Append interim transcript to existing text instead of replacing it
      const previousValue = getOriginalValue();
      const newValue = previousValue.trim() && interimTranscript.trim() 
        ? `${previousValue.trim()} ${interimTranscript}`
        : previousValue.trim() || interimTranscript;
        
      onChange(newValue);
    }
  });
  
  const handleStartRecording = async () => {
    try {
      // Store the current value before recording starts
      saveOriginalValue(value);
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
            <RecordingButton
              isRecording={isRecording}
              isTranscribing={isTranscribing}
              timer={timer}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
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
