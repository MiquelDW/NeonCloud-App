"use client";

// define a router obj to programmatically redirect users to the given route
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
// useMutation hook is used to create/update/delete data
import { cn } from "@/lib/utils";
import { Status } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import { deleteRequest } from "../action";

const DeleteRequestButton = ({
  status,
  isActive,
  requestId,
  userId,
}: {
  status: Status;
  isActive: boolean;
  requestId: string;
  userId: string;
}) => {
  const router = useRouter();
  // state variables keep track of dialogs state within group & private convos
  const [removeProductDialog, setRemoveProductDialog] =
    useState<boolean>(false);

  // destructure defined mutation function
  const { mutate, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: [`delete-request-${status}`],
    // define mutation function that deletes a product
    mutationFn: deleteRequest,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  return (
    <>
      <div
        className={cn(
          "flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100",
          {
            // add classname if current 'statusEnum' is equal to given 'status' (from DB)
            "bg-zinc-100": isActive,
          },
        )}
        onClick={() => setRemoveProductDialog(true)}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4 text-primary",
            // conditionally add classname based on whether current 'status' is active or not
            isActive ? "opacity-100" : "opacity-0",
          )}
        />
        {/* display current option */}
        {status === "approved" ? "Approve" : "Deny"}
      </div>

      <AlertDialog
        open={removeProductDialog}
        onOpenChange={setRemoveProductDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {status === "approved" ? "approve" : "deny"} this user{" "}
              {status === "approved" ? "as a seller" : "from becoming a seller"}
              ? The user will be notified of this action.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => mutate({ status, requestId, userId })}
              disabled={isPending}
            >
              {status === "approved" ? "Approve" : "Deny"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteRequestButton;
