"use client";

import { Prisma, Product } from "@prisma/client";
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
import ViewProducts from "./ViewProducts";
import DeleteButton from "./DeleteButton";

const DESCRIPTION =
  "Please be aware that this action is irreversible. The user will lose its selling status, and will no longer be able to view and sell its products. The user will also be notified of this action.";

// define a custom type that overrides the Product 'price' field
export type ProductWithNumberPrice = Omit<Product, "price"> & {
  price: number;
};

// define the 'UserWithProduct' type, override the 'Product' field with the custom product type that has the correct typing for the 'price' field
type UserWithProduct = Omit<
  Prisma.UserGetPayload<{
    include: { Product: true };
  }>,
  "Product"
> & {
  Product: ProductWithNumberPrice[];
};

// predefine type of given 'props' object
export interface SellersOverviewProps {
  users: UserWithProduct[];
}

const SellersOverview = ({ users }: SellersOverviewProps) => {
  // console.log(users);
  // state to track the search query
  const [searchTerm, setSearchTerm] = useState("");

  // filter the requests based on the given user input / search term
  const filteredUsers = users.filter((user) =>
    user.email.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
  );

  // function to handle search input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="mt-6 flex w-full px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="pt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Sellers
            </h1>

            <Input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-40 truncate overflow-ellipsis rounded border p-2 sm:w-56"
            />
          </div>

          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {/* Table of all paid products from last week */}
            <Table className="overflow-hidden">
              {/* display column titles */}
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead className="text-right sm:text-left">
                    Products
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Creation date
                  </TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Delete seller
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="bg-accent">
                    <TableCell>
                      <div className="m-0 w-20 justify-start p-0 text-sm font-medium sm:w-full">
                        <div className="truncate overflow-ellipsis">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="flex justify-end sm:justify-start">
                      <ViewProducts products={user.Product} />
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      {format(user.createdAt, "dd/MM/yyyy")}
                    </TableCell>

                    <TableCell className="hidden text-right sm:table-cell">
                      <DeleteButton
                        deleteOption="seller"
                        description={DESCRIPTION}
                        id={user.id}
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

export default SellersOverview;
