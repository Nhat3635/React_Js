import Header from "../../ui/client/header";
import {Outlet} from "react-router-dom";
import Footer from "../../ui/client/footer";
const ClientLayout = () =>{
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}
export default ClientLayout;