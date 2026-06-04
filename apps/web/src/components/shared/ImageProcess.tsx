"use client";

import { useCallback, useState } from "react";
import {
  initializeModel,
  getModelInfo,
  processImage,
} from "@/libs/ai/transformers";
import Image from "next/image";
import LoaderModel from "@/features/photoRemoval/component/LoaderModel";
import { PencilIcon } from "lucide-react";
import EditPhotoDrawer from "../../features/photoRemoval/EditPhotoDrawer";
import { ImageFile } from "@/_types/removal";
import clsx from "clsx";
import ButtonDropdown from "@/components/shared/ButtonDropdown";
import { track } from "@vercel/analytics";

type ImageProps = {
  imageFile: ImageFile;
  imageSrc: string;
};

export default function ImageProcess(props: ImageProps) {
  const { imageFile, imageSrc } = props;
  const imgDimension = imageFile.placeDim as ImageFile["placeDim"];

  const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
  const [isProcessLoading, setIsProcessLoading] = useState<boolean>(false);
  const [, setIsWebGPU] =
    useState<boolean>(
      false,
    ); /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [, setIsIOS] =
    useState<boolean>(
      false,
    ); /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [processedAi, setProcessedAi] = useState<string>("");
  const [processedEditAi, setProcessedEditAi] = useState<string>("");
  const [bgcolor, setBgcolor] = useState<string>("");
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);

  const handleClickProcess = useCallback(() => {
    track("Start to Process Remove BG", {
      url: imageSrc,
    });
    setIsModelLoading(true);
    setIsProcessLoading(true);
    (async () => {
      try {
        const initialized = await initializeModel();
        if (!initialized) {
          throw new Error("Failed to initialize background removal model");
        }
        const { isWebGPUSupported, isIOS: isIOSDevice } = getModelInfo();
        setIsWebGPU(isWebGPUSupported);
        setIsIOS(isIOSDevice);
        setIsModelLoading(false);
        await processAiImage();
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const processAiImage = useCallback(async () => {
    // process
    try {
      const imageai = imageFile.src;
      if (imageai) {
        const resImage = await processImage(imageai);
        const imageblob = URL.createObjectURL(resImage);
        setIsProcessLoading(false);
        setProcessedAi(imageblob);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onShowEditDrawer = () => {
    setIsEditDrawerOpen(true);
  };

  const handleEditSave = (file: string, color: string) => {
    setProcessedEditAi(file);
    setBgcolor(color);
  };

  const transparentBg = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURb+/v////5nD/3QAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAUSURBVBjTYwABQSCglEENMxgYGAAynwRB8BEAgQAAAABJRU5ErkJggg==")`;

  return (
    <div className="h-full">
      <div
        style={{
          height: processedAi ? "auto" : (imgDimension?.height as number),
          backgroundImage: processedAi ? transparentBg : undefined,
          backgroundRepeat: processedAi ? "repeat" : undefined,
        }}
        className={clsx([
          "flex flex-col relative justify-center items-center cursor-pointer rounded-lg",
          {
            "border-4 border-slate-200 border-dashed": !processedAi,
          },
        ])}
      >
        {(processedEditAi || processedAi) && (
          <div
            onClick={onShowEditDrawer}
            className="absolute flex w-8 h-8 
            bg-black right-2.5 shadow-lg top-2.5 rounded-full"
          >
            <PencilIcon className="text-white w-4 h-4 mx-auto my-auto" />
          </div>
        )}

        {isEditDrawerOpen && imgDimension && processedAi && (
          <EditPhotoDrawer
            image={processedAi}
            defaultBgcolor={bgcolor}
            width={imageFile.originDim.width as number}
            height={imageFile.originDim.height as number}
            onCloseDrawer={() => setIsEditDrawerOpen(false)}
            onSave={(file: string, color: string) =>
              handleEditSave(file, color)
            }
          />
        )}

        {processedAi && imgDimension ? (
          <Image
            alt={"background removal"}
            width={imgDimension.width as number}
            height={imgDimension.height as number}
            className="rounded-lg"
            src={processedEditAi || processedAi}
          />
        ) : isModelLoading || isProcessLoading ? (
          <LoaderModel
            text={
              isModelLoading
                ? "Loading background removal model"
                : "Processing removal"
            }
            subtext={
              !isModelLoading
                ? "It might takes a bit times depends on your PC resources"
                : undefined
            }
          />
        ) : (
          <button
            onClick={handleClickProcess}
            className="absolute px-4 py-2 z2 text-white bg-black shadow-lg rounded-md"
          >
            Start to Process
          </button>
        )}
      </div>
      <div className="flex items-center justify-between mt-8 p-4 bg-slate-100 border-solid border border-slate-400 rounded-lg">
        <p>Please download here:</p>
        <ButtonDropdown
          buttonText="Download"
          buttonDisabled={processedAi || processedEditAi ? false : true}
          items={[
            {
              buttonText: "Transparent Image",
              key: "origin",
              link: processedAi,
              disabled: false,
              download: "welovephotos-origin.png",
              handleClick: () => {
                track("Download Transparent Image");
              },
            },
            {
              buttonText: "Edited Image",
              key: "edited",
              disabled: processedEditAi ? false : true,
              link: processedEditAi,
              download: "welovephotos-colored-bg.png",
              handleClick: () => {
                track("Download Edited Image");
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
