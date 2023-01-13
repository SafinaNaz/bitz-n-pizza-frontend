import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ModalSearch from "../components/Modal/ModalSearch";
import ModalMenu from "../components/Modal/ModalMenu";
import Scrollup from "../components/Scrollup/Scrollup";

class Layout1 extends React.Component {
    render() {
        const { children } = this.props;
        return(
            <div className="main">
                <Header />
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
export default Layout1;