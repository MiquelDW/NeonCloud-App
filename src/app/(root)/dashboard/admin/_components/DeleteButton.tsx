"use client";

// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
// useMutation hook is used to create/update/delete data
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";
import { deleteProduct, deleteSeller } from "../action";

interface DeleteButtonProps {
  id: string;
  description: string;
  deleteOption: "product" | "seller";
}

const DeleteButton = ({ id, description, deleteOption }: DeleteButtonProps) => {
  const router = useRouter();
  // state variables keep track of dialogs state within group & private convos
  const [removeProductDialog, setRemoveProductDialog] =
    useState<boolean>(false);

  // destructure defined mutation function
  const { mutate: delProduct, isPending: isPendingProduct } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["delete-product"],
    // define mutation function that deletes a product
    mutationFn: deleteProduct,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  // destructure defined mutation function
  const { mutate: delSeller, isPending: isPendingSeller } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["delete-seller"],
    // define mutation function that deletes a seller
    mutationFn: deleteSeller,
    // refresh current route to fetch and display latest data if mutation function has successfully completed (without full page reload)
    onSuccess: () => router.refresh(),
  });

  const handleOnDelete = (id: string) => {
    if (deleteOption === "product") {
      delProduct(id);
    }
    if (deleteOption === "seller") {
      delSeller(id);
    }
  };

  return (
    <>
      <Button variant="destructive" className="h-7 w-7 p-1">
        <X className="h-5 w-5" onClick={() => setRemoveProductDialog(true)} />
      </Button>

      <AlertDialog
        open={removeProductDialog}
        onOpenChange={setRemoveProductDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel disabled={isPendingProduct || isPendingSeller}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleOnDelete(id)}
              disabled={isPendingProduct || isPendingSeller}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteButton;
