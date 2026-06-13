"use client";

import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { EColorProps, EOrientationProps, photosKeys } from "@/_types/photos";
import { useState, memo, useMemo, useCallback } from "react";
import { searchQueryPhotos } from "@/libs/api";
import useDebounce from "@/libs/hooks/useDebounce";
import PhotoGridLoader from "@/features/search/component/PhotoGridLoader";
import { PhotoResult } from "@/_types/photos";
import PhotoGridItem, { PhotoDetailDrawer } from "./PhotoGridItem";
import { useSearchOptionStore } from "./store/searchState";
import { useShallow } from "zustand/shallow";
import { Badge } from "@/components/ui/badge";
import { useFormatter } from "next-intl";
import { masonryColumns, chunks2Arr } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MoveTopButton from "@/components/shared/MoveTop";
import { PhotoRepositoryList } from "@/libs/repository/photoRepository";
import { useColumnCount } from "@/libs/hooks/useColumnCount";
import { PhotoViewer } from "@/components/shared/PhotoViewer";
import GridCols from "@/components/shared/GridCol";

type PhotoGridProps = {
  keyword: string;
};

type PhotoGridMemoizedProps = {
  isFetching: boolean;
  isFetched: boolean;
  isSuccess: boolean;
  isMoredata: boolean;
  rows: PhotoResult[][];
  columnCount: number;
  allPhotos: PhotoResult[];
  onPhotoClick: (item: PhotoResult) => void;
};

export default function PhotoGrid({ keyword }: PhotoGridProps) {
  const format = useFormatter();
  const resultQuery = useDebounce(keyword, 300);
  const { color, orientation } = useSearchOptionStore(
    useShallow((state) => ({
      color: state.color,
      orientation: state.orientation,
    })),
  );
  const perPage = 18;
  const columnCount = useColumnCount();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetched,
    isSuccess,
  } = useInfiniteQuery<PhotoRepositoryList>({
    queryKey: photosKeys.search(
      resultQuery,
      undefined,
      perPage,
      color,
      orientation,
    ),
    queryFn: ({ pageParam = 1 }) =>
      searchQueryPhotos({
        queryKey: photosKeys.search(
          resultQuery,
          pageParam as number,
          perPage,
          color,
          orientation,
        ),
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.page;
      const totalPages = lastPage.total_pages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    enabled: resultQuery.length > 2,
    staleTime: 60000,
    placeholderData: keepPreviousData,
  });

  const photos = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  const newFormData = useMemo(() => {
    if (photos.length === 0) return [];
    if (columnCount === 1) return chunks2Arr(photos, 1);
    return masonryColumns(photos, columnCount);
  }, [photos, columnCount]);

  const handlePhotoClick = useCallback(
    (item: PhotoResult) => {
      const idx = photos.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        setViewerIndex(idx);
      }
    },
    [photos],
  );

  const handleNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const lastPage = data?.pages[data.pages.length - 1];
  const totalPhotos = lastPage?.total ?? 0;
  const totalPages = lastPage?.total_pages ?? 0;

  return (
    <>
      {keyword && (
        <div
          className="flex items-center justify-between 
        my-4 text-gray-500 text-sm"
        >
          <div className="flex items-center">
            <div>
              Results:
              {isFetched && totalPhotos ? (
                <Badge variant={"secondary"}>
                  {photos?.length} of {format.number(totalPhotos)}
                </Badge>
              ) : totalPhotos === 0 ? null : (
                <Skeleton className="w-12 inline-flex h-[10px] rounded-lg" />
              )}
            </div>
            {color && (
              <div className="ml-2">
                <Badge variant={"default"}>{EColorProps[color]}</Badge>
              </div>
            )}
            {orientation && (
              <div className="ml-2">
                <Badge variant={"default"}>
                  {EOrientationProps[orientation]}
                </Badge>
              </div>
            )}
          </div>
          <div className="">
            {isFetched && totalPages && totalPages > 0 ? (
              <Badge variant={"secondary"}>
                Page : {data?.pages.length} of {format.number(totalPages)}
              </Badge>
            ) : totalPhotos === 0 ? null : (
              <Skeleton className="w-12 h-[10px] rounded-lg" />
            )}
          </div>
        </div>
      )}

      <PhotoGridMemoized
        isFetching={isFetching}
        isFetched={isFetched}
        isSuccess={isSuccess}
        isMoredata={isFetchingNextPage}
        rows={newFormData as PhotoResult[][]}
        columnCount={columnCount}
        allPhotos={photos}
        onPhotoClick={handlePhotoClick}
      />

      {viewerIndex !== null && (
        <PhotoViewer
          photos={photos}
          initialIndex={viewerIndex}
          onClose={() => setViewerIndex(null)}
        />
      )}

      {isFetched && hasNextPage && (
        <div
          className="flex 
            items-center justify-center my-6 mt-12"
        >
          <Button
            size={"lg"}
            variant={"default"}
            onClick={handleNextPage}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}

      {photos.length > 6 && <MoveTopButton />}
    </>
  );
}

function arePropsEqual(
  oldProps: PhotoGridMemoizedProps,
  newProps: PhotoGridMemoizedProps,
) {
  return (
    oldProps.isFetched === newProps.isFetched &&
    oldProps.isSuccess === newProps.isSuccess &&
    oldProps.rows.length === newProps.rows.length &&
    oldProps.rows.every((items, cdx) => {
      const newChunkItem = newProps.rows[cdx];
      return items.every((item, idx) => item.id === newChunkItem[idx]?.id);
    }) &&
    oldProps.onPhotoClick === newProps.onPhotoClick
  );
}

const PhotoGridMemoized = memo(function PhotoGridResult({
  isFetching,
  isFetched,
  isMoredata,
  rows,
  columnCount,
  onPhotoClick,
}: PhotoGridMemoizedProps) {
  const [drawerState, setDrawerState] = useState<PhotoResult | null>(null);
  const onCloseDrawer = () => {
    setDrawerState(null);
  };
  return (
    <div className="mt-10">
      {!isFetched && !isMoredata ? (
        <PhotoGridLoader columnCount={columnCount} />
      ) : rows.length > 0 ? (
        <GridCols colomnCount={columnCount}>
          {rows.map((items, chunkIdx) => (
            <div key={chunkIdx} className="flex flex-col gap-5">
              {items.map((item, idx) => (
                <PhotoGridItem
                  key={item.id}
                  onClick={() => {
                    onPhotoClick(item);
                  }}
                  onBlur={onCloseDrawer}
                  isFetching={isFetching}
                  isLast={idx === items.length - 1 && isMoredata}
                  item={item}
                />
              ))}
            </div>
          ))}
        </GridCols>
      ) : isFetched && rows.length === 0 ? (
        <p
          className="text-center text-slate-700 
                my-10 border radius-lg 
                border-gray-200 py-10"
        >
          Not found data
        </p>
      ) : null}
      {drawerState && drawerState?.id && (
        <PhotoDetailDrawer item={drawerState} onCloseDrawer={onCloseDrawer} />
      )}
    </div>
  );
}, arePropsEqual);
