import React from "react";
import { Link } from "react-router-dom";

const Pizza = () => {
    return (
        <div className="pizza">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6">
                        <div className="pizza-image">
                            <img alt="s_img" src="images/imgg-01.png" className="img-fluid" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="pizz-desc">
                            <h3>
                                Refine your own rarity
                            </h3>
                            <p>
                                Choose and bake your ingredient traits
                            </p>
                            <Link to="/marketplace" className="btn btn-primary">BUY INGREDIENTS</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pizza;