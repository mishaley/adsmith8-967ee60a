
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Video, Download, Loader, RefreshCw } from "lucide-react";
import { useVideoCreator } from "../hooks/video/useVideoCreation";

const VideoCreator = () => {
  const {
    previewImages,
    videoUrl,
    mp4Url,
    isCreatingVideo,
    isConvertingToMp4,
    videoRef,
    fileInputRef,
    handleImageSelect,
    createVideo,
    convertToMp4,
    handleDownloadVideo,
    triggerFileInput
  } = useVideoCreator();

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
        Create a video slideshow from your selected images. Each image appears for 2 seconds.
        The video is created in WebM format, which works in most modern browsers.
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
      
      {videoUrl && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Generated Video</h4>
            <div className="flex gap-2">
              <Button
                onClick={() => handleDownloadVideo('webm')}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download WebM
              </Button>
              {!mp4Url ? (
                <Button
                  onClick={convertToMp4}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={isConvertingToMp4}
                >
                  {isConvertingToMp4 ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Convert to MP4
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => handleDownloadVideo('mp4')}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download MP4
                </Button>
              )}
            </div>
          </div>
          <div className="border rounded-md overflow-hidden bg-black">
            <video 
              ref={videoRef}
              src={mp4Url || videoUrl} 
              controls 
              className="w-full h-auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {mp4Url ? (
              "MP4 format is compatible with most media players including QuickTime. The MP4 conversion is done locally on your device using ffmpeg.wasm."
            ) : (
              "Note: The video is in WebM format which is supported by most modern browsers but may require a compatible media player like VLC for offline viewing. Convert to MP4 for wider compatibility."
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCreator;
