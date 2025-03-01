
import { useToast } from "@/hooks/use-toast";

interface VideoDownloadOptions {
  mp4Url: string | null;
  mp4BlobRef: React.MutableRefObject<Blob | null>;
}

export const useVideoDownload = ({ mp4Url, mp4BlobRef }: VideoDownloadOptions) => {
  const { toast } = useToast();

  const handleDownloadVideo = () => {
    if (!mp4Url) return;
    
    const a = document.createElement('a');
    a.href = mp4Url;
    
    // Use timestamp in filename to prevent conflicts
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // Add quality info to filename
    const codecInfo = 'high-quality';
    a.download = `image-slideshow-${timestamp}-${codecInfo}.mp4`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Video Downloaded",
      description: `Your MP4 video has been downloaded successfully!`,
    });
  };

  return {
    handleDownloadVideo
  };
};
