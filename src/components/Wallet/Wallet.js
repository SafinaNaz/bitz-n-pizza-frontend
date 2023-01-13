import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setWalletAddress } from './Wallet.action';
import { connectToWallet } from '../../utils/web3';
import { login, userSignUp } from '../user/user.action';
// import { ENV } from '../../config/config';

const Wallet = (props) => {



    const [address, setAddress] = useState()
    // const [userData, setUserData] = useState({ address: '', password: '', email: '', username: '' })
    // const [error, setError] = useState()
    // const [showSignUp, setShowSignUp] = useState(false)

    useEffect(() => {
        let address = localStorage.getItem("wallet_address")
        if (address) {
            setAddress(address)
        }
    }, [])

    useEffect(() => {
        setAddress(props.wallet)
    }, [props.wallet])

    // useEffect(() => {
        // setError(props.error)
    // }, [props.error])

    // connect to the metamask 
    const walletConnection = async () => {
        const address = await connectToWallet()
        props.setWalletAddress(address)
        localStorage.setItem("wallet_address", address)
        onSignIn()
    }

    const onSignIn = async () => {
        // e.preventDefault()
        // const addressSign = await signRequest(address)
        // let data = { address, password: addressSign }
        let data = { address : localStorage.getItem("wallet_address") }
        props.login(data)
    }

    // const onChange = (e) => {
    //     const { name, value } = e.target
    //     let data = userData
    //     data[name] = value
    //     setUserData(data)
    // }

    // const userSignUp = async (e) => {
    //     e.preventDefault()
    //     const addressSign = await signRequest(address)
    //     let data = userData
    //     data["password"] = addressSign
    //     data["address"] = address
    //     setUserData(data)
    //     props.userSignUp(userData)
    // }

    return (
        <div className="wallet-connect-area w-100">
            <div className="container">
                {
                    !address &&
                    <>
                        <div className="row justify-content-center">
                            <div className="col-12">
                                {/* Intro */}
                                <div className="intro text-center">
                                    {/* <span>WALLET CONNECT</span> */}
                                    {/* <h5 class="modal-title" id="exampleModalLabel">Connect your Wallet</h5> */}
                                    {/* <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum obcaecati dignissimos quae quo ad iste ipsum officiis deleniti asperiores sit.</p> */}
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center items ">
                            <div key={`wd_${1}`} className="col-12 col-md-6 item mt-0">
                                <a className="d-block text-center cursopr-pointer" data-dismiss="modal" onClick={() => walletConnection()}>
                                    <img className="avatar-lg" src="/img/metamask2.png" alt="" />
                                    <h4 className="mb-0">Meta Mask</h4>
                                    {/* <p>A browser extension with great flexibility. The web's most popular wallet</p> */}
                                </a>
                            </div>
                        </div>
                    </>
                }
                {/* {
                    address ?
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-12 col-lg-10">
                                Intro
                                <div className="intro text-center">
                                    <h3>Login</h3>
                                </div>
                                Item Form
                                <form className="item-form card no-hover">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="form-group mt-3">
                                                <p>{address}</p>
                                            </div>
                                        </div>
                                        {
                                            error && <div className="col-12">
                                                <p>{error.message}</p>
                                            </div>
                                        }
                                        <div className="col-12">
                                            <button className="btn w-100 sign-btn mt-3 mt-sm-4" data-dismiss="modal" onClick={(e) => { onSignIn(e) }}>Sign In</button>
                                        </div>
                                        {
                                            error && <div className="col-12">
                                                <button className="btn sign-btn w-100 mt-3 mt-sm-4" onClick={() => {
                                                    setError(null)
                                                    setShowSignUp(true)
                                                }}>Would you like to Sign Up?</button>
                                            </div>
                                        }
                                    </div>
                                </form>
                            </div>
                        </div> 
                        : ''
                } */}
                {
                    // showSignUp && address ?
                    //     <div className="row justify-content-center">
                    //         <div className="col-12 col-md-8 col-lg-7">
                    //             {/* Intro */}
                    //             <div className="intro text-center">
                    //                 <h3 className="mt-3 mb-0">Signup</h3>
                    //             </div>
                    //             {/* Item Form */}
                    //             <form className="item-form card no-hover" onSubmit={(e) => userSignUp(e)}>
                    //                 <div className="row">
                    //                     <div className="col-12">
                    //                         <div className="form-group mt-3">
                    //                             <p>{address}</p>
                    //                         </div>
                    //                     </div>
                    //                     <div className="col-12">
                    //                         <div className="form-group mt-3">
                    //                             <input type="email" className="form-control" name="email" placeholder="Enter your Email" required="required" onChange={(e) => { onChange(e) }} />
                    //                         </div>
                    //                     </div>
                    //                     <div className="col-12">
                    //                         <div className="form-group mt-3">
                    //                             <input type="text" className="form-control" name="username" placeholder="Enter your Username" required="required" onChange={(e) => { onChange(e) }} />
                    //                         </div>
                    //                     </div>
                    //                     <div className="col-12">
                    //                         <div className="form-group mt-3">
                    //                             <div className="form-check form-check-inline">
                    //                                 <label class="check-cont">I agree to <a href="#">Privacy Policy</a>
                    //                                     <input type="checkbox" required="required"/>
                    //                                     <span class ="checkmark"></span>
                    //                                 </label>
                    //                                 {/* <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" required="required" />
                    //                                 <label className="form-check-label" htmlFor="inlineRadio1">I agree to <a href="#">Privacy Policy</a></label> */}
                    //                             </div>
                    //                         </div>
                    //                     </div>
                    //                     {
                    //                         error && <p className="text-white">{error.message}</p>
                    //                     }
                    //                     <div className="col-12">
                    //                         <button className="btn w-100 sign-btn mt-3 mt-sm-4" type="submit">Sign Up</button>
                    //                     </div>
                    //                     <div className="col-12">
                    //                         <p className="d-block text-center mt-4" >Already have an account? <span onClick={() => setShowSignUp(false)}className="tunna">Login</span></p>
                    //                     </div>
                    //                 </div>
                    //             </form>
                    //         </div>
                    //     </div> : ""
                }

            </div>
        </div>
    );
}

const mapStateToProps = state => ({
    wallet: state.wallet.accountAddress,
    error: state.error.error,
    user: state.user
})

export default connect(mapStateToProps, { setWalletAddress, login, userSignUp })(Wallet);