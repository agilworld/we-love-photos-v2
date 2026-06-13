import { H2, H4 } from "@/components/ui/heading";
import { Heart } from "lucide-react";
export default function Hero() {
  return (
    <div className="flex flex-col items-center my-12 text-center">
      <Heart size={64} color="red" />
      <H2 className="mb-2">We Love Photos</H2>
      <H4 className="font-normal text-neutral-500 mb-0">
        Best Collection photos from <span className="font-bold">Pexel</span> and{" "}
        <span className="font-bold">Unsplash</span>.
      </H4>
      <p className="text-neutral-500 italic">
        Share what your love to family and friends. because FREE is extremely
        stunning
      </p>
    </div>
  );
}
