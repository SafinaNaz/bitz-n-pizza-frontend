import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { getWalletData, beforeWalletData } from '../components/Wallet/Wallet.action'
import FullPageLoader from '../components/FullPageLoader/FullPageLoader';
import { getCatgories } from '../redux/Categories/categories.actions'

const MyWallet = (props) =>  {

    const [page, setPage] = useState(1);
    const [ walletType,  setWalletType] = useState("ingredient")
    const [fullLoader, setFullLoader] = useState(true)

    useEffect(() => {
        props.getCatgories();
    },[])
    
    useEffect(() => {
        setFullLoader(false)
    }, [props.walletData])

    const walletData = async (type) => {
        setFullLoader(true)
        if (props?.user?._id) {
            setPage(1)
            props.beforeWalletData()
            props.getWalletData(props?.user?._id, '', type)
        }
    }

    const hanldeLoadMore = () => {
        setFullLoader(true)
        setPage(0);
        props.beforeWalletData()
        props.getWalletData(props.user._id, `page=all`, walletType)
    }

    const handleChangeCategory = (categoryId) => {
        setFullLoader(true)
        setPage(1);
        if (props?.user?._id) {
            props.beforeWalletData()
            props.getWalletData(props?.user?._id, '', walletType, categoryId)
        }
    }

    return (
        <>
            {
                fullLoader &&
                <FullPageLoader />
            }
            <div className="main">
                <div className="activity">
                    <div className="about-activity">
                        <h1>
                            My Wallet
                        </h1>
                    </div>
                </div>
                <div className="container-fluid my-5">
                    <ul className="nav nav-tabs naving-tabs mt-5" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <span className="nav-link nav-sax active" id="home-tab" data-toggle="tab" data-target="#home" role="tab" aria-controls="home" aria-selected="true" onClick={() => { setWalletType("ingredient"); props.beforeWalletData(); walletData("ingredient")}}>Ingredients</span>
                        </li>
                        <li className="nav-item" role="presentation">
                            <span className="nav-link nav-sax" id="profile-tab" data-toggle="tab" data-target="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={() => { setWalletType("pizza"); props.beforeWalletData(); walletData("pizza")}}>Complete Pizzas</span>
                        </li>
                    </ul>
                    {
                        walletType === "ingredient" &&
                        <ul className="nav nav-tabs naving-tabs" id="myTab" role="tablist">

                            {props?.categories?.length > 0 ?

                                (<li className="nav-item" role="presentation" onClick={() => {
                                    // props.beforeIngredient()
                                    // setIngList([])
                                    handleChangeCategory(null);
                                }}>
                                    <a className="nav-link nav-act active" id="pizza-tab" data-toggle="tab" href="#pizza" role="tab" aria-controls="home" aria-selected="true">All</a>
                                </li>) : ''
                            }
                            {props.categories && props?.categories.map((category, index) => {
                                return (<li id={category._id} className="nav-item" role="presentation" key={index}
                                    onClick={() => {
                                        // props.beforeIngredient()
                                        // setIngList([])
                                        handleChangeCategory(category._id);
                                    }}
                                >
                                    <a className="nav-link nav-act" id={category.id} data-toggle="tab" href="#sauce" role="tab" aria-controls="profile" aria-selected="false">{category.name}</a>
                                </li>)

                            })}
                        </ul>
                    }
                    <div className="about-caving row">
                        {props.walletData && props.walletData.map((item, index) => {
                            return (
                                <div className="caving col-md-3" key={index}>
                                    {
                                        item?.type === "pizza" ?
                                        <Link to={`/pizza/${item._id}`}>
                                            <div className="mingo">
                                                <img alt='s_img' className="img-fluid" src={item?.image} />
                                            </div>
                                        </Link> :
                                            <div className="mingo">
                                                <img alt='s_img' className="img-fluid" src={item?.image} />
                                            </div>
                                    }
                                    {

                                        item?.type !== "pizza" &&
                                            <h5>
                                                {item?.name} <span> x {item.count}</span>
                                            </h5>
                                    }
                                </div>
                            )
                        })
                        }
                    </div>
                    {
                        props?.walletPagination?.pages > page && props?.walletPagination?.pages > 1 &&
                        <div className="head-button text-center">
                            <button type="button" className="btn btn-primary" onClick={() => {
                                hanldeLoadMore()
                            }}>Load More</button>
                        </div>
                    }
                    {
                        !props.userAuth && !props.user ?
                            <div className="not-found">
                                <p>Please <span className="walP" data-toggle="modal" data-target="#connectWallet">Connect</span> To Your Wallet.</p>
                            </div> :
                            !props?.walletData?.length ?
                                <div className="not-found">
                                    {
                                        walletType === "ingredient" ? 
                                        <p>You haven't purchase any ingredient yet...</p> :
                                        <p>You haven't bake any pizza yet...</p>
                                    }
                                </div> : ""
                    }
                </div>
            </div>
        </>
        
    );
}

const mapStateToProps = (state) => {
    return {
        walletData: state.wallet.data,
        walletPagination: state.wallet.pagination,
        userAuth: state.user.userAuth,
        user: state.user.userData,
        categories: state?.category?.categories,
    };
}

export default connect(mapStateToProps, { getWalletData, beforeWalletData, getCatgories })(MyWallet)
