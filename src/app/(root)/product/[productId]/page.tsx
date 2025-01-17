"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ImageSlider from "@/components/Product/ImageSlider";
import ProductReel, { ProductType } from "@/components/Product/ProductReel";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import { getProductById } from "@/data/product";
import { formatPrice } from "@/lib/utils";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "./_components/AddToCartButton";

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

const ProductPage = ({
  // retrieve value of dynamic query param 'productId'
  params: { productId },
}: {
  params: { productId: string };
}) => {
  const [product, setProduct] = useState<ProductType | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const fetchProduct = async () => {
      // retrieve product entry whose field values matches the given values
      const product = await getProductById(productId, "approved");
      setProduct(product);
    };
    fetchProduct();
  }, []);

  if (!product) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-xl font-semibold">Product not found!</h3>
          <p>
            Click{" "}
            <Link
              href="/products"
              className="underline underline-offset-2 hover:text-primary"
            >
              here
            </Link>{" "}
            to view our products or return to the{" "}
            <Link
              href="/"
              className="underline underline-offset-2 hover:text-primary"
            >
              home
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    );
  }

  // find the approriate category-label of the retrieved product
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category,
  )?.label;

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          {/* Product details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((breadcrumb, i) => (
                <li key={breadcrumb.href}>
                  <div className="flex items-center text-sm">
                    <Link
                      href={breadcrumb.href}
                      className="text-sm font-medium text-muted-foreground hover:text-gray-900"
                    >
                      {breadcrumb.name}
                    </Link>

                    {/* add dynamically a seperator for each breadcrumb except for the last one */}
                    {i !== BREADCRUMBS.length - 1 && (
                      <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center">
                <p className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>

                <div className="ml-4 border-l border-gray-300 pl-4 text-muted-foreground">
                  {label}
                </div>
              </div>

              <div className="mt-4 space-y-6">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check
                  aria-hidden="true"
                  className="h-5 w-5 flex-shrink-0 text-primary"
                />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/* Product images */}
          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={product.productImages} />
            </div>
          </div>

          {/* Add to cart */}
          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div className="mt-10">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-6 text-center">
              <div className="text-medium inline-flex text-sm">
                <Shield
                  aria-hidden="true"
                  className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                />
                <span className="text-muted-foreground hover:text-gray-700">
                  30 Day Return Guarantee
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* display similar products */}
      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label}`}
        subtitle={`Browse similar high-quality ${label} just like '${product.name}'`}
      />
    </MaxWidthWrapper>
  );
};

export default ProductPage;
