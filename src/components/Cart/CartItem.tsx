import Image from "next/image";
import { ProductType } from "../Product/ProductReel";
import { ImageIcon, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/data/config/product_categories";
import { useCart } from "@/hooks/use-cart";

const CartItem = ({ product }: { product: ProductType }) => {
  const image = product.productImages[0];
  const { removeItem } = useCart();

  // find the approriate category-label of the given product
  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category,
  )?.label;

  return (
    <div className="space-y-3 py-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Product cart image */}
          <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
            {image && typeof image === "string" ? (
              <Image
                src={image}
                alt={product.name}
                fill
                className="absolute object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-secondary">
                <ImageIcon
                  aria-hidden="true"
                  className="h-4 w-4 text-muted-foreground"
                />
              </div>
            )}
          </div>

          {/* Product cart information */}
          <div className="flex flex-col self-start">
            <span className="mb-1 line-clamp-1 text-sm font-medium">
              {product.name}
            </span>

            <span className="line-clamp-1 text-xs capitalize text-muted-foreground">
              {label}
            </span>

            <div className="mt-4 text-xs text-muted-foreground">
              <button
                // remove product from 'items' / cart state with function from custom hook
                onClick={() => removeItem(product.id)}
                className="flex items-center gap-0.5"
              >
                <X className="h-4 w-3" />
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-1 font-medium">
          <span className="ml-auto line-clamp-1 text-sm">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
