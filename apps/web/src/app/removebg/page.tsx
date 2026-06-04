"use client";

import Footer from "../../components/shared/Footer";
import Header from "../../components/shared/Header";
import dynamic from "next/dynamic";

const PhotoRemovalClientComponent = dynamic(
  () => import("../../features/photoRemoval/PhotoRemoval"),
  { ssr: false }, // Disable server-side rendering
);

export default function Page() {
  return (
    <div className="">
      <Header withBrand />
      <div className="container w-full md:w-5/6 mx-auto px-4">
        <div className="flex flex-col mt-8 p-4 bg-slate-100 border-solid border border-slate-400 rounded-lg">
          <p className="text-md font-semibold mb-2">BG removal beta version</p>
          <p className="text-sm mb-2">
            One-click AI background photo removal utilize your resource browser
            as machine processing, this page laverages machine learning models
            Transformers.js and ONNX runtime web to process media locally
          </p>
          <p className="font-semibold text-sm underline underline-offset-2">
            Next version: Enable upload your avatar and remove it!
          </p>
        </div>
        <PhotoRemovalClientComponent />
        <Footer />
      </div>
    </div>
  );
}
