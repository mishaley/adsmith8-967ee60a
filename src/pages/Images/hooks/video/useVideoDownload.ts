
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface VideoDownloadProps {
  mp4Url: string | null;
  mp4BlobRef: React.RefObject<Blob | null>;
}

export const useVideoDownload = ({ mp4Url, mp4BlobRef }: VideoDownloadProps) => {
  const { toast } = useToast();
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const handleDownloadVideo = () => {
    if (!mp4Url || !mp4BlobRef.current) {
      toast({
        title: "Download Failed",
        description: "No video available to download. Please create a video first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a hidden download link if it doesn't exist
      if (!downloadLinkRef.current) {
        downloadLinkRef.current = document.createElement('a');
        downloadLinkRef.current.style.display = 'none';
        document.body.appendChild(downloadLinkRef.current);
      }

      // Get the current timestamp for the filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      
      // Create a proper download link with download attribute
      downloadLinkRef.current.href = mp4Url;
      downloadLinkRef.current.download = `image-slideshow-${timestamp}-high-quality.mp4`;
      
      // Programmatically click the link to trigger download
      downloadLinkRef.current.click();
      
      toast({
        title: "Download Started",
        description: "Your video is being downloaded.",
      });
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        title: "Download Failed",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  return {
    handleDownloadVideo
  };
};
