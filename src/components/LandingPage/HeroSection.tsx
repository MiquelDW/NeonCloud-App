// navigate user to the given route without a full page reload
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import ProductReel from "../Product/ProductReel";
import { buttonVariants } from "../ui/button";

const HeroSection = () => {
  return (
    <MaxWidthWrapper>
      <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          {" "}
          Your marketplace for high-quality{" "}
          <span className="text-primary">digital assets</span>.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-muted-foreground">
          Welcome to NeonCloud. Every asset on our platform is verified by our
          team to ensure our highest quality standards.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <Link href="/products" className={buttonVariants()}>
            Browse Trending
          </Link>
          <Link
            href="#quality-promise"
            className={buttonVariants({ variant: "ghost" })}
          >
            Our quality promise &rarr;
          </Link>
        </div>
      </div>

      <ProductReel
        query={{ sort: "desc", limit: 4 }}
        href="/products?sort=recent"
        title="Brand new"
        subtitle="Explore more than 10.000 icons and ui kits to use in websites, logos and social media"
      />

      <ProductReel
        query={{ sort: "desc", limit: 4, category: "ui_kits" }}
        href="/products?sort=recent&category=ui_kits"
        title="UI Kits"
        subtitle="Get started building professional looking web-apps"
      />

      <ProductReel
        query={{ sort: "desc", limit: 4, category: "icons" }}
        href="/products?sort=recent&category=icons"
        title="Icons"
        subtitle="Upgrade your designs with high-quality icon sets"
      />
    </MaxWidthWrapper>
  );
};

export default HeroSection;
