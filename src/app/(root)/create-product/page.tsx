"use client";

import * as z from "zod";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
// resolver function validates the form data against the defined schema whenever the form is submitted or its values change
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createProductFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductCategories } from "@prisma/client";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DropZoneComponent from "./_components/DropZoneComponent";
// useMutation hook is used to create/update/delete data
import { useMutation } from "@tanstack/react-query";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/hooks/use-toast";
import { saveProduct } from "./action";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";

// object that maps a 'ProductCategories' prop to its corresponding category label
// 'Record' is a utility type that constructs an object type with a set of properties 'K' of type 'T'
// the keys are of type 'ProductCategories', the values of those keys are of type 'string'
const LABEL_MAP: Record<keyof typeof ProductCategories, string> = {
  icons: "Icons",
  ui_kits: "UI kits",
};

const CreateProduct = () => {
  const router = useRouter();
  const { toast } = useToast();
  // keeps track if content of dropdown menu is displayed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // state variable keeps track of current selected product category
  const [category, setCategory] =
    useState<(typeof LABEL_MAP)["ui_kits" | "icons"]>();
  // state var that holds the uploaded img url
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  // state var that holds the uploaded file that the user wants to sell
  const [uploadedFile, setUploadedFile] = useState<string>("");

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the form data based on the 'createProductFormSchema'
  const form = useForm<z.infer<typeof createProductFormSchema>>({
    // validate submitted or changed form data against 'createProductFormSchema'
    resolver: zodResolver(createProductFormSchema),
    // specify initial values for form fields
    defaultValues: {
      name: "",
      productDetails: "",
      price: "1",
      category: undefined,
      productFile: "",
      productImages: [],
    },
  });

  const handleInputChangeCat = (input: keyof typeof LABEL_MAP) => {
    setCategory(LABEL_MAP[input]);
    // update the FormField component "content" with the retrieved 'value'
    form.setValue("category", input);
    form.trigger("category");
  };

  const handleInputChangeImg = (input: string, deleteImg: boolean = false) => {
    if (!deleteImg) {
      setUploadedImages((uploadedImgs) => [...uploadedImgs, input]);
    } else {
      // remove given 'input' from the array state variable 'uploadedImages'
      setUploadedImages(() => uploadedImages.filter((img) => img !== input));
    }

    // update the FormField component "productImages" with the retrieved 'value'
    form.setValue("productImages", [...uploadedImages, input]);
    form.trigger("productImages");
  };

  const handleInputChangeFile = (input: string) => {
    setUploadedFile(input);
    // console.log(input);
    // update the FormField component "productFile" with the retrieved 'value'
    form.setValue("productFile", input);
    form.trigger("productFile");
  };

  const { mutate: saveNewProduct, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["save-product"],
    // save the user's defined phone case configuration in db
    mutationFn: async (values: z.infer<typeof createProductFormSchema>) => {
      await saveProduct(values);
    },
    // fire this func if an error occurs during execution of mutation function
    onError: (err) => {
      toast({
        title: "Something went wrong",
        description: err
          ? err.message
          : "There was an error on our end. Please try again.",
        variant: "destructive",
      });
    },
    // fire this func if mutation function has successfully completed
    onSuccess: () => {
      toast({
        title: "Product successfully created",
        description:
          "Your product has been successfully created. We will proceed to verify it as soon as possible.",
      });
      router.refresh();
    },
  });

  const handleSubmit = (values: z.infer<typeof createProductFormSchema>) => {
    console.log(
      values.name,
      values.productDetails,
      values.price,
      values.category,
      values.productFile,
      values.productImages,
    );

    // save the new product from user in db
    saveNewProduct(values);

    form.reset();
    setCategory(undefined);
    setUploadedFile("");
    setUploadedImages([]);
  };

  return (
    <MaxWidthWrapper className="max-w-[900px] pb-4">
      <p className="my-6 text-base font-medium text-muted-foreground">
        Submit your product for sale on our platform. Our team will review and
        verify your submission promptly to ensure it meets our standards. Thank
        you for choosing to sell with us!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Product name:</FormLabel>
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

          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="productDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Product details:</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe your product..."
                    className="h-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Price:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Provide product price..."
                    min="1" // prevents negative values
                    type="number"
                    step="0.01"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="category"
            render={() => (
              <FormItem>
                <FormLabel className="text-base">Category:</FormLabel>
                <FormControl>
                  <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center justify-between rounded-lg border px-3">
                        <Button
                          variant="ghost"
                          className="w-full justify-start pl-0 font-normal hover:bg-white"
                        >
                          {category || "Select a category"}
                        </Button>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted-foreground transition-all hover:cursor-pointer",
                            {
                              "-rotate-180": isOpen,
                            },
                          )}
                        />
                      </div>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-52" align="start">
                      {Object.keys(LABEL_MAP).map((category, i) => {
                        // ensure ts knows that category is one of the keys of LABEL_MAP to avoid type issues
                        const typedCategory =
                          category as keyof typeof LABEL_MAP;

                        return (
                          <DropdownMenuItem
                            key={i}
                            onClick={() => handleInputChangeCat(typedCategory)}
                          >
                            {LABEL_MAP[typedCategory]}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="productFile"
            render={() => (
              <FormControl>
                <FormItem>
                  <FormLabel className="text-base">Product File:</FormLabel>
                  {uploadedFile ? (
                    <p className="p-0 text-sm text-muted-foreground">
                      You can submit a maximum of 1 product file
                    </p>
                  ) : (
                    <>
                      <p className="p-0 text-sm text-muted-foreground">
                        Upload the product that you would like to sell
                      </p>

                      <DropZoneComponent
                        handleInputChange={handleInputChangeFile}
                        // allowPdf
                      />
                    </>
                  )}

                  {uploadedFile && (
                    <div className="flex h-4 w-[400px] items-center gap-1">
                      <Button
                        variant="ghost"
                        className="rounded-full p-0 hover:bg-white"
                        type="button"
                        onClick={() => handleInputChangeFile("")}
                      >
                        <X className="h-5 w-5 rounded-full p-0.5 hover:bg-accent-foreground/10" />
                      </Button>

                      <Link
                        href={uploadedFile}
                        target="_blank"
                        className={cn(
                          buttonVariants({
                            variant: "link",
                            className:
                              "m-0 inline-block h-5 truncate overflow-ellipsis p-0",
                          }),
                        )}
                      >
                        {uploadedFile}
                      </Link>
                    </div>
                  )}

                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />

          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="productImages"
            render={() => (
              <FormControl>
                <FormItem>
                  <FormLabel className="text-base">Product Images:</FormLabel>
                  {uploadedImages.length >= 3 ? (
                    <p className="p-0 text-sm text-muted-foreground">
                      You can submit a maximum of 3 images!
                    </p>
                  ) : (
                    <>
                      <p className="p-0 text-sm text-muted-foreground">
                        Upload your product's storefront images that users get
                        to see
                      </p>

                      <DropZoneComponent
                        handleInputChange={handleInputChangeImg}
                      />
                    </>
                  )}

                  <div className="flex w-[400px] flex-col justify-center gap-2">
                    {uploadedImages &&
                      uploadedImages.map((uploadedImg, i) => (
                        <div
                          key={i}
                          className="flex h-4 w-full items-center gap-1"
                        >
                          <Button
                            variant="ghost"
                            className="rounded-full p-0 hover:bg-white"
                            type="button"
                            onClick={() =>
                              handleInputChangeImg(uploadedImg, true)
                            }
                          >
                            <X className="h-5 w-5 rounded-full p-0.5 hover:bg-accent-foreground/10" />
                          </Button>

                          <Link
                            href={uploadedImg}
                            target="_blank"
                            className={cn(
                              buttonVariants({
                                variant: "link",
                                className:
                                  "m-0 inline-block h-5 truncate overflow-ellipsis p-0",
                              }),
                            )}
                          >
                            {uploadedImg}
                          </Link>
                        </div>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              </FormControl>
            )}
          />

          <DialogFooter className="mt-2">
            <Button
              type="submit"
              className="w-full sm:w-32"
              disabled={isPending}
            >
              {isPending ? "Creating product..." : "Create product"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
};

export default CreateProduct;
