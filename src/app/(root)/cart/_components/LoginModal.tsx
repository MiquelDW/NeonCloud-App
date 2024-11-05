import type { Dispatch, SetStateAction } from "react";
// "Dialog" component is an overlaying window
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* holds the content to be rendered and displayed in the open dialog */}
      <DialogContent className="absolute z-[999999]">
        {/* header section of the dialog */}
        <DialogHeader>
          {/* snake image */}
          <div className="relative mx-auto mb-2 h-24 w-24">
            <Image
              fill
              src="/neoncloud-logo.png"
              alt="snake image"
              className="object-contain"
            />
          </div>

          {/* title to be announced when the dialog is opened */}
          <DialogTitle className="text-gray-90 text-center text-3xl font-bold tracking-tight">
            Log in to continue
          </DialogTitle>

          {/* description to be announced when the dialog is opened */}
          <DialogDescription className="py-2 text-center text-base">
            <span className="font-medium text-zinc-900">
              Your configuration was saved!
            </span>{" "}
            Please login or create an account to complete your purchase.
          </DialogDescription>
        </DialogHeader>

        {/* Login + Register buttons */}
        <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200">
          <Link
            href="/sign-in"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className={buttonVariants({ variant: "default" })}
          >
            Sign up
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
