import { Skeleton } from "../../../components/ui/skeleton";

export default function PhotoGridLoader() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-10">
      <div className="grid gap-3">
        <Skeleton className="w-full h-[250px] rounded-lg" />
      </div>

      <div className="grid gap-3">
        <div>
          <Skeleton className="w-full h-[250px] rounded-lg" />
        </div>
      </div>

      <div className="grid gap-3">
        <div>
          <Skeleton className="w-full h-[250px] rounded-lg" />
        </div>
      </div>
    </div>
  );
}
