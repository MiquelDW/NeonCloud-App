// clsx is a utility for constructing className strings conditionally. It takes in various arguments (which can be strings, objects, arrays, etc.) and combines them into a single string of class names
// clsx(inputs): Combines the class names from 'inputs' into a single string
import { type ClassValue, clsx } from "clsx";
// twMerge ensures that later classes in the list take precedence over the earlier ones when there are tailwind classname conflicts
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";

// this function allows you to merge classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// function to convert numbers to prices in the given format
export function formatPrice(
  price: number | string,
  // defaults to empty object {}
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    // more formatting options
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  // destructured values defaults to "USD" & "compact"
  const { currency = "USD", notation = "compact" } = options;

  // convert given 'price' to float if it has a type of string
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  // formatter object that formats numbers as the given 'currency'
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice); // return formatted version of given 'price'
}

// function that returns Metadata for your application
// set a default value of an empty object for the destructured parameter (= {})
export function constructMetadata({
  title = "NeonCloud - custom high-quality digital products",
  description = "Order your custom high-quality digital product in seconds",
  image = "/neoncloud-thumbnail.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    // enhances how the app appears when shared on social media
    openGraph: {
      title,
      description,
      images: [{ url: image }],
    },
    // enhances how the app appears when shared on Twitter
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@miqueldewit",
    },
    // icons metadata
    icons,
    // specify root URL that will be used as the base for constructing absolute URLs in your metadata
    metadataBase: new URL("https://neoncloud.vercel.app/"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
