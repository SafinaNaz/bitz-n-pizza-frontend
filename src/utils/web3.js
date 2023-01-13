import Web3 from 'web3';
import contractAbi from '../utils/abi/pizza-nft.json'
import { toast } from 'react-toastify';
import { ENV } from '../config/config';
const { bitzNpizzaContractAddress, web3ProviderAddress, appName } = ENV
let Contract = require("web3-eth-contract");
Contract.setProvider(web3ProviderAddress)

export const weitoEth = async (amount) => {
    const web3 = await getWeb3();
    if (!web3 || !amount) {
        return 0;
    }
    const etherValue = await web3.utils.fromWei(`${amount}`, 'ether');
    return etherValue;
}

export const connectToWallet = async () => {
    let web3;
    try {
        if (window.ethereum) {
            web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            web3 = new Web3(window.web3.currentProvider || "http://127.0.0.1:7545")
        }
        const accounts = await web3.eth.getAccounts();
        return accounts[0]
    } catch (error) {
        console.log("Error: ", error)
    }
}

export const signRequest = async () => {
    if (window.ethereum) {
        const web3 = new Web3(Web3.givenProvider);
        let accounts = await web3.eth.getAccounts();
        let address = accounts[0];
        let signature = await handleSignMessage(address);
        return signature;
    }
    else {
        alert("Please install metamask to connect to the Marketplace");
    }
}

const handleSignMessage = (address) => {
    return new Promise((resolve, reject) => {
        try {
            const web3 = new Web3(Web3.givenProvider);
            web3.eth.personal.sign(
                web3.utils.fromUtf8(`${appName} uses this cryptographic signature in place of a password, verifying that you are the owner of this address.`),
                address,
                (err, signature) => {
                    if (err) return reject(err);
                    return resolve(signature);
                }
            )
        }
        catch (e) {
            console.log(e);
        }
    });
};

// export const getWeb3 = async () => {
//     if(window.ethereum) {
//         const web3 = new Web3(Web3.givenProvider);
//         return web3;
//     }else {
//         return false;
//     }
// }
export const getWeb3 = async () => {
    let web3;
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
    } else if (window.web3) {
        await window.web3.currentProvider.enable();
        web3 = new Web3(window.web3.currentProvider);
    } else {
        toast.error('No web3 instance detected.');
        return false;
    }
    return web3;
}

export const mintPizzaIngredients = async (uIngId, price, _ingredientId) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const myNewData = await pizzaNftContract.methods.purchaseAndMintIngretient(_ingredientId).encodeABI()
        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })
        let weiPrice = web3.utils.toWei(`${price}`, 'ether');
        const gas2 = await web3.eth.getGasPrice()
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            mintPizzaIngConfirmation(txHash, uIngId, loaderId)
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// mint pizza ingredients confirmation
const mintPizzaIngConfirmation = async (txHash, id, loaderId) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }

    web3.eth.getTransactionReceipt(`${txHash}`, async (err, res) => {

        if (res) {

            const mintedId = await web3.utils.toNumber(res?.logs[1]?.topics[1]);

            if (mintedId) {
                const _nftId = mintedId

                let dataObj = {
                    _id: id,
                    _userIngredientId: _nftId
                }

                try {
                    fetch(`${ENV.url}ingredient/user-ingredients/edit`, {
                        method: "PUT",
                        headers: {
                            'Authorization': ENV.Authorization,
                            'x-auth-token': ENV.x_auth_token,
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(dataObj)
                    }).then(res => res.json()).then(data => {
                        if (data.success) {
                            console.log(data.message)
                        } else {
                            console.log(data.message)
                        }
                        toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                    }).catch(error => {
                        if (error.response && error.response.data) {
                            const { data } = error.response
                            if (data.message)
                                console.log(data.message)
                        }
                        toast.update(loaderId, { render: "Something gone wrong ...", type: "error", isLoading: false, autoClose: 3000 });
                    })
                } catch (error) {
                    console.log("ERROR = ", error?.message)
                }
            }
        } else {

            setTimeout(() => {
                mintPizzaIngConfirmation(txHash, id, loaderId);
            }, 100)
        }
    });
};

