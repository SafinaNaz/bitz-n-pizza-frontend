import React from "react";

const Banner = () => {
    return (
        <>
            <div className="banner">
                <div className="container">
                    <div className="main-banner">
                        <h1>
                            Bake the rarest NFT Pizza
                        </h1>
                        <p>
                            To take home the Rarity Reward
                        </p>
                    </div>
                </div>
            </div>
            <div className="banner2">
                <div className="container-fluid">
                    <div className="about-banner">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="banner-image">
                                    <img alt = "pizza" className="img-fluid" src="images/createpizzaimg.png" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="bangs">
                                    <div className="banner-content">
                                        <span>1.</span> <p>Create pizza</p>
                                    </div>
                                    {/* <div className="swap">
                                        <img className="img-fluid" src="images/Arrow Path.svg" />
                                    </div> */}
                                    <div className="cont">
                                        <span>2.</span> <p>Customize</p>
                                    </div>
                                    <div className="cont">
                                        <span>3.</span> <p>Compete for Rarity Reward</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Banner;