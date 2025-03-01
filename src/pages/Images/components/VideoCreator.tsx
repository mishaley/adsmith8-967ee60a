
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

  // Calculate expected video duration
  const calculateDuration = () => {
    if (previewImages.length === 0) return "0:00";
    const seconds = previewImages.length * 2; // 2 seconds per image
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full md:w-1/2 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
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
        Create an MP4 slideshow from your selected images. Each image appears for 2 seconds.
        {previewImages.length > 0 && (
          <span className="ml-1 font-medium">
            Expected duration: {calculateDuration()}
          </span>
        )}
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
                <div className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-bl-md px-1 text-xs">
                  {index + 1}
                </div>
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
              onLoadedMetadata={(e) => {
                console.log(`Video duration: ${e.currentTarget.duration} seconds`);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            The video is in high-quality 1080p MP4 format with {previewImages.length} images, each displayed for 2 seconds.
            Expected duration: {calculateDuration()}.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
