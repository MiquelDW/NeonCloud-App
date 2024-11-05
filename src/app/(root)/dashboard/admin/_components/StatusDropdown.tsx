"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
// define a router obj to programmatically redirect users to the given route
import { Status } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
// useMutation hook is used to create/update/delete data
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { changeProductStatus, changeSellerStatus } from "../action";
import DeleteRequestButton from "./DeleteRequestButton";

// object that maps a 'Status' prop to its corresponding category label
// 'Record' is a utility type that constructs an object type with a set of properties 'K' of type 'T'
// the keys are of type 'Status', the values of those keys are of type 'string'
const LABEL_MAP: Record<keyof typeof Status, string> = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
};

const StatusDropdown = ({
  id,
  // default value will be "pending"
  status,
  changeStatus,
  requestId,
}: {
  id: string;
  status: Status;
  changeStatus: "product" | "seller";
  requestId?: string;
}) => {
  const router = useRouter();
  // keeps track if content of dropdown menu is displayed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // destructure defined mutation function
  const { mutate: changeTheProductStatus } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["change-product-status"],
    // define mutation function that updates product status
    mutationFn: changeProductStatus,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  // destructure defined mutation function
  const { mutate: changeTheSellerStatus } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["change-seller-status"],
    // define mutation function that updates seller status
    mutationFn: changeSellerStatus,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  const handleOnClick = ({
    id,
    newStatus,
  }: {
    id: string;
    newStatus: Status;
  }) => {
    if (changeStatus === "product") {
      changeTheProductStatus({
        id,
        newStatus,
      });
    }

    if (changeStatus === "seller") {
      changeTheSellerStatus({
        id,
        newStatus,
      });
    }
  };

  return (
    // display dropdown menu to the user
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      {/* button that triggers the dropdown menu */}
      <DropdownMenuTrigger
        // change the default rendered element to the one passed as a child, merging their props and behavior
        asChild
      >
        <Button
          variant="outline"
          className="md:w-42 flex w-32 items-center justify-between sm:w-36"
        >
          {/* display currently active order status */}
          {LABEL_MAP[status]}
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-all hover:cursor-pointer",
              {
                "-rotate-180": isOpen,
              },
            )}
          />
        </Button>
      </DropdownMenuTrigger>

      {/* this component pops out when the dropdown menu is triggered */}
      <DropdownMenuContent className="flex flex-col p-0">
        {/* display all product status options (map through enum 'Status') */}
        {Object.keys(Status).map((statusEnum) => {
          // console.log(statusEnum);
          console.log(changeStatus);

          if (changeStatus === "product") {
            return (
              <DropdownMenuItem
                key={`${statusEnum}-${changeStatus}`}
                className={cn(
                  "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
                  {
                    // add classname if current 'statusEnum' is equal to given 'status' (from DB)
                    "bg-zinc-100": statusEnum === status,
                  },
                )}
                onClick={() =>
                  handleOnClick({ id, newStatus: statusEnum as Status })
                }
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-primary",
                    // conditionally add classname based on whether current 'status' is active or not
                    statusEnum === status ? "opacity-100" : "opacity-0",
                  )}
                />
                {/* display current 'statusEnum' option */}
                {LABEL_MAP[statusEnum as Status]}
              </DropdownMenuItem>
            );
          }

          if (changeStatus === "seller") {
            if ((statusEnum as Status) === "pending") {
              return (
                <DropdownMenuItem
                  key={`${statusEnum}-${changeStatus}`}
                  className={cn(
                    "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
                    {
                      // add classname if current 'statusEnum' is equal to given 'status' (from DB)
                      "bg-zinc-100": statusEnum === status,
                    },
                  )}
                  onClick={() =>
                    handleOnClick({ id, newStatus: statusEnum as Status })
                  }
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary",
                      // conditionally add classname based on whether current 'status' is active or not
                      statusEnum === status ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {/* display current 'statusEnum' option */}
                  {LABEL_MAP[statusEnum as Status]}
                </DropdownMenuItem>
              );
            } else {
              return (
                <DeleteRequestButton
                  key={`${statusEnum}-${changeStatus}`}
                  status={statusEnum as Status}
                  isActive={statusEnum === status}
                  requestId={requestId!}
                  userId={id}
                />
              );
            }
          }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
