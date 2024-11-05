import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="grid min-h-screen grid-cols-1">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-16 text-center">
          <h1 className="text-3xl font-bold text-[#2E2A47] dark:text-white">
            Create your account!
          </h1>
          <p className="text-base text-[#7E8CA0]">
            Create your account here to join the others🎉
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center">
          {/* only show sign-up form when Clerk object has fully loaded */}
          <ClerkLoaded>
            <SignUp />
          </ClerkLoaded>
          {/* show this loading state while Clerk object is loading */}
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
    </div>
  );
}
