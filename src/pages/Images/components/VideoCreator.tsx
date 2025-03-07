
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Video, Download, Loader, Clock } from "lucide-react";
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
  
  // These useState and useEffect hooks need to be in a consistent order
  const [actualDuration, setActualDuration] = useState<number | null>(null);
  const [creationProgress, setCreationProgress] = useState("");
  
  // Show progress messages while creating video
  useEffect(() => {
    if (isCreatingVideo) {
      const messages = [
        "Loading images...",
        "Processing image 1...",
        "Creating video segments...",
        "Combining segments...",
        "Finalizing video...",
        "Almost there..."
      ];
      
      let index = 0;
      const progressInterval = setInterval(() => {
        setCreationProgress(messages[index % messages.length]);
        index++;
      }, 1500);
      
      return () => {
        clearInterval(progressInterval);
        setCreationProgress("");
      };
    }
  }, [isCreatingVideo]);

  // Calculate expected duration based on number of images
  const calculateDuration = () => {
    if (previewImages.length === 0) return "0:00";
    const exactSeconds = previewImages.length * 2;
    const minutes = Math.floor(exactSeconds / 60);
    const remainingSeconds = exactSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate expected duration in seconds
  const expectedDurationSeconds = previewImages.length * 2;

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
            Expected duration: {calculateDuration()} (precisely {expectedDurationSeconds} seconds)
          </span>
        )}
      </div>
      
      {isCreatingVideo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-600">
          <div className="flex items-center gap-2">
            <Loader className="h-4 w-4 animate-spin" />
            <span>{creationProgress}</span>
          </div>
          <p className="text-xs mt-1">Please wait while your video is being created. Each image will be displayed for exactly 2 seconds.</p>
        </div>
      )}
      
      {previewImages.length > 0 && (
        <div className="mt-4 mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
            <span>Selected Images ({previewImages.length})</span>
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 inline ml-1" /> 
              Each shown for 2 seconds
            </span>
          </h4>
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
                const duration = e.currentTarget.duration;
                setActualDuration(duration);
                console.log(`Video duration: ${duration.toFixed(4)} seconds`);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="text-xs text-gray-500 mt-2 space-y-1">
            <p>
              Video contains {previewImages.length} images, each displayed for precisely 2 seconds.
            </p>
            {actualDuration && (
              <p className="font-medium">
                Actual duration: {Math.floor(actualDuration / 60)}:{Math.floor(actualDuration % 60).toString().padStart(2, '0')} 
                ({actualDuration.toFixed(2)} seconds)
              </p>
            )}
            <p>
              Expected duration: {calculateDuration()} (exactly {expectedDurationSeconds} seconds).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
