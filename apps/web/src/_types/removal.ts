export type ImageFile = {
  src?: File;
  originDim: { width: number; height: number };
  processedFile?: File | null;
  placeDim?: { width: number; height: number };
};