// for manual bake and random bake
export const mintNBakePizza = async (id, userIngredients, _bakedPizzaTokenURI, base, sauce, cheese, meats, toppings) => {

    if (!base) {
        base = 0
    }
    if (!sauce) {
        sauce = 0
    }
    if (!cheese) {
        cheese = 0
    }
    if (!meats.length || !meats[0]) {
        meats = [0]
    }
    if (!toppings.length || !toppings[0]) {
        toppings = [0]
    }

    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const myNewData = await pizzaNftContract.methods.bakePizzaAndMint(_bakedPizzaTokenURI, base, sauce, cheese, meats, toppings).encodeABI()

        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })

        const gas2 = await web3.eth.getGasPrice()
        let weiPrice = web3.utils.toWei(`${ENV.bake_price}`, 'ether');
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            const res = await bakePizzaCheckConfirmation(txHash, id, userIngredients, loaderId);
            return res
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// bake pizza transation confirmation 
export const bakePizzaCheckConfirmation = async (txHash, id, userIngredients, loaderId) => {

    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, res) {
                    if (!res) {
                        await sleep(4000);
                        checkStatus();
                    } else {

                        const mintedIds = await web3.utils.toNumber(res?.logs[1]?.topics[1]);

                        if (mintedIds) {
                            const pizzaId = mintedIds

                            let formObj = {
                                '_id': id,
                                '_pizzaId': pizzaId,
                                'userIngredients': userIngredients
                            }

                            try {
                                fetch(`${ENV.url}pizza/upsert`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': ENV.Authorization,
                                        'x-auth-token': ENV.x_auth_token,
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify(formObj)
                                }).then(res => res.json()).then(data => {
                                    if (data.success) {
                                        console.log(data.message)
                                    } else {
                                        console.log(data.message)
                                    }

                                    toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                                    return true
                                }).catch(error => {
                                    if (error.response && error.response.data) {
                                        const { data } = error.response
                                        if (data.message)
                                            console.log(data.message)
                                    }
                                    toast.update(loaderId, { render: "Something gone wrong ...", type: "error", isLoading: false, autoClose: 3000 });
                                    return false
                                })
                            } catch (error) {
                                console.log("ERROR = ", error?.message)
                                return false
                            }
                        }
                        resolve(res);
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
        return false
    }
};

// unbake pizza contract method
export const UnbakeBakePizza = async (id, ingIds) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const myNewData = await pizzaNftContract.methods.unbakePizza(id, ingIds).encodeABI()

        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })
        const gas2 = await web3.eth.getGasPrice()
        let weiPrice = web3.utils.toWei(`${ENV.unbake_price}`, 'ether');
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            const res = await unbakePizzaCheckConfirmation(txHash, loaderId)
            return res 
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// unbake pizza transation confirmation 
export const unbakePizzaCheckConfirmation = async (txHash, loaderId) => {
    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, result) {
                    if(err){
                        reject(err)
                    }
                    if (!result) {
                        await sleep(4000);
                        checkStatus();
                    } else {
                        toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                        resolve(result);
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
    }
};

// rebake pizza contract method 
export const mintRebakePizza = async (pizzaObjectId, id, _bakedPizzaTokenURI, base, sauce, cheese, meats, toppings, oldIngIds, burnIds) => {
    console.log(pizzaObjectId, id, _bakedPizzaTokenURI, base, sauce, cheese, meats, toppings, oldIngIds)
    if (!base) {
        base = 0
    }
    if (!sauce) {
        sauce = 0
    }
    if (!cheese) {
        cheese = 0
    }
    if (!meats.length || !meats[0]) {
        meats = [0]
    }
    if (!toppings.length || !toppings[0]) {
        toppings = [0]
    }

    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const myNewData = await pizzaNftContract.methods.rebakePizza(id, _bakedPizzaTokenURI, base, sauce, cheese, meats, toppings, oldIngIds, burnIds).encodeABI()

        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })

        const gas2 = await web3.eth.getGasPrice()
        let weiPrice = web3.utils.toWei(`${parseFloat(ENV.rebake_price)}`, 'ether');
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)

        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            let res = await rebakePizzaCheckConfirmation(txHash, loaderId, pizzaObjectId)
            return res
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// rebake pizza transation confirmation 
const rebakePizzaCheckConfirmation = (txHash, loaderId, pizzaObjectId) => {
    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, result) {
                    if (!result) {
                        await sleep(4000);
                        checkStatus();
                    } else {

                        let formObj = {
                            'pizzaObjectId': pizzaObjectId,
                        }

                        try {
                            fetch(`${ENV.url}pizza/edit`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': ENV.Authorization,
                                    'x-auth-token': ENV.x_auth_token,
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify(formObj)
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    console.log(data.message)
                                } else {
                                    console.log(data.message)
                                }
                                toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                                return true
                            }).catch(error => {
                                if (error.response && error.response.data) {
                                    const { data } = error.response
                                    if (data.message)
                                        console.log(data.message)
                                }
                                toast.update(loaderId, { render: "Something Gone Wrong!", type: "error", isLoading: false, autoClose: 3000 });
                                return false
                            })
                        } catch (error) {
                            console.log("ERROR = ", error?.message)
                        }
                        resolve(result);
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
    }
};

