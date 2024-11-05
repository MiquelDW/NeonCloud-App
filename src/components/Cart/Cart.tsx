"use client";

import { ShoppingCart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "../ui/scroll-area";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";

const Cart = () => {
  const FEE = 1;
  // destructure 'items' state that keeps track of current cart state
  const { items } = useCart();
  // keeps track of how many products are currently inside the cart
  const itemCount = items.length;

  // isMounted state keeps track if client component has been mounted and fully hydrated
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // accumulate the total price of all products currently inside the cart
  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0,
  );

  return (
    <Sheet>
      {/* element that opens the Sheet's content */}
      <SheetTrigger className="group -m-2 flex items-center p-2">
        <ShoppingCart
          aria-hidden="true"
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
        />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {/* only use var 'itemCount' to prevent hydration error */}
          {/* value of 'itemCount' client-side differs from server-side due to localstorage only being accessible from the client */}
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea>
                {items.map(({ product }) => (
                  <CartItem key={product.id} product={product} />
                ))}
              </ScrollArea>
            </div>

            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(FEE)}</span>
                </div>

                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + FEE)}</span>
                </div>
              </div>

              <SheetFooter>
                {/* element that closes Sheet's content */}
                <SheetTrigger
                  // change the default rendered element to the one passed as a child, merging their props and behavior
                  asChild
                >
                  <Link
                    href="/cart"
                    className={buttonVariants({ className: "w-full" })}
                  >
                    Continue to Checkout
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="mb-40 flex h-full flex-col items-center justify-center">
            <div
              aria-hidden="true"
              className="relative mb-4 h-48 w-48 text-muted-foreground"
            >
              <Image src="/empty-cart.jpg" fill alt="empty shopping cart" />
            </div>

            <div className="-mt-5 mb-1 text-xl font-semibold">
              Your cart is empty
            </div>

            <SheetFooter>
              {/* element that closes Sheet's content */}
              <SheetTrigger
                // change the default rendered element to the one passed as a child, merging their props and behavior
                asChild
              >
                <Link
                  href="/products"
                  className={buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-sm text-muted-foreground",
                  })}
                >
                  Add items to your cart to checkout
                </Link>
              </SheetTrigger>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
