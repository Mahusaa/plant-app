"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type CropArea,
  formatFileSize,
  getCroppedAndCompressedImage,
} from "@/lib/image-utils";

interface ImageCropModalProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImage: string, size: number) => void;
}

export default function ImageCropModal({
  open,
  imageSrc,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropCompleteCallback = useCallback(
    (_croppedArea: CropArea, croppedAreaPixels: CropArea) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleCropAndCompress = async () => {
    if (!croppedAreaPixels) {
      setError("Please adjust the crop area");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { dataUrl, size } = await getCroppedAndCompressedImage(
        imageSrc,
        croppedAreaPixels,
      );

      // Check if still over 1MB (unlikely but possible)
      if (size > 1024 * 1024) {
        setError(
          `Image is still ${formatFileSize(size)}. Please crop a smaller area.`,
        );
        setIsProcessing(false);
        return;
      }

      onCropComplete(dataUrl, size);
      handleClose();
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Position and zoom to focus on the plant
          </p>
        </DialogHeader>

        <div className="flex-1 relative bg-gray-100 rounded-lg overflow-hidden min-h-0">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropCompleteCallback}
              style={{
                containerStyle: {
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#f3f4f6",
                },
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCropAndCompress}
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Crop & Continue"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
