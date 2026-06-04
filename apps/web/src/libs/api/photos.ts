import { QueryFunctionContext } from "@tanstack/react-query";
import { ApiHeader, PexelApiHeader } from "@/libs/api/apiHeader";
import {
  PexelSearchPhotosProps,
  photosKeys,
  UnsplashSearchPhotosProps,
} from "@/_types/photos";
import { PhotoRepositoryList } from "@/libs/repository/photoRepository";
export type QueryPhotosProps = QueryFunctionContext<
  ReturnType<(typeof photosKeys)["search"]>
>;

export const searchQueryPhotos: any = async ({
  queryKey,
}: QueryPhotosProps): Promise<PhotoRepositoryList> => {
  const [pexel] = await Promise.all([
    //unsplashSearchPhotosApi(queryKey),
    pexelSearchPhotosApi(queryKey),
  ]);

  const photoObjList = new PhotoRepositoryList();
  photoObjList.setIteratorPhotoPexel(pexel);
  //photoObjList.setIteratorPhotoUnsplash(unsplash);
  return photoObjList;
};

export async function unsplashSearchPhotosApi(
  queryKey: QueryPhotosProps["queryKey"],
): Promise<UnsplashSearchPhotosProps> {
  const [, query, page, per_page, color, orientation] = queryKey;
  let urlApi =
    process.env.NEXT_PUBLIC_UNSPLASH_BASE_API +
    `search/photos?query=${query}&page=${page}&per_page=${per_page}`;

  if (color) {
    urlApi += `&color=${color}`;
  }
  if (orientation) {
    urlApi += `&orientation=${orientation}`;
  }
  const response = await fetch(urlApi, {
    headers: ApiHeader(),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}

export async function pexelSearchPhotosApi(
  queryKey: QueryPhotosProps["queryKey"],
): Promise<PexelSearchPhotosProps> {
  const [, query, page, per_page, color, orientation] = queryKey;
  let urlApi =
    process.env.NEXT_PUBLIC_PEXEL_BASE_API +
    `search?query=${query}&page=${page}&per_page=${per_page}`;

  if (color) {
    urlApi += `&color=${color}`;
  }
  if (orientation) {
    urlApi += `&orientation=${orientation}`;
  }
  const response = await fetch(urlApi, {
    headers: PexelApiHeader(),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
}
