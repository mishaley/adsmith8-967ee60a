
import { useRef } from "react";

interface SpeechRecognitionHookProps {
  onTranscript: (transcript: string) => void;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = ({ onTranscript }: SpeechRecognitionHookProps) => {
  const recognitionRef = useRef<any>(null);

  const initializeSpeechRecognition = () => {
    if (typeof SpeechRecognitionAPI !== 'undefined') {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              interimTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (interimTranscript) {
            onTranscript(interimTranscript);
          }
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
        
        recognition.start();
      } catch (e) {
        console.error('Speech recognition not supported:', e);
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      recognitionRef.current = null;
    }
  };

  return {
    initializeSpeechRecognition,
    stopSpeechRecognition
  };
};
