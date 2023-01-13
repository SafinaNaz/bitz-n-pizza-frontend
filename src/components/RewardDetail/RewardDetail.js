import React from "react";

const RewardDetail = () => {
    return (
        <>
            <div className="cave"></div>
            <div className="main-wrapper reward-detail">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-7">
                            <div className="product-title">
                                <div className="name-code">
                                    <h4>Rarity Rank #1</h4>
                                    <p>0xc72a</p>
                                </div>
                                <button className="btn btn-outline-primary">VIEW IN OPENSEA</button>
                            </div>
                            <div className="image">
                                <img src="images/random-bake.png" alt="" className="img-fluid" />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="product-info">
                                <div className="score-sec">
                                    <div className="title">Rarity Score</div>
                                    <div className="percentage">627%</div>
                                </div>
                                <div className="ingredients">
                                    <div className="label">Base & Sauce</div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Base: Plan</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>60%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Sauce: Tomato</span>
                                            <span className="quantity">x2</span>
                                        </div>
                                        <div className="value">
                                            <span>90%</span>
                                        </div>
                                    </div>
                                    <div className="label">Meat</div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Chicken</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>85%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Beef</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>64%</span>
                                        </div>
                                    </div>
                                    <div className="label">Cheese</div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Cheddar</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>16%</span>
                                        </div>
                                    </div>
                                    <div className="label">Toppings</div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Onions</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>48%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Peppers</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>44%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Jalapenos</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>67%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Chilies</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>82%</span>
                                        </div>
                                    </div>
                                    <div className="item">
                                        <div className="name">
                                            <span>Olives</span>
                                            <span className="quantity">x1</span>
                                        </div>
                                        <div className="value">
                                            <span>71%</span>
                                        </div>
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

export default RewardDetail;