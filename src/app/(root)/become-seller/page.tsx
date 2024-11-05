"use client";

import * as z from "zod";
// hook that handles form state and validation
import { useForm } from "react-hook-form";
// resolver function validates the form data against the defined schema whenever the form is submitted or its values change
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
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
import { ProductCategories, User } from "@prisma/client";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { useToast } from "@/hooks/use-toast";
// useMutation hook is used to create/update/delete data
import { useMutation } from "@tanstack/react-query";
import { becomeSellerFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
// define a router obj to programmatically redirect users to the given route
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendRequest } from "./action";
import { useEffect, useState } from "react";

// object that maps a 'ProductCategories' prop to its corresponding category label
// 'Record' is a utility type that constructs an object type with a set of properties 'K' of type 'T'
// the keys are of type 'ProductCategories', the values of those keys are of type 'string'
const LABEL_MAP: Record<keyof typeof ProductCategories, string> = {
  icons: "Icons",
  ui_kits: "UI kits",
};

interface BecomeSellerPageProps {
  // 'searchParams' prop contains dynamic query parameters from the current URL
  searchParams: {
    // use index signature to tell TS that 'searchParams' obj can have any number of properties, each with a key of union type string | string[] | undefined
    // index signatures allow you to define the types for properties of an object when you don't know the exact prop names
    [key: string]: string | string[] | undefined;
  };
}

const BecomeSellerPage = ({ searchParams }: BecomeSellerPageProps) => {
  const email = searchParams.email as string;
  const router = useRouter();
  const { toast } = useToast();
  // keeps track if content of dropdown menu is displayed
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // state variable keeps track of current selected product category
  const [category, setCategory] =
    useState<(typeof LABEL_MAP)["ui_kits" | "icons"]>();

  // set up the form with type inference and validation (using zod)
  // zod uses TS to infer the type of the form data based on the 'becomeSellerFormSchema'
  const form = useForm<z.infer<typeof becomeSellerFormSchema>>({
    // validate submitted or changed form data against 'becomeSellerFormSchema'
    resolver: zodResolver(becomeSellerFormSchema),
    // specify initial values for form fields
    defaultValues: {
      email: "",
      productDetails: "",
      category: undefined,
    },
  });

  useEffect(() => {
    form.setValue("email", email);
    form.trigger("email");
  }, [email]);

  const handleInputChangeCat = (input: keyof typeof LABEL_MAP) => {
    setCategory(LABEL_MAP[input]);
    // update the FormField component "content" with the retrieved 'value'
    form.setValue("category", input);
    form.trigger("category");
  };

  const handleSubmit = (values: z.infer<typeof becomeSellerFormSchema>) => {
    console.log(values.email, values.productDetails, values.category);

    // save the new request from user in db
    sendNewRequest(values);

    form.reset();
    setCategory(undefined);
  };

  const { mutate: sendNewRequest, isPending } = useMutation({
    // mutationKey is useful for caching and invalidation
    mutationKey: ["send-request"],
    // save the user's defined phone case configuration in db
    mutationFn: async (values: z.infer<typeof becomeSellerFormSchema>) => {
      await sendRequest(values);
    },
    // fire this func if an error occurs during execution of mutation function
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "You cannot send a request again!",
        variant: "destructive",
      });
      // you have to do this, otherwise you get field error from zod
      form.setValue("email", email);
      form.trigger("email");
    },
    // fire this func if mutation function has successfully completed
    onSuccess: () => {
      toast({
        title: "Request successfully sent",
        description:
          "Your request has been successfully sent. We will proceed to verify your request as soon as possible.",
      });

      // you have to do this, otherwise you get field error from zod
      form.setValue("email", email);
      form.trigger("email");
      router.refresh();
    },
  });

  return (
    <MaxWidthWrapper className="mt-16 max-w-[900px] pb-4">
      <p className="my-6 text-base font-medium text-muted-foreground">
        Thank you for your interest in becoming a seller on our platform! Submit
        your details below, and our team will promptly review your request to
        ensure it aligns with our quality standards. We're excited to
        collaborate with you and appreciate your choice to partner with us!
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            // manage the state and validation of this form field
            control={form.control}
            // specify which field from the schema it's dealing with
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Email:</FormLabel>
                <FormControl>
                  <Input
                    // 'field' object contains the necessary props and methods to connect the input field with react-hook-form's state management
                    {...field}
                    placeholder="Provide email..."
                    value={email}
                    disabled
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
                    placeholder="Briefly describe the types of products you want to sell...."
                    className="h-[150px]"
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

          <DialogFooter className="mt-2">
            <Button
              type="submit"
              className="w-full sm:w-40"
              disabled={isPending}
            >
              {isPending ? "Sending request..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </MaxWidthWrapper>
  );
};

export default BecomeSellerPage;
