
/**
 * Utility for configuring and setting up MediaRecorder
 */

export interface RecorderOptions {
  stream: MediaStream;
  onDataAvailable: (e: BlobEvent) => void;
}

export const createMediaRecorder = ({ stream, onDataAvailable }: RecorderOptions): MediaRecorder => {
  // Try different MIME types in order of preference
  const videoOptions = [
    { mimeType: 'video/mp4; codecs=avc1.42E01E', bitrate: 8000000 },
    { mimeType: 'video/webm; codecs=vp9', bitrate: 8000000 },
    { mimeType: 'video/webm', bitrate: 8000000 }
  ];
  
  let mediaRecorder: MediaRecorder | null = null;
  let selectedMimeType = '';
  
  // Find the first supported MIME type
  for (const option of videoOptions) {
    if (MediaRecorder.isTypeSupported(option.mimeType)) {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: option.mimeType,
        videoBitsPerSecond: option.bitrate
      });
      selectedMimeType = option.mimeType;
      console.log(`Using MIME type: ${option.mimeType} with bitrate: ${option.bitrate / 1000000}Mbps`);
      break;
    }
  }
  
  if (!mediaRecorder) {
    // Fallback to browser default
    mediaRecorder = new MediaRecorder(stream, { 
      videoBitsPerSecond: 8000000 // Try to set a high bitrate even with default encoder
    });
    console.log('Using browser default MediaRecorder options with 8Mbps bitrate');
  }
  
  mediaRecorder.ondataavailable = onDataAvailable;
  
  return mediaRecorder;
};

/**
 * Gets the MIME type based on the mediaRecorder configuration
 */
export const getMimeType = (mediaRecorder: MediaRecorder): string => {
  const mimeType = mediaRecorder.mimeType;
  return mimeType ? mimeType.split(';')[0] : 'video/mp4';
};
