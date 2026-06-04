"use client";

import { useState } from "react";
import NextImage, { ImageLoaderProps } from "next/image";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

type EditPhotoDrawerProps = {
  image: string;
  height: number;
  width: number;
  defaultBgcolor: string;
  onCloseDrawer: () => void;
  onSave: (file: string, color: string) => void;
};

const imageLoader = ({ src }: ImageLoaderProps) => {
  return src;
};
const predefinedColors = [
  "#ffffff",
  "#000000",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff8000",
];

export default function EditPhotoDrawer({
  image,
  height,
  width,
  defaultBgcolor,
  onCloseDrawer,
  onSave,
}: EditPhotoDrawerProps) {
  const [open, setOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);
  const [bgcolor, setBgcolor] = useState<string>(defaultBgcolor ?? "#ffffff");

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIsLoading(false);
      onCloseDrawer();
    }, 200);
  };

  const handleApplyChanges = async () => {
    setIsLoading(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.fillStyle = bgcolor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw the processed image
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl, bgcolor);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer open={open} onClose={handleClose} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl md:py-6">
          <div className="flex flex-col md:flex-row justify-center">
            <div className="w-full md:w-4/6">
              {image && (
                <NextImage
                  src={image}
                  alt={"background removal"}
                  loader={imageLoader}
                  style={{
                    objectFit: "contain",
                    resize: "horizontal",
                    backgroundColor: bgcolor,
                  }}
                  width={width}
                  height={height}
                  loading="lazy"
                  className={`max-h-[80vh]`}
                />
              )}
            </div>
            <div className="w-full md:w-2/6">
              <DrawerHeader
                className="text-left 
                  pt-6 pr-8 pl-8 md:pt-0 md:pl-10 md:pr-2"
              >
                <DrawerTitle className="leading-tight">Edit Photo</DrawerTitle>
                <DrawerDescription className="leading-none text-md">
                  Predefined Color
                </DrawerDescription>
                <div className="flex flex-col my-4 md:my-6">
                  <div className="flex flex-wrap">
                    {predefinedColors.map((color) => (
                      <Button
                        key={color}
                        className="
                        mr-2 mb-2 outline rounded-sm 
                        px-4 py-4 h-8 border-solid border-2 border-gray-200"
                        onClick={() => setBgcolor(color)}
                        style={{
                          backgroundColor: color,
                          outlineOffset: color === bgcolor ? "1px" : undefined,
                          outlineColor: color === bgcolor ? "black" : undefined,
                          outlineWidth: color === bgcolor ? "2px" : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <div>
                    <DrawerDescription className="leading-none text-md">
                      Custom Color
                    </DrawerDescription>
                    <Input
                      className="
                        w-24 h-10 p-0 rounded-md border-solid border-2 border-gray-200"
                      type="color"
                      defaultValue={"#C48CFF"}
                      onChange={(e) => setBgcolor(e.target.value)}
                      name="custom_color"
                    />
                  </div>
                </div>
              </DrawerHeader>
              <DrawerFooter className="mt-2 md:mt-10 pt-2 pl-8">
                <Button disabled={isLoading} onClick={handleApplyChanges}>
                  {isLoading ? "Processing..." : "Apply Changes"}
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={handleClose}
                  variant="outline"
                >
                  Close
                </Button>
              </DrawerFooter>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
