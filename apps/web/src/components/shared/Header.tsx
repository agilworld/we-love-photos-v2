import { GitForkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import changelogs from "@/sample-data/changelogs.json";
import { Button } from "@/components/ui/button";
import { ComponentPropsWithRef, useState } from "react";
import { getLastVersion } from "@/libs/utils";
import { Heart } from "lucide-react";
import { H4 } from "@/components/ui/heading";
import Link from "next/link";

type HeaderProps = {
  withBrand?: boolean;
};

export default function Header(props: HeaderProps) {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const handleClose = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="flex px-6 shadow-sm border-b border-gray-200 justify-between items-center text-xs text-gray-600 py-4">
      <div className="flex items-center gap-3">
        {props.withBrand && (
          <Link href="/" className="flex items-center">
            <Heart size={24} className="mr-2" color="red" />
            <H4 className="mb-0 text-lg">We Love Photos</H4>
          </Link>
        )}
        <a className="text-sm" href="https://dianafrial.net" target="_blank">
          <Badge variant={"outline"}>Hire me!</Badge>
        </a>
      </div>
      <div className="flex items-center gap-5">
        <Link
          href="#"
          onClick={() => setOpenDrawer(true)}
          className="text-orange-500"
        >
          Change logs v{getLastVersion()}
        </Link>
        <a
          href="https://github.com/agilworld/we-love-photos-app"
          className="flex items-center"
          target="_blank"
        >
          <GitForkIcon size={15} className="mr-1" />
          Fork on Github
        </a>
      </div>
      <ChangelogDrawer open={openDrawer} onClose={handleClose} />
    </div>
  );
}

type TChangeLogProps = {
  onClose?: () => void;
} & ComponentPropsWithRef<typeof Drawer>;

const ChangelogDrawer = (props: TChangeLogProps) => {
  return (
    <Drawer {...props}>
      <DrawerContent className="h-full">
        <div className="mx-auto w-full max-w-4xl md:py-6">
          <div className="flex flex-col md:flex-row justify-center">
            <div className="w-full md:w-4/6">
              <DrawerHeader className="text-left pt-10 pr-10 pl-10 md:pt-0 md:pl-10 md:pr-2">
                <DrawerTitle className="leading-tight mb-6">
                  Change logs
                </DrawerTitle>
              </DrawerHeader>

              <div className="max-h-[65vh] px-4 overflow-y-scroll leading-none text-md">
                {changelogs.logs.map((item, index) => (
                  <div key={`log-${index}`} className="mb-4">
                    <h4 className="font-bold text-sm text-black">
                      {item.version}
                    </h4>
                    <ul>
                      {item.items.map((li, idx) => (
                        <li className="text-xs" key={`li-${idx}`}>
                          - {li}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <DrawerFooter className="mt-10 pt-2">
                <Button onClick={props.onClose} variant="outline">
                  Close
                </Button>
              </DrawerFooter>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
