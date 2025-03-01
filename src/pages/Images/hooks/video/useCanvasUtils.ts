
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
 * Create and configure a canvas element
 */
export const setupCanvas = (): {canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D} => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }
  
  // Set default canvas dimensions to max allowed
  const maxWidth = 1920; // Max width for good quality
  const maxHeight = 1080; // Max height for good quality
  
  canvas.width = maxWidth;
  canvas.height = maxHeight;
  
  console.log(`Video dimensions: ${canvas.width}x${canvas.height}`);
  
  return { canvas, ctx };
};
