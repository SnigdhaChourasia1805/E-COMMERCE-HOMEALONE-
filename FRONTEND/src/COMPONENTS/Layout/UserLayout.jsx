import { Outlet } from "react-router-dom";
// import { Home } from "../../PAGES/HomePage";
import { Footer } from "../Common/Footer";
import Header from "../Common/Header";

 const UserLayout = () => {
    return (
      <div>
        <Header />

        {/* <Home /> */}
        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    );
  };

  export default UserLayout;
  