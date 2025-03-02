
import React, { useRef, useState } from "react";
import { useAudioRecording } from "../hooks/useAudioRecording";
import RecordingButton from "./RecordingButton";
import { useTextareaResize } from "../hooks/useTextareaResize";
import { formatTime } from "../utils/timeUtils";

interface RecordingFieldProps {
  label: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
}

const RecordingField: React.FC<RecordingFieldProps> = ({
  label,
  value,
  setValue,
  placeholder = ""
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tempTranscript, setTempTranscript] = useState("");
  
  const handleTranscriptionComplete = (transcription: string) => {
    setValue(transcription);
    setTempTranscript("");
  };
  
  const handleError = (error: Error) => {
    console.error("Recording error:", error);
  };
  
  const {
    isRecording,
    isTranscribing,
    timer,
    startRecording,
    stopRecording
  } = useAudioRecording({
    onTranscriptionComplete: handleTranscriptionComplete,
    onError: handleError
  });

  useTextareaResize(textareaRef, value, tempTranscript);

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <label className="block text-gray-700 font-medium">{label}</label>
        <RecordingButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={stopRecording}
        />
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={isTranscribing ? tempTranscript || "Processing recording..." : value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isRecording || isTranscribing}
          placeholder={placeholder}
          className="w-full p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none disabled:bg-gray-50"
        />

        {isRecording && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
            {formatTime(timer)}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingField;
