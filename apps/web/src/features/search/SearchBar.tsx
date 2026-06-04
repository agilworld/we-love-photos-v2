"use client";

import { Input } from "@/components/ui/input";
import { ChangeEvent, useCallback, useState, useRef } from "react";

import PhotoGrid from "./PhotoGrid";
import { Search, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EOrientationProps, EColorProps } from "@/_types/photos";
import { useSearchOptionStore } from "./store/searchState";
import { useShallow } from "zustand/shallow";
import Select from "@/components/ui/select";
import DefaultPhotoPlaceholder from "@/components/shared/DefaultPhotoPlaceholder";

export default function SearchBar() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = useCallback(
    (arr: ChangeEvent<HTMLInputElement>) => {
      setSearch(arr.target.value);
    },
    [setSearch, search],
  );

  return (
    <div className="flex flex-col">
      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full">
          <div
            className="absolute mr-2 inset-y-0 start-0 
                            flex items-center ps-3.5 pointer-events-none"
          >
            <Search color={"gray"} className="mx-3 bg-white" />
          </div>
          <Input
            onChange={handleSearch}
            type="text"
            placeholder="Type keyword e.g. tiger, laptop with desk"
            className="w-full md:text-xl text-xl shadow-lg 
                            h-16 px-8 pl-16 pr-20 py-4"
          />
          <SettingsOption />
        </div>
      </div>
      {search.length > 2 ? (
        <PhotoGrid keyword={search} />
      ) : (
        <DefaultPhotoPlaceholder />
      )}
    </div>
  );
}

const SettingsOption = () => {
  const [dropdown, setDropdown] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleDropdown = useCallback(() => {
    setDropdown(!dropdown);
  }, [dropdown, setDropdown]);

  const handleMouseLeave = () => {
    setDropdown(false);
    buttonRef.current?.blur();
  };

  const { color, orientation } = useSearchOptionStore(
    useShallow((state) => ({
      color: state.color,
      orientation: state.orientation,
    })),
  );
  const setOrientation = useSearchOptionStore((state) => state.setOrientation);
  const setColor = useSearchOptionStore((state) => state.setColor);

  const handleOrientationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e?.target?.value !== "Default" ? e?.target?.value : undefined;
    setOrientation(val);
  };

  const handleColorChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e?.target?.value !== "Default" ? e?.target?.value : undefined;
    setColor(val);
  };

  return (
    <div
      onMouseLeave={handleMouseLeave}
      className="absolute mr-4 inset-y-0 end-0 flex items-center ps-3.5"
    >
      <Button
        ref={buttonRef}
        id="dropdownDefaultButton"
        onClick={handleDropdown}
        data-dropdown-toggle="dropdown"
        className="
                    text-white bg-black hover:bg-gray-800 
                    focus:ring-4 focus:ring-offset-slate-400 focus:outline-none 
                    text-lg rounded-lg py-2.5 
                    text-center inline-flex items-center"
      >
        <Settings2 />
      </Button>

      {dropdown && (
        <div
          id="dropdown"
          className="z-10 w-64 absolute 
            bg-white divide-y divide-gray-100 
            rounded-lg shadow-lg end-0 border-gray-300 border top-14 dark:bg-gray-700"
        >
          <ul
            className="
                    p-6 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <Select
                id="selectOrientation"
                labelText="Orientation"
                defaultText="Default"
                onChange={handleOrientationChange}
                value={orientation}
                data={Object.entries(EOrientationProps) as [string, string][]}
              />
            </li>

            <li>
              <Select
                id="selectColor"
                labelText="Color"
                defaultText="Default"
                onChange={handleColorChange}
                value={color}
                data={Object.entries(EColorProps) as [string, string][]}
              />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
