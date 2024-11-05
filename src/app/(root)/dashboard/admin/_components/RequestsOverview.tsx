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
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ChangeEvent, useState } from "react";
import ProductDescriptionButton from "./ProductDescriptionButton";
import StatusDropdown from "./StatusDropdown";

// 'Request' table type including the 'User' relation
type RequestWithUser = Prisma.RequestGetPayload<{
  include: {
    User: true;
  };
}>;
// predefine type of given 'props' object
interface RequestsOverviewProps {
  requests: RequestWithUser[];
}

const RequestsOverview = ({ requests }: RequestsOverviewProps) => {
  // state to track the search query
  const [searchTerm, setSearchTerm] = useState("");

  // filter the requests based on the given user input / search term
  const filteredRequests = requests.filter((request) =>
    request.User.email
      .toLocaleLowerCase()
      .includes(searchTerm.toLocaleLowerCase()),
  );

  // function to handle search input change
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="mb-10 mt-6 flex w-full px-5">
      <div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <h1 className="pt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Incoming requests
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
                  <TableHead className="hidden md:table-cell">User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right sm:text-left">
                    Status
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Creation date
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="bg-accent">
                    <TableCell>
                      <div className="m-0 w-20 justify-start p-0 text-sm font-medium sm:w-full">
                        <div className="truncate overflow-ellipsis">
                          {request.User.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <ProductDescriptionButton
                        productDescription={request.productDescription}
                      />
                    </TableCell>

                    <TableCell className="flex justify-end sm:justify-start">
                      {/* display current order status and update order status */}
                      <StatusDropdown
                        id={request.User.id}
                        status={request.User.seller}
                        changeStatus="seller"
                        requestId={request.id}
                      />
                    </TableCell>

                    <TableCell className="hidden lg:table-cell">
                      {format(request.createdAt, "dd/MM/yyyy")}
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

export default RequestsOverview;
