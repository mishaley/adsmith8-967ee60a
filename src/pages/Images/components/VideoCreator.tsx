
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Loader } from "lucide-react";
import { useVideoCreation } from "../hooks/video/useVideoCreation";

const VideoCreator = () => {
  const {
    previewImages,
    mp4Url,
    isCreatingVideo,
    videoRef,
    fileInputRef,
    handleImageSelect,
    createVideo,
    handleDownloadVideo,
    triggerFileInput
  } = useVideoCreation();

  return (
    <div className="w-1/2 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Image to video converter</h3>
        <div className="flex gap-2">
          <Button 
            onClick={triggerFileInput} 
            variant="outline" 
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Select Images
          </Button>
          <Input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageSelect} 
            className="hidden"
          />
          <Button 
            onClick={createVideo} 
            disabled={isCreatingVideo || previewImages.length === 0}
            className="gap-2"
          >
            {isCreatingVideo ? <Loader className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {isCreatingVideo ? "Creating..." : "Create Video"}
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Create a high-quality MP4 video slideshow from your selected images. Each image appears for 3 seconds with smooth transitions.
      </div>
      
      {previewImages.length > 0 && (
        <div className="mt-4 mb-4">
          <h4 className="text-sm font-medium mb-2">Selected Images ({previewImages.length})</h4>
          <div className="flex flex-wrap gap-2">
            {previewImages.map((src, index) => (
              <div key={index} className="h-16 w-16 relative">
                <img 
                  src={src} 
                  alt={`Selected image ${index + 1}`}
                  className="h-full w-full object-cover rounded-md border border-gray-200"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {mp4Url && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Generated MP4 Video</h4>
            <Button
              onClick={handleDownloadVideo}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Download MP4
            </Button>
          </div>
          <div className="border rounded-md overflow-hidden bg-black">
            <video 
              ref={videoRef}
              src={mp4Url} 
              controls 
              className="w-full h-auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The video is in MP4 format, optimized for compatibility with macOS Preview, QuickTime, and other major media players.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
