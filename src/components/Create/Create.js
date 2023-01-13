import React from "react";

const Create = () => {
    return (
        <>
            <div className="author-area">
                <div className="container-fluid">
                    <div className="assemble">
                    </div>
                </div>
                <div className="container assemble-pizza-containerr">
                    <div className="assemble-pizza">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="pizza-desc">
                                    <h4>
                                        1. Buy Ingredients
                                    </h4>
                                    <div className="pizza1">
                                        <img alt="s_img" className="img-fluid" src="images/buy-1.png" />
                                    </div>
                                    <div className="pizza2">
                                        <img  alt="s_img" className="img-fluid" src="images/Icon awesome-plus.svg" />
                                    </div>
                                    <div className="pizza3">
                                        <img alt="s_img"  className="img-fluid" src="images/buy-2.png" />
                                    </div>
                                    <div className="pizza2">
                                        <img alt="s_img"  className="img-fluid" src="images/Icon awesome-plus.svg" />
                                    </div>
                                    <div className="pizza5">
                                        <img alt="s_img"  className="img-fluid" src="images/buy-3.png" />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-2">
                                <div className="arrow1">
                                    <img className="img-fluid" src="images/Image 28.png" />
                                </div> 
                                 <div className="arrow2">
                                    <img className="img-fluid" src="images/Image 30.png" />
                                </div>
                                <div className="arrow3">
                                    <img className="img-fluid" src="images/Image 29.png" />
                                </div>
                            </div> */}
                            <div className="col-md-4">
                                <div className="pizza-desc">
                                    <h4>
                                        2. Assemble Pizza in Pizza Cave
                                    </h4>
                                    <div className="pizza6">
                                        <img  alt="s_img" className="img-fluid" src="images/assamblepizza.png" />
                                    </div>
                                </div>
                            </div>
                            {/* <div className="col-md-2">
                                <div className="arrow">
                                    <img className="img-fluid" src="images/Image 31.png" />
                                </div>
                            </div> */}
                            <div className="col-md-4">
                                <div className="pizza-desc">
                                    <h4>
                                        3. Bake
                                    </h4>
                                    <div className="pizza6 bake">
                                        <img  alt="s_img" className="img-fluid" src="images/bakeimg.png" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-pizzi">
                <div className="container">
                    <div className="pizzi-desc">
                        <h4> Buy Ingredients</h4>
                        <div className="about-pizzi">
                            <div className="pizzi1">
                                <img alt="s_img"  className="img-fluid" src="images/buy-1.png" />
                            </div>
                            <div className="pizzi2">
                                <img alt="s_img"  className="img-fluid" src="images/Icon awesome-plus.svg" />
                            </div>
                            <div className="pizzi3">
                                <img alt="s_img"  className="img-fluid" src="images/buy-2.png" />
                            </div>
                            <div className="pizzi2">
                                <img alt="s_img"  className="img-fluid" src="images/Icon awesome-plus.svg" />
                            </div>
                            <div className="pizzi4">
                                <img alt="s_img"  className="img-fluid" src="images/buy-3.png" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="pizzi-arrow">
                        <div className="pizzi-arrow3">
                            <img className="img-fluid" src="images/Image 29.png" />
                        </div>
                        <div className="pizzi-arrow2">
                            <img className="img-fluid" src="images/Image 30.png" />
                        </div>
                        <div className="pizzi-arrow1">
                            <img className="img-fluid" src="images/Image 28.png" />
                        </div>
                    </div> */}
                    <div className="pizzi-description">
                        <h4>  Assemble Pizza</h4>
                        <div className="about-pizzi">
                            <div className="pizzi8">
                                <img alt="s_img"  className="img-fluid" src="images/assamblepizza.png" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="pizzi-arrow4">
                        <img className="img-fluid" src="images/Image 31.png" />
                    </div> */}
                    <div className="pizzi-desc">
                        <h4>Bake</h4>
                        <div className="about-pizzi">
                            <div className="pizzi8">
                                <img alt="s_img"  className="img-fluid" src="images/bakeimg.png" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Create;