import React, { useEffect } from 'react';
import AOS from 'aos';
import './SpecificLoader.css';

function SpecificLoader() {
    useEffect(() => {
        AOS.init();
    }, [])

    return (
        <React.Fragment>
            <div className="custom fullpage-loader-holder">
                <div className="fullpage-loader">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SpecificLoader;