import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router";

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
      <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
