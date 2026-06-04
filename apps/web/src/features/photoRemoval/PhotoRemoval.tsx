"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import ImageProcess from "@/components/shared/ImageProcess";
import { urlToFile } from "@/libs/utils";
import { ImageFile } from "@/_types/removal";
import Image from "next/image";

export default function PhotoRemoval() {
  const [, setIsClient] =
    useState(
      false,
    ); /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const imageRef = useRef<HTMLImageElement>(null);
  const searchParams = useSearchParams();
  const imageSrc = decodeURIComponent(searchParams?.get("src") ?? "");
  const imageOrigWidth = decodeURIComponent(searchParams?.get("w") ?? "");
  const imageOrigHeight = decodeURIComponent(searchParams?.get("h") ?? "");
  const [imageFile, setImageFile] = useState<ImageFile>({
    originDim: {
      width: parseInt(imageOrigWidth),
      height: parseInt(imageOrigHeight),
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function initImage() {
      if (imageRef.current?.width && imageRef.current?.height) {
        const srcFile = await urlToFile(imageSrc, "image.jpg", "image/jpeg");
        setImageFile({
          ...imageFile,
          src: srcFile,
          placeDim: {
            width: imageRef.current.width,
            height: imageRef.current.height,
          },
        });
      }
    }
    initImage();
  }, [imageSrc]);

  return (
    <div className="relative">
      <div className="flex mx-auto mt-8 py-4 gap-10">
        <div className="cursor-pointer w-1/2">
          <Image
            ref={imageRef}
            className="h-auto max-w-full rounded-lg shadow-lg"
            src={imageSrc}
            width={500}
            height={500}
            priority={true}
            alt="source image"
          />
          <div className="mt-8 p-4 bg-slate-100 border-solid border border-slate-400 rounded-lg">
            Download original image{" "}
            <a
              className="text-red-600 underline underline-offset-2"
              href={imageSrc}
            >
              here
            </a>
          </div>
        </div>

        {imageFile.placeDim && imageFile.placeDim?.width > 0 && (
          <div
            className="flex flex-col w-1/2 "
            style={{
              width: imageFile?.placeDim.width,
            }}
          >
            <ImageProcess imageSrc={imageSrc} imageFile={imageFile} />
          </div>
        )}
      </div>
    </div>
  );
}
