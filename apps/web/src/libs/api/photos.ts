import { QueryFunctionContext } from "@tanstack/react-query";
import { ApiHeader, PexelApiHeader } from "@/libs/api/apiHeader";
import {
  PexelSearchPhotosProps,
  photosKeys,
  UnsplashSearchPhotosProps,
  ServerSearchResponse,
} from "@/_types/photos";
import { PhotoRepositoryList } from "@/libs/repository/photoRepository";
export type QueryPhotosProps = QueryFunctionContext<
  ReturnType<(typeof photosKeys)["search"]>
>;

export const searchQueryPhotos: any = async ({
  queryKey,
}: QueryPhotosProps): Promise<PhotoRepositoryList> => {
  const [, query, page, per_page] = queryKey;

  const [pexel, serverResult] = await Promise.allSettled([
    pexelSearchPhotosApi(queryKey),
    serverSearchPhotosApi(
      query ?? "",
      per_page ?? 18,
      ((page ?? 1) - 1) * (per_page ?? 18),
    ),
  ]);

  const photoObjList = new PhotoRepositoryList();

  if (pexel.status === "fulfilled") {
    photoObjList.setIteratorPhotoPexel(pexel.value);
  }

  if (serverResult.status === "fulfilled") {
    photoObjList.setIteratorPhotoServer(serverResult.value);
  }

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

export async function serverSearchPhotosApi(
  keyword: string,
  limit: number = 20,
  offset: number = 0,
): Promise<ServerSearchResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    return { keyword, total: 0, photos: [] };
  }

  const urlApi = `${baseUrl}/v1/api/search?keyword=${encodeURIComponent(
    keyword,
  )}&limit=${limit}&offset=${offset}`;

  const response = await fetch(urlApi);

  if (!response.ok) {
    throw new Error("Server search request failed");
  }

  const json = await response.json();

  if (!json.success) {
    throw new Error(json.error ?? "Server search returned error");
  }

  return json.data as ServerSearchResponse;
}
