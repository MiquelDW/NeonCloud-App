import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/Product/ProductReel";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";

interface ProductsPageProps {
  // 'searchParams' prop contains dynamic query parameters from the current URL
  searchParams: {
    // use index signature to tell TS that 'searchParams' obj can have any number of properties, each with a key of union type string | string[] | undefined
    // index signatures allow you to define the types for properties of an object when you don't know the exact prop names
    [key: string]: string | string[] | undefined;
  };
}

const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  const sort = searchParams.sort;
  const category = searchParams.category;

  // find the approriate category-label of the given 'category'
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === category,
  )?.label;

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse high-quality assets"}
        query={{
          category:
            category === "ui_kits" || category === "icons"
              ? category
              : undefined,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
          limit: 40,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
