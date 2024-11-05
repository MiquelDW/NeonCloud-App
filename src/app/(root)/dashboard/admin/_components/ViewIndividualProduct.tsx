import { ProductWithNumberPrice } from "./SellersOverview";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/utils";

const ViewIndividualProduct = ({
  product,
}: {
  product: ProductWithNumberPrice;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100">
          <div className="truncate overflow-ellipsis">{product.name}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="p-5">
        <DialogHeader>
          <DialogTitle className="mb-2">Product</DialogTitle>
        </DialogHeader>

        <div className="flex w-full justify-between">
          <p className="font-medium text-zinc-900">{product.name}</p>
          <p className="font-medium text-zinc-900">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="text-muted-foreground">{product.description}</div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewIndividualProduct;
