
import React, { useRef } from "react";
import { useAudioRecording } from "../hooks/useAudioRecording";
import RecordingButton from "./RecordingButton";
import { useTextareaResize } from "../hooks/useTextareaResize";
import { formatTime } from "../utils/timeUtils";

interface RecordingFieldProps {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RecordingField: React.FC<RecordingFieldProps> = ({
  label,
  helperText,
  value,
  onChange,
  placeholder
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isRecording,
    isTranscribing,
    timer: recordingTime,
    startRecording,
    stopRecording,
    transcription,
    isCorrecting
  } = useAudioRecording({
    onTranscriptionComplete: onChange
  });

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useTextareaResize(textareaRef, value, transcription || "");

  return (
    <tr className="border-b">
      <td className="py-4 pr-4 text-lg align-top pl-4">
        <div>{label}</div>
        {helperText && <div className="text-sm text-gray-500 mt-1">{helperText}</div>}
      </td>
      <td className="py-4">
        <div className="w-full max-w-3xl">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <RecordingButton
                isRecording={isRecording}
                onStart={startRecording}
                onStop={stopRecording}
              />
              {isRecording && (
                <div className="text-sm text-red-500">
                  Recording: {formatTime(recordingTime)}
                </div>
              )}
              {isTranscribing && (
                <div className="text-sm text-blue-500">Transcribing...</div>
              )}
              {isCorrecting && (
                <div className="text-sm text-blue-500">Improving transcription...</div>
              )}
            </div>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px] bg-white"
              placeholder={placeholder}
            />
            {transcription && !value && (
              <div className="text-sm text-gray-500 mt-1">
                Transcription: {transcription}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default RecordingField;
