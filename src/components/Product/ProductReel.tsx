"use client";

import { getProducts } from "@/data/product";
import { TQueryValidator } from "@/lib/zod-schemas";
import { Product } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductListing from "./ProductListing";
import { usePathname } from "next/navigation";

// predefine object structure for given 'props' object
interface ProductReelProps {
  query: TQueryValidator;
  title: string;
  subtitle?: string;
  href?: string;
}

export type ProductType = {
  // iterate over every key in the "Product" type
  // if key is 'price', set its type to 'number'
  // for all other props, use its original type (type of 'K' in "Product")
  [K in keyof Product]: K extends "price" ? number : Product[K];
};

const ProductReel = ({ query, title, subtitle, href }: ProductReelProps) => {
  const [products, setProducts] = useState<ProductType[]>([]);

  // re-run useEffect when one of the given dependencies change
  useEffect(() => {
    const fetchAllProducts = async () => {
      const retrievedProducts = await getProducts(query);
      setProducts(retrievedProducts);
    };
    fetchAllProducts();
  }, [query, title, subtitle, href]);

  let map: (ProductType | null)[] = [];
  if (products && products.length > 0) {
    map = products;
  } else {
    map = new Array<null>(query.limit ?? 4).fill(null);
  }

  return (
    <section className="py-12">
      <div className="mb-4 md:flex md:items-center md:justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="hidden text-sm font-medium text-primary hover:text-primary/85 md:block"
          >
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        )}
      </div>

      <div className="relative">
        <div className="mt-6 flex w-full items-center">
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
            {map.map((product, i) => (
              <ProductListing
                key={`product-${i}`}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>

        {href && (
          <div className="mt-6">
            <Link
              href={href}
              className="text-sm font-medium text-primary hover:text-primary/85 md:hidden"
            >
              Shop the collection <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReel;
