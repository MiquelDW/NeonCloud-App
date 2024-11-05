"use client";

import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

const NavItems = () => {
  // state var that keeps track which nav item's content is being displayed
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    // handler that closes the content of a nav item
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };
    document.addEventListener("keydown", handler);

    // clean up function to prevent memory leaks
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  // state var that keeps track if any of the nav item's content is being displayed
  const isAnyOpen = activeIndex !== null;

  const navRef = useRef<HTMLDivElement | null>(null);
  // close the content of a nav item when user clicks outside of the element inside the ref object
  useOnClickOutside(navRef, () => setActiveIndex(null));

  return (
    // assign ref to nav <div> container to keep track of clicks outside of it
    <div className="flex h-full gap-4" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, i) => {
        // function that opens or closes the content of the nav item
        const handleOpen = () => {
          if (activeIndex === i) {
            setActiveIndex(null);
          } else {
            setActiveIndex(i);
          }
        };
        // keeps track if content of current nav item is being displayed
        const isOpen = i === activeIndex;

        // function that closes the content of the nav item
        const close = () => setActiveIndex(null);

        return (
          <NavItem
            key={category.value}
            category={category}
            close={close}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
