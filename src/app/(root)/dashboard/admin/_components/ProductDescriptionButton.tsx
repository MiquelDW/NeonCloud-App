import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductDescriptionButton = ({
  productDescription,
}: {
  productDescription: string;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="m-0 max-w-36 justify-start p-0">
          <div className="truncate overflow-ellipsis text-left">
            {productDescription}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-5">Product description</DialogTitle>
          <DialogDescription className="text-base">
            {productDescription}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDescriptionButton;
