"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

// type of a specific element of PRODUCT_CATEGORIES array
type Category = (typeof PRODUCT_CATEGORIES)[number];

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  close: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
}

const NavItem = ({
  category,
  handleOpen,
  close,
  isOpen,
  isAnyOpen,
}: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        {/* nav item button */}
        <Button
          className="gap-1.5"
          // display the content of nav item
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-all", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>

      {/* display content of nav item if its being opened */}
      {isOpen ? (
        <div
          // close the content of nav item
          onClick={() => close()}
          className={cn(
            "absolute inset-x-0 top-full text-sm text-muted-foreground",
            {
              "animate-in fade-in-10 slide-in-from-top-5": isAnyOpen,
            },
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />

          <div className="relative bg-white">
            <div className="mx-auto max-w-7xl px-8">
              <div className="grid grid-cols-3 gap-x-8 gap-y-10 py-16">
                {/* content of each category (nav item) */}
                {category.featured.map((item) => (
                  <Link href={item.href}>
                    <div
                      onClick={() => close}
                      key={item.name}
                      className="relative text-base hover:opacity-75 sm:text-sm"
                    >
                      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.imageSrc}
                          alt="product category image"
                          fill
                          className="object-cover object-center"
                        />
                      </div>

                      <div className="mt-3 block font-medium text-gray-900">
                        {item.name}

                        <p
                          className="mt-1 font-normal text-muted-foreground"
                          aria-hidden="true"
                        >
                          Shop now
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
