import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ENV } from '../../config/config';
import { Link , useLocation} from 'react-router-dom';
import { setUser, disconnectUser } from '../../components/user/user.action';
import { setWalletAddress } from '../../components/Wallet/Wallet.action';
import { connect } from 'react-redux';
import Wallet from '../../components/Wallet/Wallet';
import { getUserIngredients, beforeUserIngredient } from '../../redux/userIngredients/userIngredients.actions'
import { claimReward , getClaimRewardAmout, weitoEth} from '../../utils/web3';
import Loader from "react-loader-spinner";
import {Dropdown} from 'react-bootstrap';
import { getWalletData, beforeWalletData } from '../Wallet/Wallet.action'
import { beforeBakePizza } from '../Cave/Cave.action'
// import Select from 'react-select'

const Header = (props) => {
    
    const [userAuth, setUserAuth] = useState()
    const [wallet, setWallet] = useState()
    // const [fundAmnt, setFundAmnt] = useState()
    // const [amnt, setAmnt] = useState()
    const [loader, setLoader] = useState(false)
    // const [ claimType, setClaimType] = useState({ value: 'ingredient', label: 'Ingredient Commission' })
    // const [pizzaNft, setPizzaNft] = useState(0)
    const [claimAbleAmnt, setClaimAbleAmnt] = useState(0)

    const history = useHistory() 

    const {pathname: page} = useLocation()
    
    const getClaimAmnt = async (address) => {
        // console.log(address)
       const amnt = await getClaimRewardAmout(address);
       const etherValue = await weitoEth(amnt);
    //    console.log(etherValue);
       setClaimAbleAmnt(parseFloat(etherValue))
       return true
    }

    const claimAmnt = async () => {
        let address = localStorage.getItem("wallet_address")
        if(address){
            const amnt = await getClaimRewardAmout(address);
        //    console.log("amntamntamntamnt");
        //    console.log(amnt);
           const etherValue = await weitoEth(amnt);
        //    console.log(etherValue);
           setClaimAbleAmnt(parseFloat(etherValue))
        }
    }

    useEffect(()=> {
        let address = localStorage.getItem("wallet_address")
        if(address){
            props.setWalletAddress(address)
            getClaimAmnt(address)
        }
        if(ENV.getUserKeys("userAuth").userAuth){
            const userData = ENV.getUserKeys("_id email address accessToken userAuth")
            props.setUser(userData)
        }  
    }, [])
    
    useEffect(()=> {
        if(props.userAuth){
            // store the user in localstorage
            let obj = props.user
            obj["userAuth"] = props.userAuth
            ENV.encryptUserData(obj)
            props.beforeUserIngredient()
            props.getUserIngredients(props.user._id)
            // console.log("calling 1")
            props.beforeWalletData()
            props.getWalletData(props.user._id, '', "ingredient")
        }
    }, [props.userAuth])

    useEffect(()=> {
        setWallet(props.wallet)
    }, [props.wallet])

    useEffect(()=> {
        setUserAuth(props.userAuth)
    }, [props.userAuth])

    const formattedAddress = (address) => {
        return `${address.slice(0,5)}...${address.slice(-5)}`
    }

    const activeNavLink = (path) => {
        return`nav-link ${page === path && "active"}`
    }

    const clainReward = async(e) => {
        e.preventDefault()
        setLoader(true)
        if(props?.user?._id){
            await claimReward(props.user._id)
            let address = localStorage.getItem("wallet_address")
            await getClaimAmnt(address)
            setLoader(false)
        }
    }

    const disConnectApp = async () => {
        props.disconnectUser()
        props.setWalletAddress(null)
        props.beforeUserIngredient()
        props.beforeWalletData()
        props.beforeBakePizza()
    }

    return (
        <>
            <nav id="header" className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    <img className="navbar-brand-sticky" src="/images/Group 7.png" alt="sticky brand-logo" />
                </a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav items mr-auto">
                        <li className="nav-item dropdown">
                            <Link className={activeNavLink("/")} to="/" >Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/marketplace" className={activeNavLink("/marketplace")} >Buy Ingredients</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/pizzacave" className={activeNavLink("/pizzacave")} >Pizza Cave</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/how-to-create" className={activeNavLink("/how-to-create")} >How to Create</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/artist" className={activeNavLink("/artist")} >Meet Artists</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/rarity-rewards" className={activeNavLink("/rarity-rewards")} >Rarity Rewards</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/my-wallet" className={activeNavLink("/my-wallet")} >My Wallet</Link>
                        </li>
                        
                    </ul>
                    <div className='main-head-btn'>
                    {
                        wallet && userAuth ?
                        <div className="header-button">
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onClick={() => claimAmnt()}>
                                CLAIM
                            </button>

                        </div> : ''
                    }
                    
                    <div className="head-button">
                        {
                            wallet && userAuth ? 
                            <div >
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic" className="btn btn-primary">
                                    {formattedAddress(wallet)}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=> {disConnectApp()}}>DISCONNECT</Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            : 
                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#connectWallet">CONNECT</button>
                        }
                    </div>
                    </div>
                </div>
            </nav>
            {/* claim reward modal */}
            <div className="modal fade claim" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-content-inner">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Claim Your Rewards</h5>
                            </div>
                            <div className="modal-body">
                                <p>1. Allows users to claim any rewards they may be entitled to</p>
                                <p>2. Gas fees for all UI smart contract interactions to be paid by user.</p>
                                
                                <div className="claim-form">
                                    <h3>Claimable Amount: {claimAbleAmnt} ETH</h3>
                               <form onSubmit={clainReward}>
                                    <div className="head-button heading-btn">
                                        {claimAbleAmnt > 0 && <button type="submit" className="btn btn-primary btn-secondary" disabled={loader ? true : false} >
                                            {loader &&
                                            <Loader
                                                type="TailSpin"
                                                color="#FFFFFF"
                                                height={25}
                                                width={25}
                                            />}CLAIM REWARD</button>}
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => setLoader(false)}>Close</button>
                                    </div>
                               </form>
                           </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* authentication modal */}
            <div className="modal fade connect" id="connectWallet" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-content-inner">
                            <div className="modal-header">
                                <h5 className="modal-title">Connect Your Wallet</h5>
                            </div>
                            <div className="modal-body">
                                {
                                    !userAuth &&
                                    <Wallet history = {history} setUserAuth = {setUserAuth}/> 
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            
        </>
    );
};

const mapStateToProps = state => ({
    user: state.user.userData,
    userAuth: state.user.userAuth,
    wallet: state.wallet.accountAddress
}) 

export default connect(mapStateToProps, { beforeWalletData, disconnectUser, setUser, setWalletAddress, getUserIngredients, beforeUserIngredient, getWalletData, beforeBakePizza })(Header);