const sleep = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getClaimRewardAmout = async (accountAddress) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        // let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        // const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const claimAmnt = await pizzaNftContract.methods.checkclaimableReward(accountAddress).call()
        return claimAmnt
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// Claim reward
export const claimReward = async (userId) => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        let myNewData = await pizzaNftContract.methods.claimReward().encodeABI()

        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })
        const gas2 = await web3.eth.getGasPrice()
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            const res = claimRewardConfirmation(txHash, loaderId, userId)
            return res;
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}
// claim Reward confirmation
const claimRewardConfirmation = async (txHash, loaderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, res) {
                    if (!res) {
                        await sleep(4000);
                        checkStatus();
                    } else {
                        console.log(res)
                        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
                        const tokenEvents = await pizzaNftContract.getPastEvents('rarityClaim', {
                            fromBlock: res.blockNumber,
                        });

                        let pizzaNft = tokenEvents[0]?.returnValues?.nftId
                        if (pizzaNft > 0) {

                            let formObj = {
                                _pizzaId: pizzaNft,
                                price: tokenEvents[0]?.returnValues?.claimableAmount,
                                userId
                            }

                            try {
                                fetch(`${ENV.url}/rarity-reward/send`, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': ENV.Authorization,
                                        'x-auth-token': ENV.x_auth_token,
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify(formObj)
                                }).then(res => res.json()).then(data => {
                                    if (data.success) {
                                        console.log(data.message)
                                    } else {
                                        console.log(data.message)
                                    }
                                    toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                                    resolve(res);
                                    return true
                                }).catch(error => {
                                    if (error.response && error.response.data) {
                                        const { data } = error.response
                                        if (data.message)
                                            console.log(data.message)
                                    }
                                    toast.update(loaderId, { render: "Something Gone Wrong!", type: "error", isLoading: false, autoClose: 3000 });
                                    resolve(res);
                                    return false
                                })
                            } catch (error) {
                                console.log("ERROR = ", error?.message)
                                resolve(res);
                                return false
                            }

                        } else {
                            toast.update(loaderId, { render: "Ingredients Reward Claimed!", type: "success", isLoading: false, autoClose: 3000 });
                            resolve(res);
                            return true
                        }
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
        return false
    }
};

