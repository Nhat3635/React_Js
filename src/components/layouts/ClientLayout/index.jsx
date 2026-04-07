import { useEffect } from "react";
import { useLocation, Outlet} from "react-router-dom";
import Header from "../../ui/client/header";
import Footer from "../../ui/client/footer";

const ClientLayout = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default ClientLayout;