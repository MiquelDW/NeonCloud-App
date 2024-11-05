"use client";

import { Product } from "@prisma/client";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import ImageSlider from "./ImageSlider";
import { ProductType } from "./ProductReel";

// predefine object structure for given 'props' object
interface ProductListingProps {
  product: ProductType | null;
  index: number;
}

const ProductListing = ({ product, index }: ProductListingProps) => {
  // state variable that determines if a product should be shown
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // useEffect to display products gradually
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  // return skeleton loading state if the products are loading
  if (!product || !isVisible) return <ProductPlaceholder />;

  // find the approriate category-label of the given product
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category,
  )?.label;

  if (product && isVisible) {
    return (
      <Link
        href={`/product/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <ImageSlider urls={product.productImages} />

        <h3 className="mt-4 text-sm font-medium text-gray-700">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
      </Link>
    );
  }
};

const ProductPlaceholder = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 h-4 w-2/3 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-16 rounded-lg" />
      <Skeleton className="mt-2 h-4 w-12 rounded-lg" />
    </div>
  );
};

export default ProductListing;
