import imageCompression from "browser-image-compression";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an image element from a source URL
 */
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Extracts the cropped area from an image and returns it as a Blob
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: CropArea,
): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  // Set canvas size to the crop area
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Return as blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/jpeg");
  });
}

/**
 * Compresses an image to ensure it's under 1MB
 */
export async function compressImage(
  file: File | Blob,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
  },
): Promise<File> {
  const defaultOptions = {
    maxSizeMB: 0.95, // Target slightly under 1MB to be safe
    maxWidthOrHeight: 1024, // Good resolution for AI
    quality: 0.85, // High quality JPEG
    useWebWorker: true,
  };

  const compressionOptions = { ...defaultOptions, ...options };

  try {
    // Convert Blob to File if needed
    const fileToCompress =
      file instanceof File
        ? file
        : new File([file], "image.jpg", { type: "image/jpeg" });

    const compressedFile = await imageCompression(
      fileToCompress,
      compressionOptions,
    );
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw new Error("Failed to compress image");
  }
}

/**
 * Crops and compresses an image in one operation
 * Returns a data URL ready to send to the API
 */
export async function getCroppedAndCompressedImage(
  imageSrc: string,
  pixelCrop: CropArea,
): Promise<{ dataUrl: string; size: number }> {
  // Step 1: Crop the image
  const croppedBlob = await getCroppedImg(imageSrc, pixelCrop);

  // Step 2: Compress the cropped image
  const compressedFile = await compressImage(croppedBlob);

  // Step 3: Convert to data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(compressedFile);
  });

  return {
    dataUrl,
    size: compressedFile.size,
  };
}

/**
 * Formats file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Reads a file and returns a data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
