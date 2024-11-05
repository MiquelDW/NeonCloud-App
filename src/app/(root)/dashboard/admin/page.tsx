import { getLoggedInUser } from "@/data/user";
import Link from "next/link";
import db from "@/lib/db";
import ProductsOverview from "./_components/ProductsOverview";
import RequestsOverview from "./_components/RequestsOverview";
import SellersOverview from "./_components/SellersOverview";

const AdminDashboard = async () => {
  const user = await getLoggedInUser();
  // retrieve admin's email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  // return error page if user doesn't exist OR logged-in user is not allowed to view this page
  if (!user || user.email !== ADMIN_EMAIL) {
    return (
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
  }

  const products = await db.product.findMany({
    where: {
      terminated: false,
    },
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

  const requests = await db.request.findMany({
    // newest requests on top, oldest requests on the bottom
    orderBy: {
      createdAt: "desc",
    },
    // also fetch the related records of the requests product entries (SQL join syntax)
    include: {
      User: true,
    },
  });

  const approvedUsers = await db.user.findMany({
    where: {
      seller: "approved",
    },
    // also fetch the related records of the requests product entries (SQL join syntax)
    include: {
      Product: true,
    },
  });
  // convert prop 'price' of each product to type 'number'
  const retrievedApprovedUsers = approvedUsers.map((user) => {
    const productsPriceNumber = user.Product.map((product) => {
      return { ...product, price: Number(product.price) };
    });

    return { ...user, Product: productsPriceNumber };
  });

  return (
    <>
      <ProductsOverview products={retrievedProducts} />
      <SellersOverview users={retrievedApprovedUsers} />
      <RequestsOverview requests={requests} />
    </>
  );
};

export default AdminDashboard;
