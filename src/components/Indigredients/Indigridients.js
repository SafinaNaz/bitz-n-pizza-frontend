import React, { useEffect } from "react";
import { useState } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getIngredients, beforeIngredient } from '../../redux/Ingredients/Ingredients.actions'
import { getCatgories } from '../../redux/Categories/categories.actions'
import { buyIngredient } from '../../redux/userIngredients/userIngredients.actions'
import { mintPizzaIngredients, purchaseMultipleIngredients, checkIngredientMints } from '../../utils/web3'
import FullPageLoader from '../FullPageLoader/FullPageLoader'
import { getBakedPizzas, beforeBakePizza } from '../Cave/Cave.action'

const Indigridients = (props) => {

    const limit = 4
    const [page, setPage] = useState(1);
    // const [totalPages, setTotalPages] = useState(0);
    const [category, setCategoryId] = useState('')
    const [userAuth, setUserAuth] = useState()
    const [selectedIng, setSelectedIng] = useState(null)
    const [ingList, setIngList] = useState([])
    const [allIngredients, setAllIngredients] = useState([])

    // state to manage loader
    const [fullLoader, setFullLoader] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    useEffect(() => {
        setFullLoader(false)
    }, [props.pizzas])

    useEffect(() => {
        if (props.search) {
            props.beforeIngredient();
            props.getIngredients(paginateQuery(category));
        }
    }, [props.search, props.sorting])

    useEffect(() => {
        props.getCatgories();
        props.beforeIngredient();
        setFullLoader(true)
        props.getIngredients(paginateQuery());
    }, [])

    useEffect(() => {
        setUserAuth(props?.userAuth)
    }, [props?.userAuth])

    useEffect(() => {
        prepareMintsData(props.ingredients);
    }, [props.ingredients])


    useEffect(async () => {
        if (props.userIngredient?.success) {
            const ingredient = props.userIngredient.ingredient
            // calling _mintPizzaIngretients smart contract
            if (selectedIng.price && selectedIng._ingredientId) {
                await mintPizzaIngredients(ingredient._id, selectedIng.price, selectedIng._ingredientId)
            }
        }
        setFullLoader(false)
    }, [props.userIngredient])

    function paginateQuery(categoryId = null, page = 1) {
        if (categoryId) return `page=${page}&limit=${limit}&categoryId=${categoryId}&name=${props.searchValue}&sort=${props.sorting}`
        else return `page=${page}&limit=${limit}&name=${props.searchValue}&sort=${props.sorting}`
    };

    const prepareMintsData = async (ingredients) => {
        setFullLoader(true)
        let allData = [];
        for( let a=0; a<ingredients.length; a++) {
            let currentIndexData = ingredients[a];
            let mints = await callIngredientMints(currentIndexData._ingredientId);
            currentIndexData.totalMints = mints.minted;
            currentIndexData.totalAvailable = mints.total;
            allData.push(currentIndexData);
        }
        setAllIngredients(allData);
        setFullLoader(false)
    }
    const mintPizzaIngredient = async (ingredientId) => {
        handleBuyIngredient(ingredientId)
    }

    const handleBuyIngredient = async (ingredientId) => {
        setFullLoader(true)
        let payload = {
            userId: props.user._id,
            ingredientId: ingredientId,
        }
        props.buyIngredient(payload);
    }

    const handleChangeCategory = (categoryId) => {
        setFullLoader(true)
        props.getIngredients(paginateQuery(categoryId));
        setCategoryId(categoryId);
        setPage(1);
    }

    const hanldeLoadMoreIng = () => {
        setFullLoader(true)
        setPage(prevState => prevState + 1);
        if (category) {
            props.getIngredients(paginateQuery(category, page + 1));
        } else {
            props.getIngredients(paginateQuery(null, page + 1));
        }
    }

    const hanldeLoadMorePizzas = () => {
        setFullLoader(true)
        setPage(prevState => prevState + 1);
        props.getBakedPizzas(`page=${page + 1}`);
    }

    const manageIngList = async (ingredient) => {
        let arr = ingList
        let isExist = false

        // check whether this exists or not
        Promise.all(arr.map((e, index) => {
            if (e._id === ingredient._id) {
                isExist = true
                arr.splice(index, 1)
            }
        }))

        if (!isExist) {
            arr.push(ingredient)
        }

        console.log(arr)
        setIngList([...arr])
    }

    const purchaseAllIngredients = async () => {

        let accPrice = 0
        let ingIds = []
        let objIdsArr = []
        // calculate ingredient price
        Promise.all(ingList.map((e) => {
            accPrice = accPrice + e.price;
            ingIds.push(e._ingredientId)
            objIdsArr.push(e._id)
        }))
        accPrice = parseFloat(accPrice.toFixed(3));
        
        if (props?.user) {
            let userId = props?.user?._id
            await purchaseMultipleIngredients(ingIds, accPrice, objIdsArr, userId)
            // let arr = []
            // setIngList([...arr])
        }

    }
    const callIngredientMints = async (ingredientId) => {
        let mints = await checkIngredientMints(ingredientId);
        return mints;
    }

    return (
        <>
            {
                fullLoader &&
                <FullPageLoader />
            }


            <div className="indigridients">
                <ul className="nav nav-tabs naving-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <span className="nav-link nav-sax active" id="home-tab" data-toggle="tab" data-target="#home" role="tab" aria-controls="home" aria-selected="true"
                        //  onClick={() => { props.setTabType("ingredient"); setPage(1); props.beforeIngredient(); props.getIngredients(paginateQuery(category)) }}
                         >Ingredients</span>
                    </li>
                    {/* <li className="nav-item" role="presentation">
                        <a className="nav-link nav-sax" id="profile-tab" data-toggle="tab" data-target="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={() => { props.setTabType("pizza"); setPage(1); props.beforeBakePizza(); props.getBakedPizzas(); }}>Complete Pizzas</a>
                    </li> */}
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <ul className="nav nav-tabs naving-tabs" id="myTab" role="tablist">

                            {props?.categories?.length > 0 ?

                                (<li className="nav-item" role="presentation" onClick={() => {
                                    props.beforeIngredient()
                                    setIngList([])
                                    handleChangeCategory(null);
                                }}>
                                    <a className="nav-link nav-act active" id="pizza-tab" data-toggle="tab" href="#pizza" role="tab" aria-controls="home" aria-selected="true">All</a>
                                </li>) : ''
                            }
                            {props.categories && props?.categories.map((category, index) => {
                                return (<li id={category._id} className="nav-item" role="presentation" key={index}
                                    onClick={() => {
                                        props.beforeIngredient()
                                        setIngList([])
                                        handleChangeCategory(category._id);
                                    }}
                                >
                                    <a className="nav-link nav-act" id={category.id} data-toggle="tab" href="#sauce" role="tab" aria-controls="profile" aria-selected="false">{category.name}</a>
                                </li>)

                            })}
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="pizza" role="tabpanel" aria-labelledby="pizza-tab">
                                {
                                    ingList.length > 0 &&
                                    <div className="purchase-btn-div">
                                    <button className="btn btn-primary purchase-btn" onClick={() => purchaseAllIngredients()}>Purchase All Selected</button>
                                    </div>
                                }
                                <div className="container-fluid">
                                    <div className="row">
                                        {allIngredients.map((ingredient, index) => {
                                            const { _id, image, name, price, _ingredientId} = ingredient;
                                            return <div className="col-md-3" key={_ingredientId}>
                                                <div className="ingridients">
                                                    <div className="quantity-banner">
                                                        <h4 className="text-white" >{ ingredient.totalMints } / {ingredient.totalAvailable}</h4>
                                                    </div>
                                                    <div className="indi">
                                                        <img className="img-fluid" src={image} alt="s_img" />
                                                        <div className="form-group custom-checkbox my-custom" >
                                                            <input type="checkbox" id={_ingredientId}
                                                                onChange={() => {
                                                                    manageIngList(ingredient)
                                                                }} />
                                                            <label htmlFor={_ingredientId}></label>
                                                        </div>
                                                    </div>
                                                    <div className="indi-head">
                                                        <h4>
                                                            {name} 
                                                        </h4>
                                                    </div>
                                                    <div className="about-indi">
                                                        <div className="indi-cont">
                                                            <img alt="s_img" className="img-fluid" src="images/Mask Group 7.png" /> <span>{price}</span>
                                                        </div>
                                                        <div className="indi-button">
                                                            {
                                                                userAuth ?
                                                                    <a onClick={() => { mintPizzaIngredient(_id); setSelectedIng({ price, _ingredientId, _id }) }} >
                                                                        Buy
                                                                    </a> :
                                                                    <a data-toggle="modal" data-target="#connectWallet">
                                                                        Buy
                                                                    </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                    {props?.pagination?.pages > page &&
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="head-button text-center">
                                                    <button type="button" className="btn btn-primary" onClick={() => { hanldeLoadMoreIng() }}>Load More</button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        !allIngredients.length &&
                                        <div className="not-found">
                                            <p>Ingredients not available.</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="pizza" role="tabpanel" aria-labelledby="pizza-tab">
                                <div className="container-fluid">
                                    <div className="row">
                                        {props?.pizzas?.map((pizza, index) => {
                                            const { _id, image } = pizza
                                            return <div className="col-md-3" key={index}>
                                                <Link to={`/pizza/${_id}`}>
                                                    <div className="ingridients">
                                                        <div className="indi">
                                                            <img className="img-fluid" src={image} />
                                                        </div>
                                                        <div className="about-indi">
                                                            {/* <div className="indi-cont">
                                                                <img className="img-fluid" src="images/Mask Group 7.png" /> <span>0.01</span>
                                                            </div> */}
                                                            <div className="indi-button">
                                                                {
                                                                    <a>View Details</a>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        })}
                                    </div>
                                    {props?.pizzasPagination?.pages > page &&
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="head-button text-center">
                                                    <button type="button" className="btn btn-primary" onClick={() => { hanldeLoadMorePizzas() }}>Load More</button>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        !props?.pizzas?.length && props.tabType === "pizza" ?
                                            <div className="row">
                                                <div className="col-12">
                                                    <div className="not-found">
                                                        <p>Pizza's not available.</p>
                                                    </div>
                                                </div>
                                            </div> : ''
                                    }
                                </div>
                            </div>
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
        pagination: state?.ingredient?.pagination,
        categories: state?.category?.categories,
        user: state?.user?.userData,
        userAuth: state?.user?.userAuth,
        pizzas: state.cave.bakedPizzas,
        pizzasPagination: state.cave.pagination,
        userIngredient: state.userIngredients.buyIngredient
    };
}

export default connect(mapStateToProps, { getIngredients, getCatgories, buyIngredient, beforeIngredient, getBakedPizzas, beforeBakePizza })(Indigridients)