"use client";

import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import { useCart } from "@/hooks/use-cart";
import { cn, formatPrice } from "@/lib/utils";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
// useMutation hook is used to create/update/delete data or perform server side-effects
// useQuery hook is used for fetching and caching data from a server
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCheckoutSession } from "./action";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/hooks/use-toast";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/data/user";
import LoginModal from "./_components/LoginModal";

const CartPage = () => {
  const FEE = 1;
  const router = useRouter();
  const { toast } = useToast();
  // state var that determines if the Login Modal component should be displayed
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  // destructured 'items' state that keeps track of current cart state
  const { items, removeItem } = useCart();
  // retrieve the id's of all products currently inside the cart state
  const productIds = items.map(({ product }) => product.id);

  // retrieve the currently logged in user
  const { data: currentUser } = useQuery({
    // queryKey is useful for caching and invalidation
    queryKey: ["get-current-user"],
    queryFn: async () => await getLoggedInUser(),
  });

  // isMounted state keeps track if client component has been mounted and fully hydrated
  // value of 'items' client-side differs from server-side due to localstorage only being accessible from the client
  const [isMounted, setIsMounted] = useState<boolean>(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // accumulate the total price of all products currently inside the cart
  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0,
  );

  const { mutate: createNewCheckoutSession, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["create-checkout-session"],
    // save the user's defined phone case configuration in db
    mutationFn: async (productIds: string[]) => {
      return await createCheckoutSession(productIds);
    },
    // fire this func if an error occurs during execution of mutation function
    onError: (err) => {
      toast({
        title: "Something went wrong",
        description: `${
          err ? err.message : "There was an error on our end. Please try again."
        }`,
        variant: "destructive",
      });
    },
    // fire this func if mutation function has successfully completed
    onSuccess: ({ url }) => {
      // navigate user given 'url' from stripe to start the payment session
      if (url) router.push(url);
      else throw new Error("Unable to retrieve payment URL.");
    },
  });

  // callback function that handles onClick event
  const handleCheckout = () => {
    if (currentUser) {
      // create payment session
      createNewCheckoutSession(productIds);
    } else {
      // display Login Modal component by updating state var to true
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>

        {/* LoginModal where user can login */}
        <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen} />

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          {/* shopping cart */}
          <div
            className={cn("lg:col-span-7", {
              // apply styling if cart state is empty
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            {/* element improves accessibility with screen readers */}
            <h2 className="sr-only">Items in your shopping cart</h2>

            {/* render empty cart if cart state is empty */}
            {isMounted && items.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/empty-cart.jpg"
                    fill
                    loading="eager"
                    alt="empty shopping cart"
                  />
                </div>

                <h3 className="text-2xl font-semibold">Your cart is empty</h3>
                <p className="text-center text-muted-foreground">
                  Whoops! Nothing to show here yet.
                </p>
              </div>
            )}

            {/* render products from the cart state ('items') */}
            <ul
              className={cn({
                // adds divider between <li> elements and a top & bottom border on <ul> element
                "divide-y divide-gray-200 border-b border-t border-gray-200":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map(({ product }) => {
                  // find the approriate category-label of the retrieved product
                  const label = PRODUCT_CATEGORIES.find(
                    (c) => c.value === product.category,
                  )?.label;

                  const image = product.productImages[0];

                  return (
                    <li key={product.id} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative h-24 w-24">
                          <Image
                            fill
                            src={image}
                            alt="product image"
                            className="h-full w-full rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>
                      </div>

                      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                          <div>
                            <h3 className="text-sm">
                              <Link
                                href={`/product/${product.id}`}
                                className="font-medium text-gray-700 hover:text-gray-800"
                              >
                                {product.name}
                              </Link>
                            </h3>

                            <p className="mt-1 text-sm text-muted-foreground">
                              Category: {label}
                            </p>

                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {formatPrice(product.price)}
                            </p>
                          </div>

                          <div className="mt-4 w-20 sm:mt-0 sm:pr-9">
                            <div className="absolute right-0 top-0">
                              <Button
                                aria-label="remove product"
                                onClick={() => removeItem(product.id)}
                                variant="ghost"
                              >
                                <X className="h-5 w-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                          <Check className="h-5 w-5 flex-shrink-0 text-primary" />

                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          {/* summary of order */}
          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            {/* price information */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat Transaction Fee</span>
                </div>

                <div className="text-sm font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(FEE)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base font-medium text-gray-900">
                  {isMounted ? (
                    formatPrice(cartTotal + FEE)
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                disabled={items.length === 0 || isPending}
                onClick={handleCheckout}
                className="w-full"
                size="lg"
              >
                {isPending && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
