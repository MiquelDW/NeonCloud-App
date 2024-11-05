"use client";

import * as z from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/hooks/use-toast";
// useMutation hook is used to create/update/delete data
import { useMutation } from "@tanstack/react-query";
import { changeProductNameFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
import { changeProductName } from "../action";
import { DialogFooter } from "@/components/ui/dialog";

const HoverCardProduct = ({
  productFile,
  productName,
  userId,
  productId,
}: {
  productFile: string;
  productName: string;
  userId: string;
  productId: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the form data based on the 'changeProductNameFormSchema'
  const form = useForm<z.infer<typeof changeProductNameFormSchema>>({
    // validate submitted or changed form data against 'changeProductNameFormSchema'
    resolver: zodResolver(changeProductNameFormSchema),
    // specify initial values for form fields
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValue("name", productName);
    form.trigger("name");
  }, [productName]);

  const { mutate: changeCurrentProductName, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["change-product-name"],
    // save the user's defined phone case configuration in db
    mutationFn: async ({
      values,
      userId,
      productId,
    }: {
      values: z.infer<typeof changeProductNameFormSchema>;
      userId: string;
      productId: string;
    }) => {
      await changeProductName({ values, userId, productId });
    },
    // fire this func if an error occurs during execution of mutation function
    onError: ({ message }) => {
      toast({
        title: "Something went wrong",
        description: message
          ? message
          : "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    // fire this func if mutation function has successfully completed
    onSuccess: () => {
      toast({
        title: "Product name successfully changed",
        description:
          "You have successfully changed your product name! You can view the changes immediately.",
      });
      router.refresh();
    },
  });

  const handleSubmit = (
    values: z.infer<typeof changeProductNameFormSchema>,
  ) => {
    console.log(values.name);

    // save the new product name
    changeCurrentProductName({ values, userId, productId });

    form.reset();
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Link
          href={productFile}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "link" }),
            "m-0 p-0 text-sm font-medium",
          )}
        >
          {productName}
        </Link>
      </HoverCardTrigger>

      <HoverCardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              // manage the state and validation of this form field
              control={form.control}
              // specify which field from the schema it's dealing with
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Change product name:</FormLabel>
                  <FormControl>
                    <Input
                      // 'field' object contains the necessary props and methods to connect the input field with react-hook-form's state management
                      {...field}
                      placeholder="Provide product name..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="">
              <Button
                type="submit"
                variant="outline"
                className="w-[150px]"
                disabled={isPending}
              >
                {isPending ? "Changing name..." : "Change name"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardProduct;
