import { PhotoResult } from "@/_types/photos";
import { create } from "zustand";
import { EColorProps, EOrientationProps } from "@/_types/photos";

type SettingOptionProps = {
  color?: keyof typeof EColorProps;
  orientation?: keyof typeof EOrientationProps;
  setColor: (val: string | undefined) => void;
  setOrientation: (val: string | undefined) => void;
};
export const useSearchOptionStore = create<SettingOptionProps>((set) => ({
  color: undefined,
  orientation: undefined,
  setColor: (value) =>
    set(() => ({ color: value as keyof typeof EColorProps })),
  setOrientation: (value) =>
    set(() => ({ orientation: value as keyof typeof EOrientationProps })),
}));

type PhotoStoreProps = {
  photos: PhotoResult[];
  appendPhotos: (data: PhotoResult[]) => void;
  refreshPhotos: (data: PhotoResult[]) => void;
  clearPhotos: () => void;
};

export const usePhotoStore = create<PhotoStoreProps>((set) => ({
  photos: [],
  appendPhotos: (data) =>
    set((state) => ({
      photos: [...state.photos, ...data],
    })),
  refreshPhotos: (data) =>
    set(() => ({
      photos: [...data],
    })),
  clearPhotos: () => set({ photos: [] }),
}));
