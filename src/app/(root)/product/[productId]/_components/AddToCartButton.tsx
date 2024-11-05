"use client";

import { ProductType } from "@/components/Product/ProductReel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

const AddToCartButton = ({ product }: { product: ProductType }) => {
  const { addItem, items } = useCart();
  // state var keeps track if a success or error message should be shown
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // delay updating value of state var 'isSuccess' to false with 2 seconds
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isSuccess]);

  useEffect(() => {
    // delay updating value of state var 'isError' to false with 2 seconds
    const timeout = setTimeout(() => {
      setIsError(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isError]);

  return (
    <Button
      onClick={() => {
        if (items.find((cartItem) => cartItem.product.id === product.id)) {
          setIsError(true);
        } else {
          // add product to 'items' / cart state with function from custom hook
          addItem(product);
          setIsSuccess(true);
        }
      }}
      size="lg"
      className="w-full"
    >
      {isSuccess
        ? "Added!"
        : isError
          ? "Product already in cart!"
          : "Add to cart"}
    </Button>
  );
};

export default AddToCartButton;
