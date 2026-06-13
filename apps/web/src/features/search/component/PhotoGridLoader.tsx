import { Skeleton } from "../../../components/ui/skeleton";

type PhotoGridLoaderProps = {
  columnCount?: number;
};

export default function PhotoGridLoader({ columnCount = 3 }: PhotoGridLoaderProps) {
  return (
    <div className={`grid grid-cols-${columnCount} gap-3 my-10`}>
      {Array.from({ length: columnCount }).map((_, i) => (
        <div key={i} className="grid gap-3">
          <Skeleton className="w-full h-[250px] rounded-lg" />
        </div>
      ))}
    </div>
  );
}
