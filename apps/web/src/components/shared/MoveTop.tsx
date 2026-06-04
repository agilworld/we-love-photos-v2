import { ChevronUpCircleIcon } from "lucide-react";

export default function MoveTopButton() {
  const handleButton = () => {
    if (typeof window !== undefined) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="fixed end-20 bottom-20 rounded-full">
      <a href="#" onClick={handleButton} className="">
        <ChevronUpCircleIcon className="text-gray-500 hover:scale-125" />
      </a>
    </div>
  );
}