// for random bake
export const randomMintNBakePizza = async (id, _bakedPizzaTokenURI, base, sauce, cheese, meats, toppings, userID, type, accPrice) => {

    const mintedIdsArray = []

    if (!base) {
        base = 0
    } else {
        mintedIdsArray.push(base)
    }

    if (!sauce) {
        sauce = 0
    } else {
        mintedIdsArray.push(sauce)
    }

    if (!cheese) {
        cheese = 0
    } else {
        mintedIdsArray.push(cheese)
    }

    if (!meats?.length || !meats[0]) {
        meats = [0]
    } else {
        meats.map((e) => {
            mintedIdsArray.push(e)
        })
    }
    if (!toppings?.length || !toppings[0]) {
        toppings = [0]
    } else {
        toppings.map((e) => {
            mintedIdsArray.push(e)
        })
    }

    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        let myNewData = null
        let price = null
        if (type === "random") {
            myNewData = await pizzaNftContract.methods.randomBakePizzaAndMint(_bakedPizzaTokenURI, base, sauce, cheese, meats, toppings).encodeABI()
            price = ENV.random_bake_price
        } else {
            // in case of buy and bake pizza
            myNewData = await pizzaNftContract.methods.buyAndBakePizzaAndMint(_bakedPizzaTokenURI, base, sauce, cheese, meats, toppings).encodeABI()
            price = accPrice + parseFloat(ENV.bake_price)
        }

        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })

        const gas2 = await web3.eth.getGasPrice()
        let weiPrice = web3.utils.toWei(`${price}`, 'ether');
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            const res = randomBakePizzaCheckConfirmation(txHash, id, loaderId, mintedIdsArray, userID);
            return res
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// random bake pizza transation confirmation 
export const randomBakePizzaCheckConfirmation = async (txHash, id, loaderId, mintedIdsArray, userID) => {
    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, res) {
                    if (!res) {
                        await sleep(4000);
                        checkStatus();
                    } else {
                        const ingList = []
                        for (let index = 0; index < mintedIdsArray.length; index++) {
                            ingList.push({
                                ingId: mintedIdsArray[index],
                                ingUId: web3.utils.toNumber(res.logs[index].topics[3])
                            })
                        }
                        const mintedIds = await web3.utils.toNumber(res.logs[mintedIdsArray?.length].topics[3]);
                        if (mintedIds) {
                            const pizzaId = mintedIds

                            let formObj = {
                                '_id': id,
                                '_pizzaId': pizzaId
                            }

                            try {
                                fetch(`${ENV.url}pizza/upsert`, {
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': ENV.Authorization,
                                        'x-auth-token': ENV.x_auth_token,
                                        'content-type': 'application/json'
                                    },
                                    body: JSON.stringify(formObj)
                                }).then(res => res.json()).then(data => {
                                    if (data.success) {
                                        console.log(data.message)
                                    } else {
                                        console.log(data.message)
                                    }
                                    toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });

                                    let payload = {
                                        userId: userID,
                                        pizzaNFTId: pizzaId,
                                        ingredientsList: ingList
                                    }

                                    // make ingredients held by user
                                    try {
                                        fetch(`${ENV.url}ingredient/useringredients-random-pizza`, {
                                            method: 'POST',
                                            headers: {
                                                'Authorization': ENV.Authorization,
                                                'x-auth-token': ENV.x_auth_token,
                                                'content-type': 'application/json'
                                            },
                                            body: JSON.stringify(payload)
                                        }).then(res => res.json()).then(data => {
                                            if (data.success) {
                                                console.log(data.message)
                                            } else {
                                                console.log(data.message)
                                            }
                                            return true
                                        })
                                    } catch (error) {
                                        console.log(data.message)
                                        return false
                                    }
                                }).catch(error => {
                                    if (error.response && error.response.data) {
                                        const { data } = error.response
                                        if (data.message)
                                            console.log(data.message)
                                    }
                                    toast.update(loaderId, { render: "Something Gone Wrong!", type: "error", isLoading: false, autoClose: 3000 });
                                    return false
                                })
                            } catch (error) {
                                console.log("ERROR = ", error?.message)
                                return false
                            }
                        }
                        resolve(res);
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
        return false
    }
};


// read start and end time of random bake pizza
export const randomPizzaTimming = async () => {
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        // let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        // const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const startDT = await pizzaNftContract.methods.randomBakeStartTime().call()
        const endDT = await pizzaNftContract.methods.randomBakeEndTime().call()

        let startDateTime = new Date(startDT * 1000);
        let endDateTIme = new Date(endDT * 1000);
        let currentDateTime = new Date()

        if (startDateTime <= currentDateTime && endDateTIme >= currentDateTime) {
            return true
        } else {
            return false
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

export const getOwnerOfNFT = async (pizzaId) => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const owner = await pizzaNftContract.methods.ownerOf(pizzaId).call()
        return owner
    }
    catch (e) {
        return false;
    }
}

export const checkIngredientMints = async (ingredientId) => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const mints = await pizzaNftContract.methods.checkMints(ingredientId).call();
        return mints;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

export const getTotalRarityRewards = async () => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const total = await pizzaNftContract.methods.getTotalRarityRewards().call();
        return total;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

