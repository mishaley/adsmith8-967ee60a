
import { useRef } from "react";

interface SpeechRecognitionHookProps {
  onTranscript: (transcript: string) => void;
}

const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = ({ onTranscript }: SpeechRecognitionHookProps) => {
  const recognitionRef = useRef<any>(null);
  const interimTranscriptRef = useRef<string>('');

  const initializeSpeechRecognition = () => {
    if (typeof SpeechRecognitionAPI !== 'undefined') {
      try {
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        // Reset interim transcript at the start
        interimTranscriptRef.current = '';
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              interimTranscriptRef.current += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          // Combine permanent and interim transcripts
          const combinedTranscript = (interimTranscriptRef.current + interimTranscript).trim();
          
          if (combinedTranscript) {
            onTranscript(combinedTranscript);
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
      interimTranscriptRef.current = '';
    }
  };

  return {
    initializeSpeechRecognition,
    stopSpeechRecognition
  };
};
