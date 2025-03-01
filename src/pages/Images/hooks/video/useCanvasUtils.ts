
// Canvas utility functions for video rendering

/**
 * Draws an image centered on canvas with black background
 */
export const drawImageCentered = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  img: HTMLImageElement
) => {
  // Fill with black background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Calculate scaling to maintain aspect ratio
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let drawWidth, drawHeight, x, y;
  
  if (imgRatio > canvas.width / canvas.height) {
    // Image is wider than canvas ratio
    drawWidth = canvas.width;
    drawHeight = canvas.width / imgRatio;
    x = 0;
    y = (canvas.height - drawHeight) / 2;
  } else {
    // Image is taller than canvas ratio
    drawHeight = canvas.height;
    drawWidth = canvas.height * imgRatio;
    x = (canvas.width - drawWidth) / 2;
    y = 0;
  }
  
  ctx.drawImage(img, x, y, drawWidth, drawHeight);
};

/**
 * Load all images from URLs and return as HTMLImageElements
 */
export const loadImages = async (imageSources: string[]): Promise<HTMLImageElement[]> => {
  console.log(`Starting to load ${imageSources.length} images`);
  
  return Promise.all(
    imageSources.map(src => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
        img.src = src;
      });
    })
  );
};

/**
 * Determine the optimal canvas dimensions based on loaded images
 */
export const determineCanvasDimensions = (images: HTMLImageElement[]): { width: number, height: number } => {
  if (images.length === 0) {
    throw new Error("Cannot determine dimensions with no images");
  }
  
  // Use first image's aspect ratio to determine video dimensions
  const firstImage = images[0];
  const aspectRatio = firstImage.naturalWidth / firstImage.naturalHeight;
  
  // Set a max resolution but maintain the aspect ratio of the input images
  const maxPixels = 1920 * 1080; // Same total pixels as 1080p
  
  let width, height;
  if (aspectRatio >= 1) {
    // Landscape or square orientation
    width = Math.min(1920, Math.sqrt(maxPixels * aspectRatio));
    height = width / aspectRatio;
  } else {
    // Portrait orientation
    height = Math.min(1920, Math.sqrt(maxPixels / aspectRatio));
    width = height * aspectRatio;
  }
  
  // Ensure dimensions are even (required by some codecs)
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;
  
  console.log(`Determined canvas dimensions: ${width}x${height} with aspect ratio ${aspectRatio.toFixed(3)}`);
  
  return { width, height };
};

/**
 * Create and configure a canvas element with dimensions based on input images
 */
export const setupCanvas = (images?: HTMLImageElement[]): {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }
  
  if (images && images.length > 0) {
    // Set canvas dimensions based on input images
    const { width, height } = determineCanvasDimensions(images);
    canvas.width = width;
    canvas.height = height;
  } else {
    // Fallback to 16:9 if no images are provided (should not happen)
    canvas.width = 1920;
    canvas.height = 1080;
  }
  
  console.log(`Video dimensions: ${canvas.width}x${canvas.height}`);
  
  return { canvas, ctx };
};
