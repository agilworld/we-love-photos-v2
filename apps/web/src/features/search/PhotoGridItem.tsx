"use client";

import { PhotoResult } from "@/_types/photos";
import { useState } from "react";
import type { ComponentPropsWithRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurHashImage } from "@/components/shared/BlurHashImage";
import { Maximize2 } from "lucide-react";

type PhotoGridItemProps = {
  item: Partial<PhotoResult>;
  isFetching: boolean;
  isLast: boolean;
} & ComponentPropsWithRef<"div">;

export default function PhotoGridItem({
  item,
  isFetching,
  isLast,
  ...rest
}: PhotoGridItemProps) {
  const src = item.src?.medium ?? item.src?.small ?? "";

  return (
    <div key={item.id} className="cursor-pointer" {...rest}>
      <BlurHashImage
        src={src}
        alt={item.title ?? item.description ?? "photo"}
        width={item.width || 400}
        height={item.height || 300}
        blurHash={item.blurHash}
        color={item.color}
        className="shadow-lg hover:scale-105 duration-200 delay-75 ease-in-out"
      />
      {isLast && isFetching && (
        <Skeleton className="w-full mt-10 h-[250px] rounded-lg" />
      )}
    </div>
  );
}

type PhotoDrawerProps = {
  item: PhotoResult;
  onMaximize: () => void;
  onCloseDrawer: () => void;
};

export const PhotoDetailDrawer = ({
  item,
  onMaximize,
  onCloseDrawer,
}: PhotoDrawerProps) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleClose = () => {
    setOpen(false);

    setTimeout(() => {
      onCloseDrawer();
    }, 500);
  };

  const downloadPhoto = () => {
    if (item.src?.full) {
      const url = item.src?.full as string;
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
          element.setAttribute("download", `welovephoto-${item.url}.jpg`);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          URL.revokeObjectURL(urlRes);

          track("Download Image", {
            id: item.id,
            url: item.src?.full ?? null,
          });
        })
        .catch((error) => {
          console.error("Error downloading the image:", error);
        });
    }
  };

  const initialName = () => {
    let f = "U",
      l = "n";
    if (item.user?.name) {
      f = item.user.name?.charAt(0) ?? "U";
      l = item.user.name?.charAt(1) ?? "n";
    }
    return `${f}${l}`;
  };

  const desc = () => {
    return (
      (item.title?.slice(0, 100) ?? "") +
      (item.title && item.title.length >= 100 ? "..." : "")
    );
  };

  const altDesc = () => {
    return (
      (item.description?.slice(0, 100) ?? "") +
      (item.description && item.description.length >= 100 ? "..." : "")
    );
  };

  const largeSrc = item.src?.large ?? "";

  return (
    <Drawer open={open} onClose={handleClose} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl md:py-6">
          <button
            onClick={onMaximize}
            className="p-2 hover:bg-white/10 rounded-lg absolute right-3 top-3"
            aria-label="Exit fullscreen"
          >
            <Maximize2 size={24} />
          </button>
          <div className="flex flex-col md:flex-row justify-center">
            <div className="w-full md:w-4/6">
              {largeSrc && (
                <BlurHashImage
                  src={largeSrc}
                  alt={item.description}
                  width={item.width}
                  height={item.height}
                  blurHash={item.blurHash}
                  color={item.color}
                  className="max-h-[80vh]"
                />
              )}
            </div>
            <div className="w-full md:w-2/6">
              <DrawerHeader
                className="text-left 
                pt-6 pr-8 pl-8 md:pt-0 md:pl-10 md:pr-2"
              >
                <DrawerTitle className="leading-tight">{desc()}</DrawerTitle>
                <DrawerDescription className="leading-none text-md">
                  {altDesc()}
                </DrawerDescription>
                <div className="flex items-center my-4 md:my-6">
                  {item.user.avatar_url && (
                    <Avatar className="mr-3">
                      <AvatarImage src={item.user.avatar_url} />
                      <AvatarFallback>{initialName()}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="text-xs">
                    <h4 className="font-regular">
                      Photo by{" "}
                      <span className="underline">{item.user.name}</span> on{" "}
                      <span>{item.from}</span>{" "}
                    </h4>
                    <div>
                      {item.user.portfolio_url && (
                        <a
                          className="text-blue-600 visited:text-purple-600"
                          href={item.user.portfolio_url}
                          target="_blank"
                        >
                          View Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter className="mt-2 md:mt-10 pt-2">
                <a
                  href={`/removebg?src=${item.src?.large}&w=${item.width}&h=${item.height}`}
                  target="_blank"
                  className="bg-blue-900 text-white text-center shadow-lg hover:bg-blue-800 py-2 px-4 rounded-md"
                >
                  Remove Background
                </a>
                <Button onClick={downloadPhoto}>Download</Button>
                <Button onClick={handleClose} variant="outline">
                  Close
                </Button>
              </DrawerFooter>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
