import { getLoggedInUser } from "@/data/user";
import db from "@/lib/db";
import Link from "next/link";
import ProductsOverviewSeller from "./_components/ProductsOverviewSeller";

const SellerDashboard = async () => {
  const user = await getLoggedInUser();
  // retrieve admin's email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  // retrieve all products of the corresponding user / seller
  const products = await db.product.findMany({
    where: { userId: user?.id, terminated: false },
    // newest products on top, oldest products on the bottom
    orderBy: {
      createdAt: "desc",
    },
    // also fetch the related records of the retrieved product entries (SQL join syntax)
    include: {
      User: true,
    },
  });
  // convert prop 'price' of each product to type 'number'
  const retrievedProducts = products.map((product) => {
    return { ...product, price: Number(product.price) };
  });

  const contentError = (
    <div className="mt-24 flex w-full justify-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-xl font-semibold">
          You are not allowed to view this page.
        </h3>
        <p>
          Click{" "}
          <Link
            href="/products"
            className="underline underline-offset-2 hover:text-primary"
          >
            here
          </Link>{" "}
          to view our products or return to the{" "}
          <Link
            href="/"
            className="underline underline-offset-2 hover:text-primary"
          >
            home
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );

  if (user) {
    if (user.seller === "approved" || user.email === ADMIN_EMAIL) {
      return (
        <ProductsOverviewSeller products={retrievedProducts} userId={user.id} />
      );
    } else {
      // return error page if user doesn't exists
      return contentError;
    }
  } else {
    // return error page if logged-in user is not allowed to view this page
    return contentError;
  }
};

export default SellerDashboard;
