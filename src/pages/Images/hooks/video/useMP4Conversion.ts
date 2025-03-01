
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const useMP4Conversion = () => {
  const { toast } = useToast();
  const [mp4Url, setMp4Url] = useState<string | null>(null);
  const [isConvertingToMp4, setIsConvertingToMp4] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);

  const loadFFmpeg = async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      throw new Error('Failed to load FFmpeg');
    }
  };

  const convertToMp4 = async (webmBlob: Blob | null) => {
    if (!webmBlob) {
      toast({
        title: "No WebM Video",
        description: "Please create a video first before converting to MP4.",
        variant: "destructive",
      });
      return null;
    }

    setIsConvertingToMp4(true);
    toast({
      title: "Converting to MP4",
      description: "This may take a moment...",
    });

    try {
      const ffmpeg = await loadFFmpeg();
      
      await ffmpeg.writeFile('input.webm', await fetchFile(webmBlob));
      
      await ffmpeg.exec([
        '-i', 'input.webm',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '22',
        '-pix_fmt', 'yuv420p',
        'output.mp4'
      ]);
      
      const data = await ffmpeg.readFile('output.mp4');
      const mp4Blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(mp4Blob);
      setMp4Url(url);
      
      toast({
        title: "MP4 Conversion Complete",
        description: `MP4 video created successfully (${(mp4Blob.size / 1024 / 1024).toFixed(2)} MB)`,
      });

      return url;
    } catch (error) {
      console.error('Error converting to MP4:', error);
      toast({
        title: "MP4 Conversion Failed",
        description: `Error: ${error.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConvertingToMp4(false);
    }
  };

  return {
    mp4Url,
    setMp4Url,
    isConvertingToMp4,
    convertToMp4
  };
};
