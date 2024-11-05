"use client";

import { buttonVariants } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import DeleteButton from "./DeleteButton";
import StatusDropdown from "./StatusDropdown";

// 'Product' table type including the 'User' relation
type ProductWithUser = Prisma.ProductGetPayload<{
  include: {
    User: true;
  };
}>;
// create a new type that modifies the 'price' field type to number
type ProductWithModifiedField = Omit<ProductWithUser, "price"> & {
  price: number;
};

// predefine type of given 'props' object
export interface ProductsOverviewProps {
  products: ProductWithModifiedField[];
}

const DESCRIPTION =
  "Please be aware that this action is irreversible. The product will be permanently deleted, and the seller will no longer be able to view and sell their product. The seller will also be notified of this action.";

const ProductsOverview = ({ products = [] }: ProductsOverviewProps) => {
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
          <div className="flex w-full items-center justify-between">
            <h1 className="pt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Incoming products
            </h1>

            <Input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-40 truncate overflow-ellipsis rounded border p-2 sm:w-56"
            />
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {/* Table of all paid products from last week */}
            <Table>
              {/* display column titles */}
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Seller</TableHead>
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
                      <Link
                        href={product.productFile}
                        target="_blank"
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "m-0 w-20 justify-start p-0 text-sm font-medium sm:w-full",
                        )}
                      >
                        <div className="truncate overflow-ellipsis">
                          {product.name}
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="flex justify-end sm:justify-start">
                      {/* display current order status and update order status */}
                      <StatusDropdown
                        id={product.id}
                        status={product.status}
                        changeStatus="product"
                      />
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

export default ProductsOverview;