export const getRarityRewardOwner = async (index) => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const owner = await pizzaNftContract.methods.getRarityRewardOwner(index).call();
        return owner;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

export const getRarityRewardPizza = async (owner) => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const pizza = await pizzaNftContract.methods.getRarityRewardPizza(owner).call();
        return pizza;
    }
    catch (e) {
        console.log(e);
        return false;
    }
}

// purchase multiple ingredients
export const purchaseMultipleIngredients = async (ingIds, price, objIdsArr, userId) => {
    console.log(ingIds, price)
    const web3 = await getWeb3();
    if (!web3) {
        toast.error("No web3 instance found.");
        return false;
    }
    try {
        let connectedAddress = await connectToWallet();
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const txCount = await web3.eth.getTransactionCount(connectedAddress);
        const myNewData = await pizzaNftContract.methods.purchaseAndMintIngredients(ingIds).encodeABI()
        // const gasLimit = await web3.eth.estimateGas({
        //     from: connectedAddress,
        //     nonce: txCount,
        //     to: bitzNpizzaContractAddress,
        //     data: myNewData
        // })
        let weiPrice = web3.utils.toWei(`${price}`, 'ether');
        const gas2 = await web3.eth.getGasPrice()
        const transactionParameters = {
            nonce: web3.utils.toHex(txCount),
            gasPrice: web3.utils.toHex(gas2),
            // gasLimit: web3.utils.toHex(gasLimit),
            to: bitzNpizzaContractAddress,
            from: connectedAddress,
            data: myNewData,
            value: web3.utils.toHex(weiPrice)
        }

        // As with any RPC call, it may throw an error
        const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters],
        });
        if (txHash) {
            const loaderId = toast.loading("Transaction in progress...")
            await purchaseMultipleIngredientConfirmation(txHash, ingIds, loaderId, objIdsArr, userId)
            return true
        }
    } catch (e) {
        toast.error(e.message);
        return false;
    }
}

// mint pizza ingredients confirmation
const purchaseMultipleIngredientConfirmation = async (txHash, ingIds, loaderId, objIdsArr, userId) => {
    try {
        return new Promise((resolve, reject) => {
            checkStatus();
            function checkStatus() {
                const web3 = new Web3(Web3.givenProvider);
                web3.eth.getTransactionReceipt(txHash, async function (err, res) {
                    if (!res) {
                        await sleep(4000);
                        checkStatus();
                    } else {
                        let ingredients = []
                        for (let index = 0; index < objIdsArr.length; index++) {
                            ingredients.push({ _id: objIdsArr[index], ingUId: web3.utils.toNumber(res.logs[index].topics[3]) })
                        }

                        let formObj = {
                            ingredients,
                            userId
                        }

                        try {
                            fetch(`${ENV.url}ingredient/buy-multiple-ingredients`, {
                                method: 'POST',
                                headers: {
                                    'Authorization': ENV.Authorization,
                                    'x-auth-token': ENV.x_auth_token,
                                    'content-type': 'application/json'
                                },
                                body: JSON.stringify(formObj)
                            }).then(res => res.json()).then(data => {
                                if (data.success) {
                                    console.log(data.message)
                                } else {
                                    console.log(data.message)
                                }
                                toast.update(loaderId, { render: "Transaction Done, Successfully!", type: "success", isLoading: false, autoClose: 3000 });
                                return true
                            }).catch(error => {
                                if (error.response && error.response.data) {
                                    const { data } = error.response
                                    if (data.message)
                                        console.log(data.message)
                                }
                                toast.update(loaderId, { render: "Something Gone Wrong!", type: "error", isLoading: false, autoClose: 3000 });
                                return false
                            })
                        } catch (error) {
                            console.log("ERROR = ", error?.message)
                            return false
                        }
                        resolve(res);
                    }
                });
            }
        });
    } catch (e) {
        console.log("error");
    }
};


export const getIngredientsData = async (ingredientId) => {
    try {
        let pizzaNftContract = new Contract(contractAbi, bitzNpizzaContractAddress);
        const data = await pizzaNftContract.methods.getIngredientRarity(ingredientId).call()
        return data
    }
    catch (e) {
        toast.error(e.message);
        return false;
    }
}