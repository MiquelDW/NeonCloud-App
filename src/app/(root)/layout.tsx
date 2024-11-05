import Footer from "@/components/Footer";
import Navbar from "@/components/Nav/Navbar";

// Layout Component that wraps around all routes inside route group 'root'
// it ensures a consistent layout for all routes within the route group 'root'
// this Layout component will be given to the Root Layout component as a child
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />

      {/* min-height will be: 100vh - Navbar height - Footer height - 21px */}
      <main className="relative flex min-h-[calc(100vh-64px-5rem-21px)] flex-col">
        <div className="flex-1">{children}</div>
      </main>

      <Footer />
    </>
  );
};

export default Layout;
