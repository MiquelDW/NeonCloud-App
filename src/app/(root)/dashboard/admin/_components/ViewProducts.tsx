"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ProductWithNumberPrice } from "./SellersOverview";
import ViewIndividualProduct from "./ViewIndividualProduct";

const ViewProducts = ({ products }: { products: ProductWithNumberPrice[] }) => {
  // keeps track if content of dropdown menu is displayed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const filteredProducts = products.filter(
    (product) => product.terminated === false,
  );

  return (
    // display dropdown menu to the user
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      {/* button that triggers the dropdown menu */}
      <DropdownMenuTrigger
        // change the default rendered element to the one passed as a child, merging their props and behavior
        asChild
      >
        <Button
          variant="outline"
          className="md:w-42 flex w-32 items-center justify-between sm:w-36"
          disabled={filteredProducts.length === 0 || filteredProducts === null}
        >
          {/* display currently active order status */}
          {filteredProducts.length === 0 || filteredProducts === null
            ? "No products"
            : "View products"}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-all hover:cursor-pointer",
              {
                "-rotate-180": isOpen,
              },
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      {/* this component pops out when the dropdown menu is triggered */}
      <DropdownMenuContent className="flex max-w-[80px] flex-col overflow-hidden text-nowrap p-0">
        <div className="flex flex-col gap-2">
          {filteredProducts.map((product) => (
            <ViewIndividualProduct key={product.id} product={product} />
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewProducts;
