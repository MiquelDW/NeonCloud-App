"use client";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import DeleteProductButton from "../../admin/_components/DeleteButton";
import { ProductsOverviewProps } from "../../admin/_components/ProductsOverview";
import HoverCardProduct from "./HoverCardProduct";
import { Plus } from "lucide-react";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteButton from "../../admin/_components/DeleteButton";

const DESCRIPTION =
  "Please be aware that this action is irreversible. The product will be permanently deleted, and you will no longer be able to view and sell this product. Our admins will also be notified of this action.";

// extend existing interface 'ProductsOverviewProps' with the extra prop 'userId'
interface ProductOverviewSellerProps extends ProductsOverviewProps {
  userId: string;
}

const ProductsOverviewSeller = ({
  products,
  userId,
}: ProductOverviewSellerProps) => {
  const router = useRouter();
  // state to track the search query
  const [searchTerm, setSearchTerm] = useState("");

  // filter the products based on the given user input / search term
  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );

  // function to handle search input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex w-full px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-4">
          <div className="mt-5 flex w-full items-end justify-between gap-4 sm:items-center">
            <h1 className="pt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Your products
            </h1>

            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
              <Tooltip>
                <TooltipTrigger>
                  <div
                    className="flex cursor-pointer justify-center hover:opacity-80 md:flex-shrink-0"
                    onClick={() => router.push("/create-product")}
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-900">
                      <Plus className="h-[20px] w-[20px]" />
                    </div>
                  </div>
                </TooltipTrigger>

                <TooltipContent>
                  <p>Create new product</p>
                </TooltipContent>
              </Tooltip>

              <Input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-40 overflow-ellipsis rounded border p-2 sm:w-56"
              />
            </div>
          </div>

          <ScrollArea className="h-[450px] w-full rounded-md border p-4">
            {/* Table of all paid products from last week */}
            <Table>
              {/* display column titles */}
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead>Productname</TableHead>
                  <TableHead className="text-right sm:text-left">
                    Status
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Creation date
                  </TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Delete product
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id} className="bg-accent">
                    <TableCell className="hidden md:table-cell">
                      <div className="text-sm font-medium">
                        {product.User.email}
                      </div>
                    </TableCell>

                    <TableCell>
                      <HoverCardProduct
                        productFile={product.productFile}
                        productName={product.name}
                        userId={userId}
                        productId={product.id}
                      />
                    </TableCell>

                    <TableCell>
                      {/* display current order status and update order status */}
                      <div className="text-right text-sm font-medium sm:text-left">
                        {product.status}
                      </div>
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      {format(product.createdAt, "dd/MM/yyyy")}
                    </TableCell>

                    <TableCell className="hidden text-right sm:table-cell">
                      <DeleteButton
                        id={product.id}
                        description={DESCRIPTION}
                        deleteOption="product"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ProductsOverviewSeller;
