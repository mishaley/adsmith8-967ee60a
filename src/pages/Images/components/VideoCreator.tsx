
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Loader } from "lucide-react";
import { useVideoCreation } from "../hooks/video/useVideoCreation";
import { useState, useEffect } from "react";

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
  
  const [creationProgress, setCreationProgress] = useState("");
  
  useEffect(() => {
    if (isCreatingVideo) {
      const messages = [
        "Loading images...",
        "Setting up canvas...",
        "Recording frames...",
        "Processing video...",
        "Almost there..."
      ];
      
      let index = 0;
      const progressInterval = setInterval(() => {
        setCreationProgress(messages[index % messages.length]);
        index++;
      }, 2000);
      
      return () => {
        clearInterval(progressInterval);
        setCreationProgress("");
      };
    }
  }, [isCreatingVideo]);

  const calculateDuration = () => {
    if (previewImages.length === 0) return "0:00";
    const exactSeconds = previewImages.length * 2;
    const minutes = Math.floor(exactSeconds / 60);
    const remainingSeconds = exactSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAspectRatioInfo = () => {
    if (previewImages.length === 0) return null;
    const img = new Image();
    img.src = previewImages[0];
    return `with the original aspect ratio of your images`;
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
            disabled={isCreatingVideo}
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
            className="gap-2 min-w-[130px]"
          >
            {isCreatingVideo ? <Loader className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {isCreatingVideo ? "Creating..." : "Create Video"}
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Create an MP4 slideshow from your selected images. Each image appears for exactly 2 seconds.
        {previewImages.length > 0 && (
          <span className="ml-1 font-medium">
            Expected duration: {calculateDuration()} (precisely {previewImages.length * 2} seconds)
          </span>
        )}
      </div>
      
      {isCreatingVideo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-600">
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>{creationProgress}</span>
          </div>
          <p className="text-xs mt-1">Please wait while your video is being created. This may take a moment.</p>
        </div>
      )}
      
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
            The video is in high-quality MP4 format with {previewImages.length} images, each displayed for precisely 2 seconds.
            Total duration: {calculateDuration()} (exactly {previewImages.length * 2} seconds).
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
