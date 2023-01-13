import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ModalSearch from "../components/Modal/ModalSearch";
import ModalMenu from "../components/Modal/ModalMenu";
import Scrollup from "../components/Scrollup/Scrollup";

class Layout2 extends React.Component {
    render() {
        const {children, title, subpage, page} = this.props
        return(
            <div className="main">
                <Header />
                <Breadcrumb title={title} subpage={subpage} page={page}/>
                <div>
                    {children}
                </div>
                <Footer />
                <ModalSearch/>
                <ModalMenu/>
                <Scrollup/>
            </div>
        )
    }
}
export default Layout2;