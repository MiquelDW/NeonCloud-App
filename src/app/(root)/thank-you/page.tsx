"use client";

// useQuery hook is used for fetching and caching data from a server
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import { getLoggedInUser } from "@/data/user";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getPaymentStatus } from "./action";

interface ThankYouPageProps {
  // 'searchParams' prop contains dynamic query parameters from the current URL
  searchParams: {
    // use index signature to tell TS that 'searchParams' obj can have any number of properties, each with a key of union type string | string[] | undefined
    // index signatures allow you to define the types for properties of an object when you don't know the exact prop names
    [key: string]: string | string[] | undefined;
  };
}

const ThankYouPage = ({ searchParams }: ThankYouPageProps) => {
  const { clearCart } = useCart();
  // state var keeps track if order has been paid
  const [isPaid, setIsPaid] = useState<boolean>(false);
  // console.log(isPaid);
  const orderId = searchParams.orderId || "";

  // retrieve the currently logged in user
  const { data: currentUser } = useQuery({
    // queryKey is useful for caching and invalidation
    queryKey: ["get-current-user"],
    queryFn: async () => await getLoggedInUser(),
  });

  // retrieve the currently logged in user
  const { data: order, status } = useQuery({
    // queryKey is useful for caching and invalidation
    queryKey: ["get-payment-status"],
    queryFn: async () => {
      const order = await getPaymentStatus({ orderId: orderId as string });

      // update state variable isPaid to 'true' and clear cart state if order has been paid
      if (order) {
        if (order.isPaid) {
          setIsPaid(true);
          clearCart();
        }
      }

      return order;
    },
    // retry the query function 3 times if it throws an error
    // it's important to retrieve the order from the user and its current status
    retry: 3,
    retryDelay: 500,
    // the query is enabled until the data is fetched and isPaid is false
    enabled: isPaid === false,
    // refetch every second (1000ms) if isPaid is false, stop refetching when isPaid is true
    refetchInterval: () => (isPaid ? false : 1000),
  });

  // return user friendly error if given order couldn't be processed
  if (status === "error") {
    if (!currentUser) {
      return (
        <div className="mt-24 flex w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-semibold">
              Please login to view your order!
            </h3>
            <p>
              Click{" "}
              <Link
                href="/sign-in"
                className="underline underline-offset-2 hover:text-primary"
              >
                here
              </Link>{" "}
              to login
            </p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="mt-24 flex w-full justify-center">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-xl font-semibold">Order not found!</h3>
            <p>
              Refresh the page or Click{" "}
              <Link
                href="/configure/upload"
                className="underline underline-offset-2 hover:text-primary"
              >
                here
              </Link>{" "}
              to make another order.
            </p>
          </div>
        </div>
      );
    }
  }

  // display loading state if the order entry from the query function hasn't been returned yet (still fetching from DB)
  if (order === undefined) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Loading your order...</h3>
          <p>This won't take long.</p>
        </div>
      </div>
    );
  }

  // display "not paid" state if the order entry from the query function hasn't been paid yet (waiting for the Webhook to update DB).
  // Stripe checkout window doesn't close when the payment has been received, it closes before that.
  // the request to the Webhook endpoint is send at the same time as the user exits the Stripe checkout page, they run in parallel.
  if (order === false) {
    return (
      <div className="mt-24 flex w-full justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="text-xl font-semibold">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  // accumulate the total price of all products currently inside the cart
  const orderTotal = order.OrderProduct.reduce((total, product) => {
    return total + product.product.price;
  }, 0);

  return (
    <div className="relative lg:min-h-full">
      {/* Thank you image (Left section) */}
      <div className="hidden h-80 overflow-hidden lg:absolute lg:block lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          fill
          src="/checkout-thank-you.jpg"
          className="h-full w-full object-cover object-center"
          alt="thank you for your order"
        />
      </div>

      {/* Right section */}
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24">
        <div className="lg:col-start-2">
          {/* Heading text (top section) */}
          <p className="text-sm font-medium text-primary">Order successful</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Thanks for ordering
          </h1>
          {isPaid ? (
            <p className="mt-2 text-base text-muted-foreground">
              Thank you for your purchase! Your digital assets are now ready for
              download. Simply click the links below to access your files. We
              appreciate your business and hope you enjoy your new content!
            </p>
          ) : (
            <p className="mt-2 text-base text-muted-foreground">
              We appreciate your order, and we're currently processing it. So
              hang tight and we'll send you confirmation very soon!
            </p>
          )}

          {/* Order information (middle & bottom sections) */}
          <div className="mt-16 text-sm font-medium">
            <div className="text-muted-foreground">Order nr.</div>
            <div className="mt-2 text-gray-900">{order.id}</div>

            {/* display ordered products */}
            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
              {order.OrderProduct.map((orderProduct) => {
                // find the approriate category-label of the retrieved product
                const label = PRODUCT_CATEGORIES.find(
                  ({ value }) => value === orderProduct.product.category,
                )?.label;

                const downloadUrl = orderProduct.product.productFile;
                const image = orderProduct.product.productImages[0];

                return (
                  <li
                    key={orderProduct.product.id}
                    className="flex space-x-6 py-6"
                  >
                    <div className="relative h-24 w-24">
                      <Image
                        fill
                        src={image}
                        alt={`${orderProduct.product.name} image`}
                        className="flex-none rounded-md bg-gray-100 object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-auto flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-gray-900">
                          {orderProduct.product.name}
                        </h3>

                        <p className="my-1">Category: {label}</p>
                      </div>

                      {isPaid && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          download={orderProduct.product.name}
                          className="text-primary underline-offset-2 hover:underline"
                        >
                          Download asset
                        </a>
                      )}
                    </div>

                    <p className="flex-none font-medium text-gray-900">
                      {formatPrice(orderProduct.product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            {/* display total costs */}
            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-gray-900">{formatPrice(orderTotal)}</p>
              </div>

              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-gray-900">{formatPrice(1)}</p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(orderTotal + 1)}</p>
              </div>
            </div>

            {/* display order status */}
            <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Shipping To</p>
                <p>{order.User.email}</p>
              </div>

              <div>
                <p className="font-medium text-gray-900">Order Status</p>
                <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
              </div>
            </div>

            {/* display button */}
            <div className="mt-16 border-t border-gray-200 py-6 text-right">
              <Link
                href="/products"
                className="text-sm font-medium text-primary hover:text-primary/80"
              >
                Continue shopping &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
