import React from "react";

const HowToCreate = () => {
    return (
        <>
            <div className="cave"></div>
            <div className="main-wrapper how-to-create">
                <div className="custom-container">
                    <div className="heading">
                        <h1>How to Create.</h1>
                        <p>THERE ARE SEVERAL WAYS TO GET INVOLVED IN THE BITZ ’N’ PIZZAS PROJECT</p>
                    </div>
                    <div className="buy-ingredients">
                        <h2>Buy Ingredients</h2>
                        <p>Buy ingredient NFTs and trade them on the marketplace or Opensea. (0.01 ETH for initial mints + gas)</p>
                    </div>
                    <div className="btn-wrapper">
                        <button className="btn btn-custom-primary">SETUP YOUR WALLER</button>
                        <button className="btn btn-dark">BAKE YOUR PIZZA</button>
                        <button className="btn btn-outline-primary">JOIN COMMUNITY</button>
                    </div>
                    <hr className="custom" />
                    <div className="buy-bake">
                        <h2>Buy & Bake:</h2>
                        <div className="images">
                            <img src="images/Layer 1.png" alt="" className="img-fluid" />
                            <span>+</span>
                            <img src="images/Layer 1-1.png" alt="" className="img-fluid" />
                            <span>+</span>
                            <img src="images/Layer 1-13.png" alt="" className="img-fluid" />
                            <span>+</span>
                            <img src="images/Layer 1-7.png" alt="" className="img-fluid" />
                        </div>
                        <p>Gas prices are crazy, right?! Oke, so we have worked some magic that will allow you, our pizza afficionados, to buy ingredient NFTs and BAKE them into a completed pizza NFT in one transaction Simply visit the Pizza Cave, add the ingredients you like to your basket and click BUY & BAKE to mint those ingredients into a new pizza. (0.01 ETH per ingredient + 0.01 ETH BAKING FEE + gas)</p>
                    </div>
                </div>
                <div className="random-bake">
                    <div className="custom-container">
                        <h2>Random Bake:</h2>
                        <p>Can’t decide what you want? Is oke, we have you covered! Visit the Pizza Cave and click RANDOM BAKE to get a completed pizza NFT with a random selection of ingredients, as well as having the chance to get some rarity rewards. (0.05 ETH + gas)</p>
                    </div>
                </div>
                <div className="custom-container">
                    <div className="bake-unbake">
                        <div className="row">
                            <div className="col-md-12 ">
                                <h2>Bake</h2>
                                <div className="images">
                                    <div className="ingredients">
                                        <img src="images/Group 647.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 646.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 645.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 648.png" alt="" className="img-fluid" />

                                    </div>
                                </div>
                                <p>Buy ingredient NFTs from the marketplace then visit the Pizza Cave where you can click on the BAKE tab to combine your ingredients into a completed pizza NFT with a chance to get some rarity rewards. (0.01 ETH BAKING FEE + gas)</p>
                            </div>
                            <hr className="custom" />
                            <div className="col-md-12">
                                <h2>Unbake</h2>
                                <div className="images">
                                    <div className="ingredients">
                                        <img src="images/Group 648.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 647.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 646.png" alt="" className="img-fluid" />
                                        <img src="images/right-arrow.png" alt="" className="icon img-fluid" />
                                        <img src="images/Group 645.png" alt="" className="img-fluid" />
                                    </div>

                                </div>
                                <p>Already got a completed pizza NFT? Want to change it up or break it down and trade the ingredient NFTs on the marketplace? No worries! Head to the Pizza Cave, select the UNBAKE tab, choose the pizza you want to disassemble and pay the UNBAKE fee. (0.05 ETH UNBAKE FEE + gas) ***UNBAKING disassembles your pizza NFT and returns all constituent ingredient NFTs to your wallet</p>
                            </div>
                        </div>
                    </div>
                    <hr className="custom" />
                    <div className="rebake">
                        <h2>Rebake</h2>
                        <p>Already got a completed pizza NFT but you want to take add a new ingredient or remove some? No worries! Visit the Pizza Cave, click the REBAKE tab, select the pizza you want to amend and add/remove the ingredients as you wish. Removing ingredients while REBAKING will BURN the ingredient and will NOT return the ingredient NFT to your wallet – hence the lower fee for REBAKING (0.01 ETH + gas) ***REBAKING will burn any ingredient NFTs that you remove from the pizza NFT***</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HowToCreate;