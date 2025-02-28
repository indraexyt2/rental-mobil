import Navbar from "@/components/layout/navbar.jsx";
import {Outlet} from "react-router-dom";
import Footer from "@/components/layout/footer.jsx";

const MainLayout = () => {
    return (
        <div className={'relative'}>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout;