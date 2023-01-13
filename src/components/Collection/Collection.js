import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { randomPizzaTimming } from '../../utils/web3'

const Collection = () => {

    
    const [isRandomAvailable, setIsRandomAvailable] = useState(false)

    const getRandomTimming = async () => {
        const isRandomPizzaAvailable = await randomPizzaTimming()
        setIsRandomAvailable(isRandomPizzaAvailable)
    }

    useEffect(() => {
        getRandomTimming()
    }, [])


    return (
        <div className="collection">
            <div className="container-fluid">
                <div className="about-collection">
                    <h2>
                        Getting Started
                    </h2>
                    <p>
                        THERE ARE SEVERAL WAYS TO GET STARTED.
                        CHOOSE THE BEST OPTION FOR YOU ...
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="abt-ind">
                            <h3>I don't have any ingredients</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {isRandomAvailable &&
                        <div className="col-md-4 mb-4">
                            <Link to="/pizzacave?tabValue=randomBake">
                                <div className="create-pizza">
                                    <h3>Random Bake (0.05 ETH)</h3>
                                    <p>The simplest route to pizza heaven. Click and Bake. Get a randomly minted pizza with immediate reveal  in 'My Wallet' after minting.</p>
                                </div>
                            </Link>
                        </div>
                    }
                    <div className="col-md-4 mb-4">
                        <Link to="/marketplace">
                            <div className="create-pizza">
                                <h3>Buy Ingredients (0.01 ETH)</h3>
                                <p>Go to the Pizza Cave and click on 'Buy Ingredients' tab to relish in the delightful selection of hand-crafted ingredients freshly prepared by our pixel artistes. Use this option to buy now, bake later. If you are ready to buy ingredients and bake a pizza now, see 'Buy &amp; Bake'.</p>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-4 mb-4">
                        <Link to="/pizzacave?tabValue=buyAndBake">
                            <div className="create-pizza">
                                <h3>Buy &amp; Bake</h3>
                                <p>Slip into the Pizza Cave and click the 'Buy &amp; Bake' tab to choose your ingredients and bake a pizza in a single transaction. Simple. (0.01 ETH per ingredient + 0.01 ETH Bake fee)</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="abt-ind">
                            <h3>I have ingredients and want to make a pizza</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <Link to="/pizzacave?tabValue=bake">
                            <div className="create-pizza">
                                <h3>Bake (0.01 ETH)</h3>
                                <p>Connect your wallet and hop into the Pizza Cave. Click on the 'Bake' tab to assemble a custom pizza using the ingredients in your wallet. (*All pizzas must include a pizza base, otherwise it's not pizza, right? Also, 1 cheese and 1 sauce maximum.)</p>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="abt-ind">
                            <h3>I want to customize a pizza I already own</h3>
                        </div>
                    </div>
                </div>
                {/* <h3>I want to customize a pizza I already own</h3> */}
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <Link to="/pizzacave?tabValue=rebake">
                            <div className="create-pizza">
                                <h3>Re-Bake (0.01 ETH)</h3>
                                <p>Customize a pizza you already hold. Add ingredients from your wallet or remove* ingredients to improve your Rarity Reward Score. (*Removing ingredients from your pizza using the Rebake function will burn said ingredient NFTs permanently and irreversibly. You will no longer own nor have access to NFTs that are burned in this process.) To customize your pizza without burning your ingredients, see 'Unbake'.</p>
                            </div>
                        </Link>
                    </div>

                    <div className="col-md-4 mb-4">
                        <Link to="/pizzacave?tabValue=unbake">
                            <div className="create-pizza">
                                <h3>Un-Bake (0.05 ETH)</h3>
                                <p>Disassemble a pizza held in your wallet and return the constituent fresh ingredient NFTs to your wallet for trading or baking new pizzas.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Collection;