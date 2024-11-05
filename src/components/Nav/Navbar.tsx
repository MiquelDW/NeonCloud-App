import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import NavItems from "./NavItems";
import { Button, buttonVariants } from "../ui/button";
import Cart from "../Cart/Cart";
import Image from "next/image";
import { getLoggedInUser } from "@/data/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const Navbar = async () => {
  // retrieve logged in user that's using the navbar
  const user = await getLoggedInUser();

  // variable that determines if current logged in user is an admin
  // check if current user's email (if 'user' is not null / logged in) is equal to the admin's email address saved inside the '.env' file
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;

  return (
    <div className="sticky inset-x-0 top-0 z-50 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <nav className="relative">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center">
            {/* Left part of nav */}
            <div className="ml-4 flex lg:ml-0">
              <Link href="/">
                <Image
                  src="/neoncloud-logo.png"
                  alt="logo"
                  width={60}
                  height={60}
                  className="aspect-auto h-16 w-16 object-contain"
                />
              </Link>
            </div>

            <div className="z-50 hidden md:ml-8 md:block md:self-stretch">
              <NavItems />
            </div>

            {/* Right part of nav */}
            <div className="ml-auto flex items-center">
              <div className="flex flex-1 items-center justify-end space-x-6">
                {user ? (
                  <>
                    {user.seller === "approved" || isAdmin ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="relative"
                          >
                            <>
                              <Menu className="h-6 w-6 text-muted-foreground sm:hidden" />

                              <p className="hidden sm:flex">
                                {isAdmin ? "Admin Menu" : "Seller Menu"}
                              </p>
                            </>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-white" align="end">
                          <div className="flex w-full items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-0.5 leading-none">
                              <p className="text-sm font-medium text-black">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <DropdownMenuSeparator />

                          {/* show link if current logged in user is an admin */}
                          {isAdmin && (
                            <>
                              <DropdownMenuItem
                                asChild
                                className="cursor-pointer"
                              >
                                <Link
                                  href="/dashboard/admin"
                                  className={buttonVariants({
                                    size: "sm",
                                    variant: "ghost",
                                    className:
                                      "flex w-full text-center font-medium outline-2 hover:outline hover:outline-primary focus:outline focus:outline-primary focus-visible:outline focus-visible:outline-primary",
                                  })}
                                >
                                  Admin Dashboard
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />
                            </>
                          )}

                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                              href="/dashboard/seller"
                              className={buttonVariants({
                                size: "sm",
                                variant: "ghost",
                                className:
                                  "flex w-full text-center font-medium outline-2 hover:outline hover:outline-primary focus:outline focus:outline-primary focus-visible:outline focus-visible:outline-primary",
                              })}
                            >
                              Seller Dashboard
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="cursor-pointer p-0"
                            asChild
                          >
                            <div className="m-0 flex w-full items-center justify-center p-0">
                              <SignOutButton>
                                <div className="w-full rounded-md p-2 text-center font-medium outline-2 outline-primary hover:outline focus:outline focus-visible:outline">
                                  Sign out
                                </div>
                              </SignOutButton>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="relative"
                          >
                            <>
                              <Menu className="h-6 w-6 text-muted-foreground sm:hidden" />

                              <p className="hidden sm:flex">My account</p>
                            </>
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-white" align="end">
                          <div className="flex w-full items-center justify-center gap-2 p-2">
                            <div className="flex flex-col space-y-0.5 leading-none">
                              <p className="text-sm font-medium text-black">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem asChild className="cursor-pointer">
                            <Link
                              href={`/become-seller?email=${user.email}`}
                              className={buttonVariants({
                                size: "sm",
                                variant: "ghost",
                                className:
                                  "flex w-full text-center font-medium outline-2 hover:outline hover:outline-primary focus:outline focus:outline-primary focus-visible:outline focus-visible:outline-primary",
                              })}
                            >
                              Start selling
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            className="cursor-pointer p-0"
                            asChild
                          >
                            <div className="m-0 flex w-full items-center justify-center p-0">
                              <SignOutButton>
                                <div className="w-full rounded-md p-2 text-center font-medium outline-2 outline-primary hover:outline focus:outline focus-visible:outline">
                                  Sign out
                                </div>
                              </SignOutButton>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign in
                    </Link>

                    {/* visual seperator logged out user */}
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

                    <Link
                      href="/sign-up"
                      className={buttonVariants({
                        variant: "ghost",
                        className: "hidden sm:flex",
                      })}
                    >
                      Create account
                    </Link>

                    <span
                      className="hidden h-6 w-px bg-gray-200 sm:flex"
                      aria-hidden="true"
                    />
                  </>
                )}

                <div className="ml-4 flow-root lg:ml-6">
                  <Cart />
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    </div>
  );
};

export default Navbar;
