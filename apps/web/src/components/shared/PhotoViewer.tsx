"use client";

import { useState, useEffect, useCallback } from "react";
import { PhotoResult } from "@/_types/photos";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BlurHashImage } from "@/components/shared/BlurHashImage";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Minimize2,
  Download,
  ExternalLink,
} from "lucide-react";
import { PhotoDetailDrawer } from "@/features/search/PhotoGridItem";

type PhotoViewerProps = {
  photos: PhotoResult[];
  initialIndex: number;
  onClose: () => void;
};

export function PhotoViewer({
  photos,
  initialIndex,
  onClose,
}: PhotoViewerProps) {
  const [index, setIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const currentPhoto = photos[index];

  console.log("currentphoto", currentPhoto);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, photos.length - 1));
  }, [photos.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleThumbnailClick = (idx: number) => {
    setIndex(idx);
  };

  const handleDownload = () => {
    if (currentPhoto.src?.full) {
      const url = currentPhoto.src.full as string;
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.blob();
        })
        .then((response) => {
          const element = document.createElement("a");
          const urlRes = URL.createObjectURL(response);
          element.href = urlRes;
          element.setAttribute(
            "download",
            `welovephoto-${currentPhoto.url}.jpg`,
          );
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          URL.revokeObjectURL(urlRes);

          track("Download Image", {
            id: currentPhoto.id,
            url: currentPhoto.src?.full ?? null,
          });
        })
        .catch((error) => {
          console.error("Error downloading the image:", error);
        });
    }
  };

  const handleOpenSource = () => {
    if (currentPhoto.src?.full) {
      window.open(currentPhoto.src.full, "_blank");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        setIsFullscreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, next, prev, onClose]);

  if (!currentPhoto) {
    return null;
  }

  const initialName = () => {
    let f = "U",
      l = "n";
    if (currentPhoto.user?.name) {
      f = currentPhoto.user.name?.charAt(0) ?? "U";
      l = currentPhoto.user.name?.charAt(1) ?? "n";
    }
    return `${f}${l}`;
  };

  const desc = () => {
    return (
      (currentPhoto.title?.slice(0, 100) ?? "") +
      (currentPhoto.title && currentPhoto.title.length >= 100 ? "..." : "")
    );
  };

  const altDesc = () => {
    return (
      (currentPhoto.description?.slice(0, 100) ?? "") +
      (currentPhoto.description && currentPhoto.description.length >= 100
        ? "..."
        : "")
    );
  };

  const largeSrc = currentPhoto.src?.large ?? "";

  return (
    <>
      {isFullscreen ? (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
          <header className="flex items-center justify-between p-4 text-white">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X size={24} />
            </button>
            <span className="text-sm font-medium">
              {index + 1} / {photos.length}
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
              aria-label="Exit fullscreen"
            >
              <Minimize2 size={24} />
            </button>
          </header>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            <button
              onClick={prev}
              disabled={index === 0}
              className="absolute left-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Previous photo"
            >
              <ChevronLeft size={32} />
            </button>

            <div className="w-[90vw] h-[80vh] justify-center items-center">
              {largeSrc && (
                <BlurHashImage
                  src={largeSrc}
                  alt={currentPhoto.description}
                  width={currentPhoto.width}
                  height={currentPhoto.height}
                  blurHash={currentPhoto.blurHash}
                  color={currentPhoto.color}
                  className="max-w-full max-h-full object-contain"
                />
              )}
            </div>

            <button
              onClick={next}
              disabled={index === photos.length - 1}
              className="absolute right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Next photo"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          <div className="p-4 text-white">
            <h3 className="text-lg font-medium mb-1">{desc()}</h3>
            <p className="text-sm text-gray-300 mb-4">{altDesc()}</p>

            <div className="flex items-center gap-2 mb-4">
              {currentPhoto.user.avatar_url && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentPhoto.user.avatar_url} />
                  <AvatarFallback>{initialName()}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-sm">
                Photo by{" "}
                <span className="underline">{currentPhoto.user.name}</span> on{" "}
                <span>{currentPhoto.from}</span>
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                size="sm"
                variant="secondary"
                className="text-white bg-white/10 hover:bg-white/20"
              >
                <Download size={16} className="mr-2" />
                Download
              </Button>
              <Button
                onClick={handleOpenSource}
                size="sm"
                variant="secondary"
                className="text-white bg-white/10 hover:bg-white/20"
              >
                <ExternalLink size={16} className="mr-2" />
                Open Source
              </Button>
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="flex gap-2 justify-center">
              {photos.map((photo, idx) => (
                <button
                  key={photo.id}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    idx === index ? "border-white" : "border-transparent"
                  }`}
                >
                  <BlurHashImage
                    src={photo.src?.small ?? photo.src?.thumb ?? ""}
                    alt={photo.title ?? photo.description ?? "thumbnail"}
                    width={photo.width || 64}
                    height={photo.height || 64}
                    blurHash={photo.blurHash}
                    color={photo.color}
                    className="w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <PhotoDetailDrawer
          item={currentPhoto}
          onMaximize={() => setIsFullscreen(true)}
          onCloseDrawer={onClose}
        />
      )}
    </>
  );
}
