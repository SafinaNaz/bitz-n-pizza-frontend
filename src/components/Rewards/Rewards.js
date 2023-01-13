import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ENV } from "../../config/config";
import { getIngredients, beforeIngredient } from "../../redux/Ingredients/Ingredients.actions";
import { beforePizzaRarityRewards, getPizzaRarityRewards } from "./Rewards.action";
import { connect } from 'react-redux';
import FullPageLoader from '../FullPageLoader/FullPageLoader'
import { getIngredientsData, getTotalRarityRewards, getRarityRewardOwner, getRarityRewardPizza, weitoEth } from '../../utils/web3'

const Rewards = (props) => {
    const [sorting, setsorting] = useState()
    const [rarityRewardChart, setRarityRewardChart] = useState([])
    // const [pizzaList, setPizzaList] = useState([])
    const [page, setPage] = useState(1);
    const [pizzasData, setPizzasData] = useState([]);
    // const [ingredientDetails, setIngredientDetails] = useState()

    // state to manage loader
    const [fullLoader, setFullLoader] = useState(true)

    // news scroll
    const [newsScrollData, setNewsScrollData] = useState()

    useEffect(() => {
        prepareRewardsData();
        props.beforeIngredient()
        props.beforePizzaRarityRewards()
        props.getIngredients("page=1&limit=0")
        // props.getPizzaRarityRewards()
    }, [])


    // Call Contract Function to get ingredients Details
    const makeRarityChart = async (ingredientsArr) => {
        let ingredientArray = []
        if (rarityRewardChart) {
            for (let index = 0; index < ingredientsArr.length; index++) {
                const element = ingredientsArr[index];
                let ingredientData = await getIngredientsData(element._ingredientId);
                console.log("ingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientDataingredientData");
                console.log(ingredientData);
                const {name, rarity, usedIn} = ingredientData
                ingredientArray.push({name, rarity, usedIn})
            }
        }

        setRarityRewardChart(ingredientArray)
        setsorting(true)
        let newsData = ''
        Promise.all(ingredientArray.map((e) => {
            newsData += `${e.name}  ${e.rarity}% `
        }))
        setNewsScrollData(newsData)
    }

    useEffect(() => {
        if (props.ingredients) {
            makeRarityChart(props.ingredients)
        }
    }, [props.ingredients])

    useEffect(() => {
        sortRarityRewardChart()
    }, [sorting])

    useEffect(() => {
        setFullLoader(false)
        // setPizzaList(props.rarityRewardPizzas)
        let response = props.rarityRewardPizzas;
        let allPizzasData = [...pizzasData];
        for(let x = 0; x < response.length; x++ ) {
            let index = allPizzasData.findIndex(pizza => pizza.nftId === response[x]._pizzaId);
            if(index > -1) {
                let data = allPizzasData[index];
                data.image = response[x].image;
                allPizzasData[index] = data;
            }
        }
        setPizzasData(allPizzasData);
    }, [props.rarityRewardPizzas])

    const sortRarityRewardChart = () => {
        if (sorting) {
            let rarityChartInDesc = rarityRewardChart?.sort((a, b) => b.rarity - a.rarity);
            setRarityRewardChart([...rarityChartInDesc])
        }
        if (!sorting) {
            let rarityChartInAsc = rarityRewardChart?.sort((a, b) => a.rarity - b.rarity)
            setRarityRewardChart([...rarityChartInAsc])
        }
    }

    const hanldeLoadMore = () => {
        setFullLoader(true)
        setPage(prevState => prevState + 1);
        props.getPizzaRarityRewards(`page=${page + 1}`)
    }
    const checkTotalRarityRewards = async () => {
        let total = await getTotalRarityRewards();
        return total;
    }
    const checkRarityRewardOwner = async (index) => {
        let total = await getRarityRewardOwner(index);
        return total;
    }
    const checkRarityRewardPizza = async (owner) => {
        let total = await getRarityRewardPizza(owner);
        return total;
    }
    const prepareRewardsData = async () => {
        let pizzasData = [];
        let pizzasIds = [];
        let rewardsTotal = await checkTotalRarityRewards();
        rewardsTotal = parseInt(rewardsTotal);
        for(let x=0; x < 2; x++) {
            let owner = await checkRarityRewardOwner(x);
            let parsedOwner = parseInt(owner);
            if(parsedOwner > 0) {
                let pizza = await checkRarityRewardPizza(owner);
                let parsedPrice = parseInt(pizza['rewardPrice']);
                if(parsedPrice > 0) {
                    const etherValue = await weitoEth(pizza['rewardPrice']);
                    let pizzaData = {
                        claimed: pizza['claimed'],
                        nftId: parseInt(pizza['nftId']),
                        price: etherValue,
                        wallet: pizza['wallet'],
                        rarityScore: pizza['rarityScore'],
                    }
                    pizzasIds.push(parseInt(pizza['nftId']));
                    pizzasData.push(pizzaData);
                }
            }
        }
        setPizzasData(pizzasData);
        let qs = ENV.objectToQueryString({ nftIds: JSON.stringify(pizzasIds)})
        props.getPizzaRarityRewards(qs);
    }

    return (
        <>
            {
                fullLoader &&
                <FullPageLoader />
            }
            <div className="cave"></div>
            <div className="main-wrapper reward">
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="heading">
                                <h1>Rarity Rewards.</h1>
                                <p>DISCOVER, COLLECT AND SELL A RARE DIGITAL ART NFT.</p>
                                <div className="d-flex justify-content-between align-items-center rarity-amount breaking-news">
                                    <h5>RARITY REWARDS:</h5>
                                    <marquee className="news-scroll" behavior="scroll" direction="left" >
                                        {

                                        }
                                        <a href="#">{newsScrollData}</a> <span className="dot"></span>
                                        <a href="#">{newsScrollData}</a>
                                    </marquee>
                                </div>

                            </div>
                            <div className="nft-list">
                                <div className="row">
                                    {
                                        pizzasData.map((obj, index) => {
                                            return (
                                                <div className="col-md-6 col-lg-4">
                                                    <div className="item">
                                                        <div className="score">
                                                            <span className="number">#{index + 1}</span>
                                                            <Link to={`/pizza/${obj._id}`} className="label">{obj.rarityScore ? obj.rarityScore : "N/A"}</Link>
                                                        </div>
                                                        <div className="image">
                                                            <img src={obj.image} alt="" className="img-fluid" />
                                                        </div>
                                                        <div className="content">
                                                            <h3><img src="images/eth-icon.png" alt="Eth Icon" className="currency-icon img-fluid" />{obj.price} {obj.claimed ? "(Claimed)" : "(Unclaimed)"}</h3>
                                                            {/* <p>0xc72a</p> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        props?.pagination?.pages > page &&
                                        <div className="head-button text-center">
                                            <button type="button" className="btn btn-primary" onClick={() => {
                                                hanldeLoadMore()
                                            }}>Load More</button>
                                        </div>
                                    }
                                    {
                                        !pizzasData.length && <div className="not-found" style={{ marginTop: "-30px", marginLeft: "12px", marginBottom: "20px" }}><p>Rarity Reward Pizzas not available.</p> </div>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className="col-md-4 p-md-0">
                            <div className="chart">
                                <h4 className="chart-title">Rarity Reward Chart</h4>
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Ingredients</th>
                                                <th scope="col" className="sorting"
                                                    onClick={() => {
                                                        setsorting(prevState => !prevState)
                                                    }}>Rarity %
                                                    <div className={sorting ? "sort-arrows up" : "sort-arrows down"}>
                                                        <span className="fa fa-sort-down"></span>
                                                        <span className="fa fa-sort-up"></span>
                                                    </div>
                                                </th>
                                                <th scope="col"># of Pizzas</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                rarityRewardChart && rarityRewardChart.map((ingredient, index) => {
                                                    return <tr key={index}>
                                                        <td>{ingredient.name}</td>
                                                        <td>{parseFloat(ingredient.rarity).toFixed(2)}%</td>
                                                        <td>{ingredient.usedIn}</td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="modal fade chart" id="chart" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg  modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Rarity Reward Chart</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">Ingredients</th>
                                        <th scope="col">Rarity Percentage</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>

                                        <td>Plain Base</td>
                                        <td>60%</td>
                                    </tr>
                                    <tr>

                                        <td>Tomato Sauce</td>
                                        <td>45%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>16%</td>
                                    </tr>
                                    <tr>

                                        <td>Pepperoni</td>
                                        <td>38%</td>
                                    </tr>
                                    <tr>

                                        <td>Ham</td>
                                        <td>42%</td>
                                    </tr>
                                    <tr>

                                        <td>Salami</td>
                                        <td>69%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>85%</td>
                                    </tr>

                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>88%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>89%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>96%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>75%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>45%</td>
                                    </tr>
                                    <tr>

                                        <td>Cheddar Cheese</td>
                                        <td>55%</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state) => {
    return {
        ingredients: state?.ingredient?.ingredients,
        rarityRewardPizzas: state?.reward.rarityRewardsPizza,
        pagination: state?.reward?.pagination,

    };
}

export default connect(mapStateToProps, { getIngredients, beforeIngredient, beforePizzaRarityRewards, getPizzaRarityRewards })(Rewards)
