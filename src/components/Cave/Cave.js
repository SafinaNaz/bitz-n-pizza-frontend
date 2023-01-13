import React, { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getUserIngredients, beforeUserIngredient, getRandomIngredients } from '../../redux/userIngredients/userIngredients.actions'
import { toPng } from 'html-to-image';
import { bakePizza, beforeBakePizza, getBakedPizzas, deletePizza, rebakePizzaIngredients, rebakedPizza, randomBakePizza, getBakedPizzasByUser } from './Cave.action';
import Loader from "react-loader-spinner";
import FullPageLoader from '../FullPageLoader/FullPageLoader';
import { mintNBakePizza, UnbakeBakePizza, mintRebakePizza, randomMintNBakePizza, randomPizzaTimming } from '../../utils/web3';
import { getCatgories } from '../../redux/Categories/categories.actions'
import SpecificLoader from '../SpecificLoader/SpecificLoader';
import AOS from "aos";
import "aos/dist/aos.css";
import { getWalletData, beforeWalletData } from '../Wallet/Wallet.action'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import { ingForBuyAndBake, beforeIngredient } from '../../redux/Ingredients/Ingredients.actions'
import { toast } from "react-toastify";

const Cave = (props) => {
    const parsedData = queryString.parse(props.props.location.search);
    const [page, setPage] = useState(1);
    // const [catSearch, setCatSearch] = useState(null)
    const [showBg, setShowBg] = useState(false)
    const [showUnbakedPizza, setShowUnbakedPizza] = useState(false)
    const [randomBake, setRandomBake] = useState(false)
    const [unbakeTxDone, setUnbakeTxDone] = useState(false)
    const [rebakeTxDone, setRebakeTxDone] = useState(false)
    const [bakeTxDone, setBakeTxDone] = useState(false)
    const [showRebake, setShowRebake] = useState(false)
    const [bakePizas, setBakePizas] = useState([]);
    const [ingredientForBaking, setIngredientForBaking] = useState([])

    // bake, sauce, meat, topping
    const [ingCatBase, setIngCatBase] = useState([])
    const [ingCatSauce, setIngCatSauce] = useState([])
    const [ingCatCheese, setIngCatCheese] = useState([])
    const [ingCatMeat, setIngCatMeat] = useState([])
    const [ingCatTopping, setIngCatTopping] = useState([])

    const [selectedIngredients, setselectedIngredients] = useState([]);
    const [extraIngrdients, setextraIngrdients] = useState([]);
    const [extraIngredientsChecker, setextraIngredientsChecker] = useState([]);
    const [burnIngredients, setBurnIngredients] = useState([])
    const [pizzaAssembly, setPizzaAssembly] = useState([]);
    const [selectedIngArr, setSelectedIngArr] = useState();

    // ingredient Arr To Be Sent In CreatePizzacheckedIng
    const [ingredientIDsArr, setIngredientIDsArr] = useState([])

    // const [pizzaDetail, setPizzaDetail] = useState({ isActive: true })
    const [actionTab, setActionTab] = useState(parsedData.tabValue ? parsedData.tabValue : "bake")
    const [selectedPizza, setSelectedPizza] = useState()
    // const [unbakedPizzaUsedIngredients, setUnbakedPizzaUsedIngredients] = useState([])
    const [randomPizzaIngredients, setRandomPizzaIngredients] = useState([])
    const [randomBakeTxDone, setRandomBakeTxDone] = useState(false)

    // array to handle the checkbox of selected ingredient on change 
    // const [checkedIng, setCheckedIng] = useState([])

    //state to manage Loader
    const [loader, setLoader] = useState(false)
    const [fullLoader, setFullLoader] = useState(true)

    // pizza validation error message
    const [pizzaValidationError, setPizzaValidationError] = useState('')

    // mintedIds
    //baseId, sauceId, cheeseId, meatId, toppingId
    const [baseId, setBaseId] = useState()
    const [sauceId, setSauceId] = useState()
    const [cheeseId, setCheeseId] = useState()
    const [meatId, setMeatId] = useState([])
    const [toppingId, setToppingId] = useState([])

    const [randomLoader, setRandomLoader] = useState(true)
    const [isRandomAvailable, setIsRandomAvailable] = useState(false)

    const [rebakeTxMsg, setRebakeTxMsg] = useState('')
    const [bakeTxMsg, setBakeTxMsg] = useState('')

    // old ingredients to pass in rebake contract methods
    const [oldIngredients, setOldIngredients] = useState([])
    const [walletType, setWalletType] = useState("ingredient")

    const [buybakeselectedIngArr, setbuybakeselectedIngArr] = useState([])
    const [buyBakeAssembly, setBuyAndBakeAssembly] = useState([])
    const [buyBakeTxDone, setBuyBakeTxDone] = useState(false)
    // const [buyAnBakePrice, setBuyAndBakePrice] = useState()
    const [buyBakeTxMsg, setBuyBakeTxMsg] = useState('')

    const [randomPizzaBtn, setRandomPizzaBtn] = useState(false)

    useEffect(()=> {
        setextraIngrdients([])
        setBurnIngredients([])
        setShowRebake(false)
    }, [selectedPizza])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        props.getCatgories();
    },[])
    
    useEffect(() => {
        if (parsedData && parsedData.tabValue === "buyAndBake") {
            setBuyAndBakeAssembly([])
            setbuybakeselectedIngArr([])
            fetchByAndBakeIngredient()
        }
    }, [parsedData?.tabValue === "buyAndBake"])

    useEffect(() => {
        setPage(1)
        if (props?.user?._id) {
            props.beforeWalletData()
            props.getWalletData(props?.user?._id, '', walletType)
        }
    }, [walletType])

    useEffect(() => {
        // alert(actionTab)
        if (actionTab === "bake") {
            manageBakeIngredient()
            setBakeTxDone(false)
        } else if (actionTab === "unbake" || actionTab === "rebake") {
            props.beforeBakePizza()
            if (props?.user?._id) {
                props.getBakedPizzasByUser('', { userId: props?.user?._id })
            }
            setSelectedPizza("")
            setShowRebake(false)
            setShowUnbakedPizza(false)
        } else if (actionTab === "randomBake") {

        } else if (actionTab === "buyAndBake") {
            setBuyAndBakeAssembly([])
            setbuybakeselectedIngArr([])
            // fetchByAndBakeIngredient()
        } else if (actionTab === "myWallet") {
            setPage(1)
            if (props?.user?._id) {
                props.beforeWalletData()
                props.getWalletData(props?.user?._id, '', walletType)
            }
        }
        setRandomBake(false)

    }, [actionTab])

    const fetchByAndBakeIngredient = async () => {
        props.beforeIngredient()
        props.ingForBuyAndBake()
    }

    useEffect(() => {
        if (props.cave.getBakedPizzaAuth) {
            setBakePizas(props.cave.bakedPizzas)
        }
    }, [props.cave.getBakedPizzaAuth])


    const bakePizzaFn = async (_id, userIngredients, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId) => {
        // calling the contract mehtod mintNBakePizza
        const res = await mintNBakePizza(_id, userIngredients, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId)
        // clearing the state 
        setBaseId(null)
        setSauceId(null)
        setCheeseId(null)
        setMeatId(null)
        setToppingId(null)

        props.beforeBakePizza()
        props.beforeUserIngredient()
        if (props.user) {
            props.getUserIngredients(props.user._id);
        }
        if (res) {
            setBakeTxDone(true)
            setLoader(false);
            setBakeTxMsg("Your Transaction Done, Successfully")
        } else {
            setBakeTxMsg("Your Transaction is Cancelled.")
            setBakeTxDone(true)
            setLoader(false);
        }

    }

    useEffect(() => {
        if (props.cave.createBakePizzaAuth) {
            if (props.cave.bakePizza.success) {
                let pizzaData = props.cave.bakePizza.data
                const { contentIpfs, _id, userIngredients } = pizzaData
                bakePizzaFn(_id, userIngredients, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId)
            }
        }
    }, [props.cave.createBakePizzaAuth])


    const unbakePizzaFn = async (pizzaId) => {

        const uIngIds = []
        Promise.all(selectedIngredients.map((e) => {
            uIngIds.push(e._userIngredientId)
        }))

        // calling contract method to unbake the pizza
        await UnbakeBakePizza(pizzaId, uIngIds)
        setUnbakeTxDone(true)
        setLoader(false)
        setShowUnbakedPizza(false)
        props.beforeBakePizza()
        if (props.user._id) {
            props.getBakedPizzasByUser('', { userId: props.user._id })
        }
        props.beforeBakePizza()
        props.beforeUserIngredient()
        if (props.user) {
            props.getUserIngredients(props.user._id);
            props.beforeWalletData()
            setPage(1)
            props.getWalletData(props.user._id, '', walletType)
        }
    }

    useEffect(() => {
        if (props.cave.unbakePizzaAuth) {
            if (props.cave.unbakePizza.success) {
                let pizza = props.cave.unbakePizza.pizza
                unbakePizzaFn(pizza._pizzaId)
            }
            // setUnbakedPizzaUsedIngredients(props.cave.unbakePizza.usedIngedients)


        }
    }, [props.cave.unbakePizzaAuth])


    useEffect(() => {
        if (props.cave.rebakePizzaIngredientsAuth) {
            setselectedIngredients(props.cave.rebakePizzaIngredients)

            let ingredients = props.cave.rebakePizzaIngredients

            let oldIds = []
            Promise.all(ingredients.map((e) => {
                oldIds.push(e._userIngredientId)
            }))

            setOldIngredients(oldIds)

            if (actionTab === 'unbake') {
                setShowUnbakedPizza(true)
            }

            let extraArr = []
            Promise.all(props.userIngredients.map((e) => {
                if (e.isUsed === false) {
                    extraArr.push({
                        Ing_id: e.Ing_id,
                        catType: e.catType,
                        image: e.image,
                        pizzaImage: e.pizzaImage,
                        isUsed: e.isUsed,
                        name: e.name,
                        price: e.price,
                        _id: e.UId,
                        _userIngredientId: e._userIngredientId
                    })
                }
            }))
            setextraIngrdients(extraArr)
            setextraIngredientsChecker(extraArr)
            props.beforeBakePizza()
        }
    }, [props.cave.rebakePizzaIngredientsAuth])

    const rebakeFn = async (pizzaObjectId, _id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId) => {
        let newIngredients = [baseId]
        if(sauceId){
            newIngredients.push(sauceId)
        }
        if(cheeseId){
            newIngredients.push(cheeseId)
        }
        if(meatId){
            for (let index = 0; index < meatId.length; index++) {
                const element = meatId[index];
                newIngredients.push(element)
            }
        }
        if(toppingId){
            for (let index = 0; index < toppingId.length; index++) {
                const element = toppingId[index];
                newIngredients.push(element)
            }
        }

        // find the burn ingredients
        let arr1 = oldIngredients
        let arr2 = newIngredients
        let uniqueIng = []
        for (let index = 0; index < arr1.length; index++) {
            let ele1 = arr1[index];
            let isPresent = arr2.includes(ele1);
            if(!isPresent){
                uniqueIng.push(ele1)
            }
        }

        // calling the contract mehtod mintNBakePizza
        const res = await mintRebakePizza(pizzaObjectId, _id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId, oldIngredients, uniqueIng)
        if (res) {
            setLoader(false)
            setRebakeTxDone(true)
            setRebakeTxMsg("Your Transaction Done Successfully.")
            // clearing the state 
            setBaseId(null)
            setSauceId(null)
            setCheeseId(null)
            setMeatId(null)
            setToppingId(null)
            props.beforeBakePizza()
            if (props.user._id) {
                props.getBakedPizzasByUser('', { userId: props.user._id })
                props.beforeUserIngredient()
                props.getUserIngredients(props.user._id);
                props.beforeWalletData()
                setPage(1)
                props.getWalletData(props.user._id, '', walletType)
            }
        } else {
            setLoader(false)
            setRebakeTxDone(true)
            setRebakeTxMsg("Your Transaction is Cancelled.")
        }
    }

    useEffect(async () => {
        if (props.cave.rebakedPizzaAuth) {
            if (props.cave.rebakedPizza.success) {

                let pizzaData = props.cave.rebakedPizza.pizza
                const { contentIpfs, _pizzaId: _id, pizzaObjectId, ingredients } = pizzaData
                rebakeFn(pizzaObjectId, _id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId)

            }
        }

    }, [props.cave.rebakedPizzaAuth])

    // ingredientForBaking separate by category type
    useEffect(() => {

        let baseArr = []
        let sauceArr = []
        let cheeseArr = []
        let meatArr = []
        let toppingArr = []

        for (let i = 0; i < ingredientForBaking.length; i++) {
            const e = ingredientForBaking[i];
            if (e.catType === "base") {
                baseArr.push(e)
            } else if (e.catType === "sauce") {
                sauceArr.push(e)
            } else if (e.catType === "cheese") {
                cheeseArr.push(e)
            } else if (e.catType === "meat") {
                meatArr.push(e)
            } else if (e.catType === "topping") {
                toppingArr.push(e)
            } else { }
        }

        setIngCatBase([...baseArr])
        setIngCatSauce([...sauceArr])
        setIngCatCheese([...cheeseArr])
        setIngCatMeat([...meatArr])
        setIngCatTopping([...toppingArr])

    }, [ingredientForBaking])

    // to manage the category search tab
    // useEffect(() => {
    //     setFullLoader(true)
    //     props.beforeUserIngredient()
    //     if (catSearch && props?.user) {
    //         if (catSearch === "all") {
    //             props.getUserIngredients(props?.user?._id)
    //         } else {
    //             props.getUserIngredients(props?.user?._id, '', { ingredientType: catSearch })
    //         }
    //     }
    // }, [catSearch])

    useEffect(() => {
        manageBakeIngredient()
        props.beforeBakePizza()
        if (props?.user?._id) {
            props.getBakedPizzasByUser('', { userId: props?.user?._id })
        }

    }, [props.userIngredients])

    useEffect(() => {
        if (props.randomPizzaIngredient?.success) {
            let randomPizzaIngredients = props.randomPizzaIngredient.data

            // console.log("randomPizzaIngredientsrandomPizzaIngredientsrandomPizzaIngredients",randomPizzaIngredients)
            
            if(!randomPizzaIngredients?.base){
                toast.error("Not Enough Ingredients Available.")
                return 
            }
            let arrRandom = [randomPizzaIngredients?.base, randomPizzaIngredients?.sauce, randomPizzaIngredients?.cheese]
            // [...randomPizzaIngredients?.meat], [...randomPizzaIngredients?.topping]
            // setRandomPizzaIngredients()
            if(randomPizzaIngredients?.meat){
                arrRandom.push([...randomPizzaIngredients?.meat])
            }else {
                arrRandom.push([])
            }

            if(randomPizzaIngredients?.topping){
                arrRandom.push([...randomPizzaIngredients?.topping])
            }else {
                arrRandom.push([])
            }
            setRandomPizzaIngredients([...arrRandom])
        } else {
            // toast.error("Not Enough Ingredients.")
        }

    }, [props.randomPizzaIngredient])

    useEffect(() => {
        if (randomPizzaIngredients.length) {
            setRandomBake(true)
            getRandomPizza()
        } else {
            return
        }
    }, [randomPizzaIngredients])

    const randomePizzaFn = async (_id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId, userID, ingredients) => {
        // calling the contract mehtod randomMintNBakePizza
        let res = null
        if (actionTab === "buyAndBake") {
            // ingredient price and 0.01 for the baking
            // console.log("buyBakeAssemblybuyBakeAssemblybuyBakeAssembly",buyBakeAssembly)
            let price = ingredients.length * 0.01
            price = parseFloat(price.toFixed(3));

            res = await randomMintNBakePizza(_id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId, userID, "buyAndBake", price)
            setBuyBakeTxDone(true)
            if (res) {
                setBuyBakeTxMsg("Transaction Done Successfully.")
            } else {
                setBuyBakeTxMsg("Something Gone Wrong!")
            }
        } else {
            res = await randomMintNBakePizza(_id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId, userID, "random", null)
        }

        // clearing the state 
        setBaseId(null)
        setSauceId(null)
        setCheeseId(null)
        setMeatId(null)
        setToppingId(null)
        setBakeTxDone(true)
        setLoader(false);
        setRandomLoader(false)
        setbuybakeselectedIngArr([])
        setBuyAndBakeAssembly([])
        if (res) {

            setRandomBakeTxDone(true)
            props.beforeBakePizza()
            props.beforeUserIngredient()
            if (props.user) {
                props.getUserIngredients(props.user._id);
            }

        } else {
            setRandomBake(false)
            setRandomPizzaIngredients([])
        }
    }

    useEffect(() => {
        if (props.cave.randomPizzaAuth) {
            if (props.cave.randomPizza.success) {
                let pizzaData = props.cave.randomPizza.data
                const { contentIpfs, _id, ingredients } = pizzaData
                if (props.user) {
                    randomePizzaFn(_id, contentIpfs, baseId, sauceId, cheeseId, meatId, toppingId, props.user._id, ingredients)
                }
            }
        }
    }, [props.cave.randomPizzaAuth])

    useEffect(() => {
        AOS.init({ duration: 600, });
        AOS.refresh();
    }, []);

    const randomtimming = async () => {
        const isRandomPizzaAvailableValue = await randomPizzaTimming()
        setIsRandomAvailable(isRandomPizzaAvailableValue)
        // console.log("isRandomPizzaAvailableisRandomPizzaAvailableisRandomPizzaAvailable",isRandomPizzaAvailableValue)
        //if true then set actiontab
        if(isRandomPizzaAvailableValue && !parsedData.tabValue){
            setActionTab("randomBake")
        }

        setFullLoader(false)

    }

    useEffect(() => {
        if (!props.walletData?.length) {
            setBakePizas([])
        }
        randomtimming()
    }, [props.walletData])

    const manageBakeIngredient = async () => {

        let arr = []
        Promise.all(
            props.userIngredients.map((uIngredient) => {
                if (uIngredient.isUsed === false) {
                    selectAssembledImg(({ _id: uIngredient._id }))
                    arr.push(uIngredient)
                }
            })
        )
        setIngredientForBaking(arr)
    }

    const unbakePizza = () => {
        props.deletePizza(selectedPizza)
        setShowUnbakedPizza(true)
        setLoader(true)
    }

    // pizza valdatin to bake
    const pizzaValidation = (baseId, sauceId, cheeseId, meatId, toppingId) => {

        let isValid = true
        let errMsg = ''
        if (!baseId) {
            isValid = false
            errMsg = "1x Base is required."
            return { isValid, errMsg }
        }

        return { isValid, errMsg }
    }

    const callCreatePizzaAPI = async (e) => {
        setPizzaValidationError('')
        setLoader(true);
        const userIngArr = []

        // checks to bake pizza
        let baseId = null
        let sauceId = null
        let cheeseId = null
        let meatId = []
        let toppingId = []

        Promise.all(pizzaAssembly.map(async (e) => {
            userIngArr.push(e._id)
            if (e.type === "base") {
                baseId = e._userIngredientId
            } else if (e.type === "sauce") {
                sauceId = e._userIngredientId
            } else if (e.type === "cheese") {
                cheeseId = e._userIngredientId
            } else if (e.type === "meat") {
                meatId.push(e._userIngredientId)
            } else if (e.type === "topping") {
                toppingId.push(e._userIngredientId)
            } else { }
        }))

        let res = await pizzaValidation(baseId, sauceId, cheeseId, meatId, toppingId)

        const { isValid, errMsg } = res
        if (!isValid) {
            setLoader(false);
            setPizzaValidationError(errMsg)
            return
        }

        // set the state for minted ids
        setBaseId(baseId)
        setSauceId(sauceId)
        setCheeseId(cheeseId)
        setMeatId(meatId)
        setToppingId(toppingId)

        // htmt to png
        toPng(document.getElementById("pizzaNode"), { cacheBust: true, })
            .then((dataUrl) => {
                let pizzaData = { isActive: true }
                pizzaData["image"] = dataUrl
                pizzaData["currentOwnerId"] = props.user._id
                pizzaData["creatorId"] = props.user._id
                pizzaData["ingredientIds"] = ingredientIDsArr
                pizzaData["userIngredientIds"] = userIngArr

                // bake pizza backend api call
                props.bakePizza(pizzaData)

                setPizzaAssembly([])
                setIngCatBase([])
                setIngCatSauce([])
                setIngCatCheese([])
                setIngCatMeat([])
                setIngCatTopping([])
                setShowBg(false)
                setIngredientForBaking([])
                setextraIngrdients([])
                setBurnIngredients([])
                // setextraIngredientsChecker([])
                // setCheckedIng([])
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getRebakePizzaIngredients = (pId) => {
        if (actionTab === "unbake") {
            props.rebakePizzaIngredients(pId)
        } else {
            props.rebakePizzaIngredients(selectedPizza)
        }

    }

    const rebakePizza = async () => {
        setLoader(true)
        const rebakeIngredientsIds = []
        const userIngredientArr = []

        // checks to bake pizza
        let baseId = null
        let sauceId = null
        let cheeseId = null
        let meatId = []
        let toppingId = []

        Promise.all(selectedIngredients.map(async (e) => {
            rebakeIngredientsIds.push(e.Ing_id)
            userIngredientArr.push(e._id)
            // console.log("selected Ingredients ==> ", e)
            if (e.catType === "base") {
                baseId = e._userIngredientId
            } else if (e.catType === "sauce") {
                sauceId = e._userIngredientId
            } else if (e.catType === "cheese") {
                cheeseId = e._userIngredientId
            } else if (e.catType === "meat") {
                meatId.push(e._userIngredientId)
            } else if (e.catType === "topping") {
                toppingId.push(e._userIngredientId)
            } else { }
        }))

        let res = await pizzaValidation(baseId, sauceId, cheeseId, meatId, toppingId)
        const { isValid, errMsg } = res
        if (!isValid) {
            setLoader(false);
            setPizzaValidationError(errMsg)
            setRebakeTxDone(true)
            return
        }

        // set the state for minted ids
        setBaseId(baseId)
        setSauceId(sauceId)
        setCheeseId(cheeseId)
        setMeatId(meatId)
        setToppingId(toppingId)

        // htmt to png
        toPng(document.getElementById("rebakePizzaNode"), { cacheBust: true, })
            .then((dataUrl) => {
                let rebakePizzaData = {
                    image: dataUrl,
                    ingredientIds: rebakeIngredientsIds,
                    userIngredients: userIngredientArr,
                    pizzaObjectId: selectedPizza
                }
                props.rebakedPizza(rebakePizzaData)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const getRandomPizzaIngredients = async () => {
        if (props.user) {
            setRandomBakeTxDone(false)
            setRandomLoader(true)
            props.getRandomIngredients(props?.user?._id)
        }
    }

    const getRandomPizza = async () => {

        if (props.randomPizzaIngredient && randomPizzaBtn) {
            // random bake pizza 
            const randomIngredientsIds = []
            // const userIngArr = []
            const mintedIds = []
            for (let i = 0; i < randomPizzaIngredients.length; i++) {
                let element = randomPizzaIngredients[i];
                if(Array.isArray(element)){
                    let arr = element
                    for (let index = 0; index < arr.length; index++) {
                        const element = arr[index];
                        randomIngredientsIds.push(element?._id)
                        mintedIds.push(element?._ingredientId)
                    }
                }else {
                    if(element?._id){
                        randomIngredientsIds.push(element?._id)
                        mintedIds.push(element?._ingredientId)
                    }
                }

                // if(element.catType === "base") {
                //     setBaseId(element?._ingredientId)
                // }else if(element.catType === "sauce") {
                //         setSauceId(element?._ingredientId)
                // }else if(element.catType === "cheese") {
                //     setCheeseId(element?._ingredientId)
                // }else if(element.catType === "meat") {
                //     console.log("cattype meat", element)
                //     let arr = meatId
                //     arr.push(element?._ingredientId)
                //     setMeatId([...arr])
                // }else if(element.catType === "topping") {
                //     console.log("cattype topping", element)
                //     let arr = toppingId
                //     arr.push(element?._ingredientId)
                //     setToppingId([...arr])
                // }
            }

            // set the state for minted ids
            setBaseId(randomPizzaIngredients[0]?._ingredientId)

            if (randomPizzaIngredients[1]) {
                setSauceId(randomPizzaIngredients[1]?._ingredientId)
            } else {
                setSauceId(0)
            }

            if (randomPizzaIngredients[2]) {
                setCheeseId(randomPizzaIngredients[2]?._ingredientId)
            } else {
                setCheeseId(0)
            }

            let meatIds = []
            Promise.all(randomPizzaIngredients[3]?.map((e) => {
                meatIds.push(e?._ingredientId)
            }))
            if (!meatIds.length || !meatIds[0]) {
                setMeatId([])
            } else {
                setMeatId([...meatIds])
            }

            let toppingIds = []
            Promise.all(randomPizzaIngredients[4]?.map((e) => {
                toppingIds.push(e?._ingredientId)
            }))
            if (!toppingIds.length || !toppingIds[0]) {
                setToppingId([])
            } else {
                setToppingId([...toppingIds])
            }

            // console.log("List of ingredient to be sent ",randomIngredientsIds)

            console.log("before load check")
            const res = await checkImagesLoaded(randomIngredientsIds)
            console.log("after load check")
            if(res){
                // htmt to png
                toPng(document.getElementById("randomPizzaNode"), { cacheBust: true, })
                .then((dataUrl) => {
                    let pizzaData = { isActive: true, name: "random" }

                    pizzaData["image"] = dataUrl
                    pizzaData["currentOwnerId"] = props?.user?._id
                    pizzaData["creatorId"] = props?.user?._id
                    pizzaData["ingredientIds"] = randomIngredientsIds

                    // console.log("Random Ingredients = ", randomIngredientsIds)
                    // bake pizza backend api call
                    props.randomBakePizza(pizzaData)
                    setRandomPizzaBtn(false)
                })
                .catch((err) => {
                    console.log(err)
                    getRandomPizza()
                })
            }else {
                return
            }
            // setTimeout(() => {
            //     // htmt to png
            //     toPng(document.getElementById("randomPizzaNode"), { cacheBust: true, })
            //         .then((dataUrl) => {
            //             let pizzaData = { isActive: true, name: "random" }

            //             pizzaData["image"] = dataUrl
            //             pizzaData["currentOwnerId"] = props?.user?._id
            //             pizzaData["creatorId"] = props?.user?._id
            //             pizzaData["ingredientIds"] = randomIngredientsIds

            //             // console.log("Random Ingredients = ", randomIngredientsIds)
            //             // bake pizza backend api call
            //             props.randomBakePizza(pizzaData)
            //         })
            //         .catch((err) => {
            //             console.log(err)
            //             getRandomPizza()
            //         })
            // }, 2000)
        }
    }

    const checkImagesLoaded = async(ids) => {
        console.log("IDS => ", ids)
        for(let index = 0; index < ids.length; index ++){
            const ele = ids[index];
            if(ele && ele !== "undefined"){
                let loaded = document.getElementById(ele)?.complete
                console.log(ele, loaded)
                if(loaded !== true ){
                    await sleep(400)
                    let newArr = ids.slice(index, ids.length)
                   return checkImagesLoaded(newArr)
                    
                }
            }
        }
        return true
    }
    const sleep = async (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
    };
    // fn to make the pizza ingredient assembled
    const selectAssembledImg = async (valObj) => {

        let arr = pizzaAssembly
        let isIngExist = false

        // if this element exist then remove it 
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element?._id === valObj?._id) {
                arr.splice(i, 1)
                isIngExist = true
                setPizzaAssembly(arr)
            }
        }

        // if element not exist then check validations
        if (!isIngExist) {

            /** 
             *  BASE
             * only one base is selected at the time
            */
            if (valObj.type === "base") {
                let arr = pizzaAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.type === "base") {
                        arr.splice(i, 1)
                        setPizzaAssembly(arr)
                    }
                }
                arr.push(valObj)
                setPizzaAssembly(arr)
            }

            /** 
             * SAUCE
             * only one sauce is selected at the time
            */
            if (valObj.type === "sauce") {
                let arr = pizzaAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.type === "sauce") {
                        arr.splice(i, 1)
                        setPizzaAssembly(arr)
                    }
                }
                arr.push(valObj)
                setPizzaAssembly(arr)
            }

            /** 
             * Cheese
             * only one cheese is selected at the time
            */
            if (valObj.type === "cheese") {
                let arr = pizzaAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.type === "cheese") {
                        arr.splice(i, 1)
                        setPizzaAssembly(arr)
                    }
                }
                arr.push(valObj)
                setPizzaAssembly(arr)
            }

            /** 
             * Meat
             * only upto 8 meat is selected at the time
            */
            if (valObj.type === "meat") {
                let arr = pizzaAssembly
                let numOfMeatIng = 0
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.type === "meat") {
                        numOfMeatIng++
                    }
                }
                if (numOfMeatIng < 8) {
                    arr.push(valObj)
                    setPizzaAssembly(arr)
                }
            }

            /** 
             * Toppings
             * only upto 8 toppings is selected at the time
            */
            if (valObj.type === "topping") {
                let arr = pizzaAssembly
                let numOfToppingIng = 0
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.type === "topping") {
                        numOfToppingIng++
                    }
                }
                if (numOfToppingIng < valObj.max) {
                    arr.push(valObj)
                    setPizzaAssembly(arr)
                }
            }
        }
        if (!pizzaAssembly.length) {
            setShowBg(false)
        } else {
            setShowBg(true)
        }

        let arrSelectedIng = []
        let arrOfIngID = []
        for (let i = 0; i < pizzaAssembly.length; i++) {
            arrSelectedIng.push(pizzaAssembly[i]._id)
            arrOfIngID.push(pizzaAssembly[i].ingID)
        }
        setSelectedIngArr(arrSelectedIng)
        setIngredientIDsArr(arrOfIngID)
        props.setForceRender(prevState => !prevState)
    }
    const hanldeLoadMore = () => {
        setFullLoader(true)
        setPage(0);
        props.beforeWalletData()
        props.getWalletData(props.user._id, `page=all`, walletType)
    }

    const rebakeAddIngValidation = (ingObj, ingObjIndex) => {
        let extraArr = []
        Promise.all(props.userIngredients.map((e) => {
            if (e.isUsed === false) {
                extraArr.push({
                    Ing_id: e.Ing_id,
                    catType: e.catType,
                    image: e.image,
                    pizzaImage: e.pizzaImage,
                    isUsed: e.isUsed,
                    name: e.name,
                    price: e.price,
                    _id: e.UId,
                    _userIngredientId: e._userIngredientId
                })
            }
        }))

        if (ingObj.catType === "base") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "base") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            extraIngrdients.splice(ingObjIndex, 1)
            setextraIngrdients([...extraIngrdients]);
        }
        else if (ingObj.catType === "sauce") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "sauce") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            extraIngrdients.splice(ingObjIndex, 1)
            setextraIngrdients([...extraIngrdients]);
        }else if (ingObj.catType === "cheese") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "cheese") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            extraIngrdients.splice(ingObjIndex, 1)
            setextraIngrdients([...extraIngrdients]);
        } else if (ingObj.catType === "meat") {
            let ingredientCount = 0
            Promise.all(selectedIngredients.map((e, index) => {
                if (e.catType === "meat") {
                    ingredientCount++
                }
            }))
            if (ingredientCount < 8) {
                selectedIngredients.push(ingObj)
                setselectedIngredients([...selectedIngredients]);
                extraIngrdients.splice(ingObjIndex, 1)
                setextraIngrdients([...extraIngrdients]);
            }
        } else if (ingObj.catType === "topping") {
            let ingredientCount = 0
            Promise.all(selectedIngredients.map((e, index) => {
                if (e.catType === "topping") {
                    ingredientCount++
                }
            }))
            if (ingredientCount < 8) {
                selectedIngredients.push(ingObj)
                setselectedIngredients([...selectedIngredients]);
                extraIngrdients.splice(ingObjIndex, 1)
                setextraIngrdients([...extraIngrdients]);
            }
        } else { }
    }

    const burnIngredientsValidations = (ingObj, ingObjIndex) => {
        let extraArr = []
        Promise.all(props.userIngredients.map((e) => {
            if (e.isUsed === false) {
                extraArr.push({
                    Ing_id: e.Ing_id,
                    catType: e.catType,
                    image: e.image,
                    pizzaImage: e.pizzaImage,
                    isUsed: e.isUsed,
                    name: e.name,
                    price: e.price,
                    _id: e.UId,
                    _userIngredientId: e._userIngredientId
                })
            }
        }))
        console.log("extraIngredientsCheckerextraIngredientsChecker",extraArr)

        let flag = true

        Promise.all(extraArr.map((e)=>{
            if(e._userIngredientId === ingObj._userIngredientId){
                selectedIngredients.splice(ingObjIndex, 1)
                extraIngrdients.push(ingObj)
                setselectedIngredients(selectedIngredients)
                setextraIngrdients([...extraIngrdients])
                flag = false
                return
            }
        }))

        if(flag){
            selectedIngredients.splice(ingObjIndex, 1)
            setselectedIngredients(selectedIngredients)
            burnIngredients.push(ingObj)
            setBurnIngredients([...burnIngredients])
        }
    }

    const validationBurnToSelected = (ingObj, ingObjIndex) => {
        // alert(ingObj.catType)
        let extraArr = []
        Promise.all(props.userIngredients.map((e) => {
            if (e.isUsed === false) {
                extraArr.push({
                    Ing_id: e.Ing_id,
                    catType: e.catType,
                    image: e.image,
                    pizzaImage: e.pizzaImage,
                    isUsed: e.isUsed,
                    name: e.name,
                    price: e.price,
                    _id: e.UId,
                    _userIngredientId: e._userIngredientId
                })
            }
        }))

        if (ingObj.catType === "base") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "base") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            burnIngredients.splice(ingObjIndex, 1)
            setBurnIngredients([...burnIngredients]);
        }
        else if (ingObj.catType === "sauce") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "sauce") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            burnIngredients.splice(ingObjIndex, 1)
            setBurnIngredients([...burnIngredients]);
        }else if (ingObj.catType === "cheese") {
            selectedIngredients.map((e, index) => {
                if (e.catType === "cheese") {
                    selectedIngredients.splice(index, 1)
                    setselectedIngredients([...selectedIngredients]);

                    let flag = true

                    Promise.all(extraArr.map((ingObj)=>{
                        if(e._userIngredientId === ingObj._userIngredientId){
                            extraIngrdients.push(e)
                            setextraIngrdients([...extraIngrdients])
                            flag = false
                            return
                        }
                    }))

                    if(flag){
                        burnIngredients.push(e)
                        setBurnIngredients([...burnIngredients])
                    }
                    return
                }
            })
            selectedIngredients.push(ingObj)
            setselectedIngredients([...selectedIngredients]);
            burnIngredients.splice(ingObjIndex, 1)
            setBurnIngredients([...burnIngredients]);
        } else if (ingObj.catType === "meat") {
            let ingredientCount = 0
            Promise.all(selectedIngredients.map((e, index) => {
                if (e.catType === "meat") {
                    ingredientCount++
                }
            }))
            if (ingredientCount < 8) {
                selectedIngredients.push(ingObj)
                setselectedIngredients([...selectedIngredients]);
                burnIngredients.splice(ingObjIndex, 1)
                setBurnIngredients([...burnIngredients]);
            }
        } else if (ingObj.catType === "topping") {
            let ingredientCount = 0
            Promise.all(selectedIngredients.map((e, index) => {
                if (e.catType === "topping") {
                    ingredientCount++
                }
            }))
            if (ingredientCount < 8) {
                selectedIngredients.push(ingObj)
                setselectedIngredients([...selectedIngredients]);
                burnIngredients.splice(ingObjIndex, 1)
                setBurnIngredients([...burnIngredients]);
            }
        } else { }
    }

    const manageBuyAndBakeIng = (valObj) => {

        // console.log(valObj)
        // check wheather it is exist or not 
        let arr = buyBakeAssembly
        let isIngExist = false

        // if this element exist then remove it 
        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            if (element?._id === valObj?._id) {
                arr.splice(i, 1)
                isIngExist = true
                setBuyAndBakeAssembly(arr)
            }
        }

        // if element not exist then check validations
        if (!isIngExist) {

            /** 
             *  BASE
             * only one base is selected at the time
            */
            if (valObj.catType === "base") {
                let arr = buyBakeAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.catType === "base") {
                        arr.splice(i, 1)
                        setBuyAndBakeAssembly(arr)
                    }
                }
                arr.push(valObj)
                setBuyAndBakeAssembly(arr)
            }

            /** 
             * SAUCE
             * only one sauce is selected at the time
            */
            if (valObj.catType === "sauce") {
                let arr = buyBakeAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.catType === "sauce") {
                        arr.splice(i, 1)
                        setBuyAndBakeAssembly(arr)
                    }
                }
                arr.push(valObj)
                setBuyAndBakeAssembly(arr)
            }

            /** 
             * Cheese
             * only one cheese is selected at the time
            */
            if (valObj.catType === "cheese") {
                let arr = buyBakeAssembly
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.catType === "cheese") {
                        arr.splice(i, 1)
                        setBuyAndBakeAssembly(arr)
                    }
                }
                arr.push(valObj)
                setBuyAndBakeAssembly(arr)
            }

            /** 
             * Meat
             * only upto 8 meat is selected at the time
            */
            if (valObj.catType === "meat") {
                let arr = buyBakeAssembly
                let numOfMeatIng = 0
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.catType === "meat") {
                        numOfMeatIng++
                    }
                }
                if (numOfMeatIng < 8) {
                    arr.push(valObj)
                    setBuyAndBakeAssembly(arr)
                }
            }

            /** 
             * Toppings
             * only upto 8 toppings is selected at the time
            */
            if (valObj.catType === "topping") {
                let arr = buyBakeAssembly
                let numOfToppingIng = 0
                for (let i = 0; i < arr.length; i++) {
                    const element = arr[i];
                    if (element?.catType === "topping") {
                        numOfToppingIng++
                    }
                }
                if (numOfToppingIng < 8) {
                    arr.push(valObj)
                    setBuyAndBakeAssembly(arr)
                }
            }
        }
        if (!buyBakeAssembly.length) {
            setShowBg(false)
        } else {
            setShowBg(true)
        }


        let ingArr = []
        for (let index = 0; index < buyBakeAssembly.length; index++) {
            const element = buyBakeAssembly[index];
            ingArr.push(element._id)
        }

        setbuybakeselectedIngArr(ingArr)
    }

    // buy and bake pizza ing
    const callBuyAndBakePizzaAPI = async (e) => {
        setPizzaValidationError('')
        setLoader(true);

        let ingredientIDsArr = []
        let price = 0

        // checks to bake pizza
        let baseId = null
        let sauceId = null
        let cheeseId = null
        let meatId = []
        let toppingId = []

        Promise.all(buyBakeAssembly.map(async (e) => {
            ingredientIDsArr.push(e._id)
            price += e.price
            if (e.catType === "base") {
                baseId = e._ingredientId
            } else if (e.catType === "sauce") {
                sauceId = e._ingredientId
            } else if (e.catType === "cheese") {
                cheeseId = e._ingredientId
            } else if (e.catType === "meat") {
                meatId.push(e._ingredientId)
            } else if (e.catType === "topping") {
                toppingId.push(e._ingredientId)
            } else { }
        }))

        let res = await pizzaValidation(baseId, sauceId, cheeseId, meatId, toppingId)

        const { isValid, errMsg } = res
        if (!isValid) {
            setLoader(false);
            setPizzaValidationError(errMsg)
            return
        }

        // set the state for minted ids
        setBaseId(baseId)
        setSauceId(sauceId)
        setCheeseId(cheeseId)
        setMeatId(meatId)
        setToppingId(toppingId)
        // setBuyAndBakePrice(price)

        // htmt to png
        toPng(document.getElementById("buyAndBakePizzaNode"), { cacheBust: true, })
            .then((dataUrl) => {
                let pizzaData = { isActive: true }
                pizzaData["image"] = dataUrl
                pizzaData["currentOwnerId"] = props.user._id
                pizzaData["creatorId"] = props.user._id
                pizzaData["ingredientIds"] = ingredientIDsArr

                // bake pizza backend api call
                props.randomBakePizza(pizzaData)
                // console.log(pizzaData)

                setBuyAndBakeAssembly([])
                setShowBg(false)
            })
            .catch((err) => {
                console.log(err)
            })
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
            <div className="cave"></div>
            <div className="about-cave">
                <h1>
                    Pizza Cave
                </h1>
            </div>
            <div className="cave-tabing">
                <div className="container-fluid">
                    <nav>
                        <div className="nav nav-tabs caving-tabs" id="nav-tab" role="tablist">
                            {
                                isRandomAvailable &&
                                <Link to="/pizzaCave?tabValue=randomBake" className={`nav-link nav-axe ${((isRandomAvailable && !parsedData.tabValue) || parsedData.tabValue === "randomBake") && "active"}`} id="nav-random" data-toggle="tab" data-target="#random" role="tab" aria-controls="random" aria-selected="true" onClick={() => { setActionTab("randomBake") }}>Random Bake</Link>
                            }
                            <Link to="/pizzaCave?tabValue=bake" className={`nav-link nav-axe ${((!isRandomAvailable && !parsedData.tabValue) || (parsedData.tabValue === "bake")) && "active"}`} id="nav-home-tab" data-toggle="tab" data-target="#nav-home" role="tab" aria-controls="nav-home" aria-selected="false" onClick={() => { setActionTab("bake") }}>Bake</Link>
                            <Link to="/pizzaCave?tabValue=buyAndBake" className={`nav-link nav-axe ${parsedData.tabValue === "buyAndBake" && "active"}`} id="nav-buyAndBake-tab" data-toggle="tab" data-target="#nav-buyAndBake" role="tab" aria-controls="nav-buyAndBake" aria-selected="false" onClick={() => { setActionTab("buyAndBake") }}>Buy &amp; Bake</Link>
                            <Link to="/pizzaCave?tabValue=unbake" className={`nav-link nav-axe ${parsedData.tabValue === "unbake" && "active"}`} id="nav-profile-tab" data-toggle="tab" data-target="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false" onClick={() => { setActionTab("unbake") }}>Unbake</Link>
                            <Link to="/pizzaCave?tabValue=rebake" className={`nav-link nav-axe ${parsedData.tabValue === "rebake" && "active"}`} id="nav-contact-tab" data-toggle="tab" data-target="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false" onClick={() => { setActionTab("rebake") }}>Rebake</Link>
                            <Link to="/pizzaCave?tabValue=myWallet" className={`nav-link nav-axe ${parsedData.tabValue === "myWallet" && "active"}`} id="nav-wallet-tab" data-toggle="tab" data-target="#nav-my-wallet" role="tab" aria-controls="nav-my-wallet" aria-selected="false" onClick={() => { setActionTab("myWallet") }}>My Wallet</Link>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className={`tab-pane fade ${((!isRandomAvailable && !parsedData.tabValue) || (parsedData.tabValue === "bake")) && "show active"}`} id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <div className="container-fluid">
                                <div className="baked">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Base
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        ingCatBase && ingCatBase.map((ingredient, index) => {
                                                            return (
                                                                <div key={index} className={`pizz ${selectedIngArr?.includes(ingredient.UId) && 'ing-border'}`}
                                                                    onClick={() => selectAssembledImg({ _id: ingredient.UId, ingID: ingredient.Ing_id, url: ingredient.image, pizzaImage: ingredient.pizzaImage, name: ingredient.name, type: ingredient.catType, max: ingredient.catMax, _userIngredientId: ingredient._userIngredientId })}
                                                                >
                                                                    <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Sauce
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        ingCatSauce && ingCatSauce.map((ingredient, index) => {
                                                            return (
                                                                <div key={index} className={`pizz ${selectedIngArr?.includes(ingredient.UId) && 'ing-border'}`}
                                                                    onClick={() => selectAssembledImg({ _id: ingredient.UId, ingID: ingredient.Ing_id, url: ingredient.image, pizzaImage: ingredient.pizzaImage, name: ingredient.name, type: ingredient.catType, max: ingredient.catMax, _userIngredientId: ingredient._userIngredientId })}
                                                                >
                                                                    <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Cheese
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        ingCatCheese && ingCatCheese.map((ingredient, index) => {
                                                            return (
                                                                <div key={index} className={`pizz ${selectedIngArr?.includes(ingredient.UId) && 'ing-border'}`}
                                                                    onClick={() => selectAssembledImg({ _id: ingredient.UId, ingID: ingredient.Ing_id, url: ingredient.image, pizzaImage: ingredient.pizzaImage, name: ingredient.name, type: ingredient.catType, max: ingredient.catMax, _userIngredientId: ingredient._userIngredientId })}
                                                                >
                                                                    <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Meat
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        ingCatMeat && ingCatMeat.map((ingredient, index) => {
                                                            return (
                                                                <div key={index} className={`pizz ${selectedIngArr?.includes(ingredient.UId) && 'ing-border'}`}
                                                                    onClick={() => selectAssembledImg({ _id: ingredient.UId, ingID: ingredient.Ing_id, url: ingredient.image, pizzaImage: ingredient.pizzaImage, name: ingredient.name, type: ingredient.catType, max: ingredient.catMax, _userIngredientId: ingredient._userIngredientId })}
                                                                >
                                                                    <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Toppings
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        ingCatTopping && ingCatTopping.map((ingredient, index) => {
                                                            return (
                                                                <div key={index} className={`pizz lizz ${selectedIngArr?.includes(ingredient.UId) && 'ing-border'}`}
                                                                    onClick={() => selectAssembledImg({ _id: ingredient.UId, ingID: ingredient.Ing_id, url: ingredient.image, pizzaImage: ingredient.pizzaImage, name: ingredient.name, type: ingredient.catType, max: ingredient.catMax, _userIngredientId: ingredient._userIngredientId })}
                                                                >
                                                                    <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className={`assembly ${showBg && 'show'}`} >
                                                <div id="pizzaNode"  >
                                                    <img alt="s_img" src="images/Table Top.png" className="img-fluid" />

                                                    {/* layer 1 base */}
                                                    {
                                                        pizzaAssembly.map((e) => {
                                                            if (e.type === "base") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz `} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 2 sauce */}
                                                    {
                                                        pizzaAssembly.map((e) => {
                                                            if (e.type === "sauce") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }


                                                    {/* layer 3 cheese */}
                                                    {
                                                        pizzaAssembly.map((e) => {
                                                            if (e.type === "cheese") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 4 meat */}
                                                    {
                                                        pizzaAssembly.map((e) => {
                                                            if (e.type === "meat") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 5 topping */}
                                                    {
                                                        pizzaAssembly.map((e) => {
                                                            if (e.type === "topping") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    //  data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {
                                                showBg && <div className="head-button cave-button">
                                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#bakeconfirmation" onClick={() => {setBakeTxDone(false)}} >BAKE</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {/* bake pizza confirmation prompt */}
                                    <div className="modal fade" id="bakeconfirmation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-content-inner">
                                                    <div className="modal-body">
                                                        {
                                                            bakeTxDone === false ?
                                                                <>
                                                                    {
                                                                        pizzaValidationError ? <h3>{pizzaValidationError}</h3> : <h3 className="bake-popup">Are you Sure ? </h3>
                                                                    }

                                                                    <div className="btn-toolbar">
                                                                        {!pizzaValidationError &&
                                                                            <button onClick={(e) => { callCreatePizzaAPI(e) }} className="btn btn-primary proceed-btn" disabled={loader ? true : false}>
                                                                                {
                                                                                    loader &&
                                                                                    <Loader
                                                                                        type="TailSpin"
                                                                                        color="#FFFFFF"
                                                                                        height={25}
                                                                                        width={25}
                                                                                    />
                                                                                }
                                                                                <span className="pl-4">Proceed</span>
                                                                            </button>
                                                                        }
                                                                        <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => { setBakeTxDone(false); setPizzaValidationError('') }}>Close</button>
                                                                    </div>
                                                                </> :
                                                                <>
                                                                    <h3 className="rebake-popup">{bakeTxMsg}</h3>
                                                                    <div className="btn-toolbar">
                                                                        <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => {setBakeTxDone(false); setLoader(false)}}>Close</button>
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`tab-pane fade ${parsedData.tabValue === "unbake" && "show active"} `} id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="margrita mint">
                                        {bakePizas && bakePizas.map((item, index) => {
                                            return (

                                                <div className="col-lg-4 col-md-7">
                                                    <div className="lingo springo" key={item._id}>
                                                        <div className="lingu">
                                                            <img alt="s_img" className="img-fluid" src={item.image} />
                                                            <div className="form-group custom-checkbox my-custom" >
                                                                <input type="checkbox" id={item._id} checked={selectedPizza === item._id ? true : false} onChange={() => {
                                                                    setSelectedPizza(item._id)
                                                                    getRebakePizzaIngredients(item._id)
                                                                }} />
                                                                <label for={item._id}></label>
                                                            </div>
                                                        </div>
                                                        {
                                                            selectedPizza === item._id &&
                                                            <div className="lingo-button">
                                                                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#unbakconfirmation" 
                                                                onClick={() => {setUnbakeTxDone(false); setSelectedPizza(item._id) }} 
                                                                >UNBAKE (0.05 ETH)</button>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {
                                            !bakePizas.length && <div className="not-found"><p>No Pizza Found.</p></div>
                                        }
                                    </div>
                                    </div>
                                    {/* <div className="col-md-5">
                                        {
                                            !showUnbakedPizza &&
                                                <div className="unbake-empty-box">
                                                    <p className="text-danger">Please Select pizza to Unbake</p>
                                                </div>
                                        }
                                        
                                        <div className={`unbaked ${showUnbakedPizza ? 'show' : ''}`}>
                                            <h3>Unbaked Pizza</h3>
                                            <p>Ingredient is added to your wallet as NFT</p>
                                            <div className="pizzeria">
                                                {
                                                    selectedIngredients?.map((item, index) => {
                                                        return (
                                                            <div className="pizz-label" key={item._id}>
                                                                <div className="pizz lizz" >
                                                                    <img alt="s_img" className="img-fluid" src={item.image} />
                                                                </div>
                                                                <p>{item.name}</p>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className="col-md-5">
                                        {
                                            !showUnbakedPizza ?
                                                <div className="unbake-empty-box">
                                                    <p className="text-danger">Please Select pizza to Unbake</p>
                                                </div>
                                            : 
                                            <div>
                                                <div className="pizzi-assemble">
                                                <h5>
                                                    Base
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                            if(ingredient.catType === "base"){
                                                                return (
                                                                    <div key={index} className={`pizz`}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Sauce
                                                </h5>
                                                <div className="pizzeria">
                                                {
                                                        selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                            if(ingredient.catType === "sauce"){
                                                                return (
                                                                    <div key={index} className={`pizz`}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Cheese
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                            if(ingredient.catType === "cheese"){
                                                                return (
                                                                    <div key={index} className={`pizz`}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Meat
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                            if(ingredient.catType === "meat"){
                                                                return (
                                                                    <div key={index} className={`pizz`}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Toppings
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                            if(ingredient.catType === "topping"){
                                                                return (
                                                                    <div key={index} className={`pizz`}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            </div>
                                        }
                                       
                                    </div>
                                </div>
                                
                                {/* confirmation prompt */}
                                <div className="modal fade" id="unbakconfirmation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered" role="document">
                                        <div className="modal-content">
                                            <div className="modal-content-inner">
                                                <div className="modal-body">
                                                    {
                                                        unbakeTxDone === true ?
                                                            <h3>Your Transaction Successfully Done.</h3> :
                                                            <>
                                                                <h3>Are you Sure?</h3>
                                                                <h5>You want to unbake the pizza?</h5>
                                                            </>
                                                    }
                                                    <div className="btn-toolbar">
                                                        {
                                                            unbakeTxDone === false &&
                                                            <button type="button" className="btn btn-primary proceed-btn" onClick={() => {
                                                                unbakePizza()
                                                            }}

                                                            disabled={loader ? true : false}
                                                            >
                                                                {
                                                                    loader &&
                                                                    <Loader
                                                                        type="TailSpin"
                                                                        color="#FFFFFF"
                                                                        height={25}
                                                                        width={25}
                                                                    />
                                                                }
                                                            Proceed</button>
                                                        }
                                                        <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => {setUnbakeTxDone(false);setLoader(false)}}>Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               
                            </div>
                        </div>
                        <div className={`tab-pane my-pane ${parsedData.tabValue === "rebake" && "show active"}`} fade id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                            <div className="container-fluid">
                                {
                                    bakePizas.length ?
                                        <h3>
                                            Select Pizza(s) to Rebake.
                                        </h3> : ""
                                }

                                <div className="margrita mint">
                                    {bakePizas && bakePizas.map((item, index) => {
                                        return (
                                            <div className="col-md-4 col-lg-3">
                                                <div className="lingo" key={item._id}>
                                                    <div className="lingu">
                                                        <img alt="s_img" className="img-fluid" src={item.image} />
                                                    </div>
                                                    <div className="form-group custom-checkbox my-custom" >
                                                        {
                                                            <>
                                                                <input type="checkbox" id={item._id} checked={selectedPizza === item._id ? true : false} onChange={() => {
                                                                    if (selectedPizza === item._id) {
                                                                        setSelectedPizza(null)
                                                                    } else {
                                                                        setSelectedPizza(item._id)
                                                                        setShowRebake(false)
                                                                    }
                                                                }} />
                                                                <label for={item._id}></label>
                                                            </>
                                                        }

                                                    </div>
                                                    {(selectedPizza === item._id) && <div className="head-button cave-button">
                                                        <button type="button" className="btn btn-primary"
                                                            onClick={() => {
                                                                setSelectedPizza(item._id)
                                                                getRebakePizzaIngredients()
                                                                setShowRebake(true)
                                                                let elmnt = document.getElementById("rebake-content");
                                                                elmnt.scrollIntoView();
                                                            }}
                                                        >REBAKE</button>
                                                    </div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {
                                        !bakePizas.length && <div className="not-found"><p>No Pizza Found.</p></div>
                                    }
                                </div>

                            </div>
                            {
                                <div className="container-fluid">
                                    <div id= "rebake-content" className={`rebake-pizza ${showRebake ? 'show' : ''}`}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="ree-bak">
                                                    <div>
                                                        <h3 className="txt-heading">Select the ingredients to Remove & Burn.</h3>
                                                        <div className="ingredients-list">
                                                            {selectedIngredients && selectedIngredients.map((ingredient, index) => {
                                                                // console.log("selectedIngredients", ingredient)
                                                                return (<div className="pizz-label">
                                                                    <div className="pizz liza" onClick={() => {
                                                                        // selectedIngredients.splice(index, 1)
                                                                        // extraIngrdients.push(ingredient)
                                                                        // setselectedIngredients(selectedIngredients)
                                                                        // setextraIngrdients([...extraIngrdients]);
                                                                        burnIngredientsValidations(ingredient, index)
                                                                    }} >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                    <p>{ingredient.name}</p>
                                                                </div>)
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="txt-heading">Select the ingredients to Add</h3>
                                                        <div className="ingredients-list">
                                                            {extraIngrdients && extraIngrdients.map((ingredient, index) => {
                                                                // console.log("extraIngrdients", ingredient)
                                                                return (<div className="pizz-label">
                                                                    <div className="pizz liza" onClick={() => {
                                                                        rebakeAddIngValidation(ingredient, index)
                                                                    }}>
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                    <p>{ingredient.name}</p>
                                                                </div>)
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="txt-heading">These ingredients will be burnt</h3>
                                                        <div className="ingredients-list">
                                                            {burnIngredients && burnIngredients.map((ingredient, index) => {
                                                                // console.log("extraIngrdients", ingredient)
                                                                return (<div className="pizz-label">
                                                                    <div className="pizz liza" onClick={() => {
                                                                        // rebakeAddIngValidation(ingredient, index)
                                                                        // burnIngredients.splice(index, 1)
                                                                        // selectedIngredients.push(ingredient)
                                                                        // setselectedIngredients(selectedIngredients)
                                                                        // setBurnIngredients([...burnIngredients]);

                                                                        validationBurnToSelected(ingredient, index)
                                                                    }}>
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                    <p>{ingredient.name}</p>
                                                                </div>)
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className={`assembly ${selectedIngredients.length && "show"}`} >
                                                    <div id="rebakePizzaNode"  >
                                                        <img alt="s_img" src="images/Table Top.png" className="img-fluid" />

                                                        {/* layer 1 base */}
                                                        {
                                                            selectedIngredients.map((e) => {
                                                                if (e.catType === "base") {
                                                                    return <img alt="s_img" src={e.pizzaImage}
                                                                        // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600"
                                                                        className={`img-fluid mini-pizz`} />
                                                                }else {
                                                                    return null
                                                                }
                                                            })
                                                        }
                                                        {/* layer 2 sauce */}
                                                        {
                                                            selectedIngredients.map((e) => {
                                                                if (e.catType === "sauce") {
                                                                    return <img alt="s_img" src={e.pizzaImage}
                                                                        // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                        className={`img-fluid mini-pizz in-padding`} />
                                                                }else {
                                                                    return null
                                                                }
                                                            })
                                                        }
                                                        {/* layer 3 cheese */}
                                                        {
                                                            selectedIngredients.map((e) => {
                                                                if (e.catType === "cheese") {
                                                                    return <img alt="s_img" src={e.pizzaImage}
                                                                        // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600"
                                                                        className={`img-fluid mini-pizz in-padding`} />
                                                                }else {
                                                                    return null
                                                                }
                                                            })
                                                        }
                                                        {/* layer 4 meat */}
                                                        {
                                                            selectedIngredients.map((e) => {
                                                                if (e.catType === "meat") {
                                                                    return <img alt="s_img" src={e.pizzaImage}
                                                                        // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                        className={`img-fluid mini-pizz in-padding`} />
                                                                }else {
                                                                    return null
                                                                }
                                                            })
                                                        }
                                                        {/* layer 5 topping */}
                                                        {
                                                            selectedIngredients.map((e) => {
                                                                if (e.catType === "topping") {
                                                                    return <img alt="s_img" src={e.pizzaImage}
                                                                        //  data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                        className={`img-fluid mini-pizz in-padding`} />
                                                                }else {
                                                                    return null
                                                                }
                                                            })
                                                        }

                                                    </div>
                                                </div>
                                                {
                                                    selectedIngredients.length &&
                                                    <div className="note">
                                                        <div className="head-button cave-button">
                                                            <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#rebakeconfirmation" onClick={() => {setRebakeTxDone(false)}}>REBAKE</button>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {/* rebake pizza confirmation prompt */}
                                        <div className="modal fade" id="rebakeconfirmation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-centered" role="document">
                                                <div className="modal-content">
                                                    <div className="modal-content-inner">
                                                        <div className="modal-body">
                                                            {
                                                                rebakeTxDone === false ?
                                                                    <>
                                                                        <h5>This will be the final button to click in the process to interact with the smart contract, with a pop up window to approve the transaction.</h5>
                                                                    </> :
                                                                    pizzaValidationError ?
                                                                        <h3 className="rebake-popup">{pizzaValidationError}</h3> :
                                                                        <h3 className="rebake-popup">{rebakeTxMsg}</h3>

                                                            }
                                                            <div className="btn-toolbar">
                                                                {
                                                                    rebakeTxDone === false &&
                                                                    <button type="button" className="btn btn-primary proceed-btn" onClick={() => {
                                                                        rebakePizza()
                                                                    }}
                                                                    disabled={loader ? true : false}
                                                                    >
                                                                        {
                                                                            loader &&
                                                                            <Loader
                                                                                type="TailSpin"
                                                                                color="#FFFFFF"
                                                                                height={25}
                                                                                width={25}
                                                                            />
                                                                        }
                                                                Proceed</button>
                                                                }
                                                                <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => {
                                                                    setRebakeTxDone(false)
                                                                    setShowRebake(pizzaValidationError ? true : false)
                                                                    setPizzaValidationError(''); 
                                                                    setLoader(false)
                                                                }}>Close</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className={`tab-pane random fade ${((isRandomAvailable && !parsedData.tabValue) || parsedData.tabValue === "randomBake") && "show active"}`} id="random" role="tabpanel" aria-labelledby="nav-random">
                            <div className="container-fluid">
                                <div className="content text-center">

                                    <>
                                        <h3 className="">
                                            {randomBake && randomBakeTxDone ? 'CONGRATULATIONS BLOCKCHAIN HAS SEND YOU A RANDOMLY CREATED PIZZA NFT!' : ' NEW HERE? NO INGREDIENTS? CAN’T DECIDE WHAT YOU WANT? NO WORRIES, JUST CLICK.'}
                                        </h3>


                                        {randomBake ?
                                            <div className="image">
                                                {
                                                    randomLoader && <SpecificLoader />
                                                }

                                                {/* random pizza */}
                                                {

                                                    <div className={`assembly show`} >
                                                        {
                                                            !randomPizzaIngredients.length ? <div className="avail"><p>Currently, No Ingredients Avaiable !</p></div>
                                                                :
                                                                < div id="randomPizzaNode" >
                                                                    <img alt="s_img" src="images/Table Top.png" className="img-fluid pizz-bg" />

                                                                    {/* layer 1 base */}

                                                                    {
                                                                        randomPizzaIngredients?.map((e, index) => {
                                                                            if (e?.catType === "base") {
                                                                                return <img alt="s_img" id={e._id} key={index} src={e.pizzaImage}
                                                                                    className={`img-fluid mini-pizz my-pizzz`} />
                                                                            }else {
                                                                                return null
                                                                            }
                                                                        })
                                                                    }

                                                                    {/* layer 2 sauce */}
                                                                    {
                                                                        randomPizzaIngredients?.map((e, index) => {
                                                                            if (e?.catType === "sauce") {
                                                                                return <img alt="s_img" id={e._id} key={index} src={e.pizzaImage}
                                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                                            }else {
                                                                                return null
                                                                            }
                                                                        })
                                                                    }


                                                                    {/* layer 3 cheese */}
                                                                    {
                                                                        randomPizzaIngredients?.map((e, index) => {
                                                                            if (e?.catType === "cheese") {
                                                                                return <img alt="s_img" id={e._id} key={index} src={e.pizzaImage}
                                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                                            }else {
                                                                                return null
                                                                            }
                                                                        })
                                                                    }

                                                                    {/* layer 4 meat */}
                                                                    {
                                                                        randomPizzaIngredients[3]?.map((e, index) => {
                                                                            if (e?.catType === "meat") {
                                                                                return <img alt="s_img" id={e._id} key={index} src={e?.pizzaImage}
                                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                                            }else {
                                                                                return null
                                                                            }
                                                                        })
                                                                    }

                                                                    {/* layer 5 topping */}
                                                                    {
                                                                        randomPizzaIngredients[4]?.map((e, index) => {
                                                                            if (e?.catType === "topping") {
                                                                                return <img alt="s_img" id={e._id} key={index} src={e?.pizzaImage}
                                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                                            }else {
                                                                                return null
                                                                            }
                                                                        })
                                                                    }
                                                                </div>
                                                        }

                                                    </div>
                                                }

                                            </div>
                                            :
                                            <div className="image pizzas-gif"><img src="images/Pizza.gif" alt="s_img" className="img-fluid" /></div>
                                        }

                                        {
                                            !randomBake ?
                                                <button className="btn btn-outline-primary" onClick={() => {
                                                    setRandomLoader(true)
                                                    setRandomPizzaIngredients([]);
                                                    props.beforeBakePizza()
                                                    getRandomPizzaIngredients();
                                                    setRandomPizzaBtn(true)
                                                }}>BAKE A RANDOM PIZZA</button>
                                                : !randomLoader ? <button className="btn btn-outline-primary" onClick={() => {
                                                    setRandomLoader(true)
                                                    setRandomPizzaIngredients([]);
                                                    props.beforeBakePizza()
                                                    getRandomPizzaIngredients();
                                                    setRandomPizzaBtn(true)
                                                }}>BAKE AGAIN</button> : ''
                                        }
                                    </>
                                </div>
                            </div>
                        </div>
                        <div className={`tab-pane fade ${parsedData.tabValue === "myWallet" && "show active"}`} id="nav-my-wallet" role="tabpanel" aria-labelledby="nav-wallet-tab">
                            <div className="container-fluid">
                                <ul className="nav nav-tabs naving-tabs mt-5" id="myTab" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <span className="nav-link nav-sax active" id="home-tab" data-toggle="tab" data-target="#home" role="tab" aria-controls="home" aria-selected="true" onClick={() => { setWalletType("ingredient") }}>Ingredients</span>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <span className="nav-link nav-sax" id="profile-tab" data-toggle="tab" data-target="#profile" role="tab" aria-controls="profile" aria-selected="false" onClick={() => { setWalletType("pizza") }}>Complete Pizzas</span>
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
                                                                <img alt="s_img" className="img-fluid" src={item?.image} />
                                                            </div>
                                                        </Link> :
                                                        <div className="mingo">
                                                            <img alt="s_img" className="img-fluid" src={item?.image} />
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
                        <div className={`tab-pane fade ${parsedData.tabValue === "buyAndBake" && "show active"}`} id="nav-buyAndBake" role="tabpanel" aria-labelledby="nav-buyAndBake-tab">
                            <div className="container-fluid">
                                <div className="baked">
                                    <div className="row">
                                        <div className="col-md-6">

                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Base
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        props.buyAndBakeIngredients && props.buyAndBakeIngredients.map((ingredient, index) => {
                                                            if (ingredient.catType === "base") {
                                                                return (
                                                                    <div key={index} className={`pizz ${buybakeselectedIngArr?.includes(ingredient._id) && 'ing-border'}`}
                                                                        onClick={() => manageBuyAndBakeIng(ingredient)}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }else {
                                                                return null 
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Sauce
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        props.buyAndBakeIngredients && props.buyAndBakeIngredients.map((ingredient, index) => {
                                                            if (ingredient.catType === "sauce") {
                                                                return (
                                                                    <div key={index} className={`pizz ${buybakeselectedIngArr?.includes(ingredient._id) && 'ing-border'}`}
                                                                        onClick={() => manageBuyAndBakeIng(ingredient)}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }else {
                                                                return null 
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Cheese
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        props.buyAndBakeIngredients && props.buyAndBakeIngredients.map((ingredient, index) => {
                                                            if (ingredient.catType === "cheese") {
                                                                return (
                                                                    <div key={index} className={`pizz ${buybakeselectedIngArr?.includes(ingredient._id) && 'ing-border'}`}
                                                                        onClick={() => manageBuyAndBakeIng(ingredient)}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }else {
                                                                return null 
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Meat
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        props.buyAndBakeIngredients && props.buyAndBakeIngredients.map((ingredient, index) => {
                                                            if (ingredient.catType === "meat") {
                                                                return (
                                                                    <div key={index} className={`pizz ${buybakeselectedIngArr?.includes(ingredient._id) && 'ing-border'}`}
                                                                        onClick={() => manageBuyAndBakeIng(ingredient)}
                                                                    >
                                                                        <img alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }else {
                                                                return null 
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            <div className="pizzi-assemble">
                                                <h5>
                                                    Toppings
                                                </h5>
                                                <div className="pizzeria">
                                                    {
                                                        props.buyAndBakeIngredients && props.buyAndBakeIngredients.map((ingredient, index) => {
                                                            if (ingredient.catType === "topping") {
                                                                return (
                                                                    <div key={index} className={`pizz lizz ${buybakeselectedIngArr?.includes(ingredient._id) && 'ing-border'}`}
                                                                        onClick={() => manageBuyAndBakeIng(ingredient)}
                                                                    >
                                                                        <img  alt="s_img" className="img-fluid" src={ingredient.image} />
                                                                    </div>
                                                                )
                                                            }else {
                                                                return null 
                                                            }
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className={`assembly ${showBg && 'show'}`} >
                                                <div id="buyAndBakePizzaNode"  >
                                                    <img  alt="s_img" src="images/Table Top.png" className="img-fluid" />

                                                    {/* layer 1 base */}
                                                    {
                                                        buyBakeAssembly?.map((e) => {
                                                            if (e.catType === "base") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz `} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 2 sauce */}
                                                    {
                                                        buyBakeAssembly?.map((e) => {
                                                            if (e.catType === "sauce") {
                                                                return <img alt="s_img"  src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }


                                                    {/* layer 3 cheese */}
                                                    {
                                                        buyBakeAssembly?.map((e) => {
                                                            if (e.catType === "cheese") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 4 meat */}
                                                    {
                                                        buyBakeAssembly?.map((e) => {
                                                            if (e.catType === "meat") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    // data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        })
                                                    }

                                                    {/* layer 5 topping */}
                                                    {
                                                        buyBakeAssembly?.map((e) => {
                                                            if (e.catType === "topping") {
                                                                return <img alt="s_img" src={e.pizzaImage}
                                                                    //  data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600" 
                                                                    className={`img-fluid mini-pizz in-padding`} />
                                                            }else {
                                                                return null
                                                            }
                                                        }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                showBg && <div className="head-button cave-button">
                                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#buybakeconfirmation" onClick={() => { setBuyBakeTxDone(false)}}>BUY &amp; BAKE</button>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    {/* buy and bake pizza confirmation prompt */}
                                    <div className="modal fade" id="buybakeconfirmation" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-content-inner">
                                                    <div className="modal-body">
                                                        {
                                                            buyBakeTxDone === false ?
                                                                <>
                                                                    {
                                                                        pizzaValidationError ? <h3>{pizzaValidationError}</h3> : <h3 className="bake-popup">Are you Sure ? </h3>
                                                                    }

                                                                    <div className="btn-toolbar">
                                                                        {!pizzaValidationError &&
                                                                            <button onClick={(e) => { callBuyAndBakePizzaAPI(e) }} className="btn btn-primary proceed-btn" disabled={loader ? true : false}>
                                                                                {
                                                                                    loader &&
                                                                                    <Loader
                                                                                        type="TailSpin"
                                                                                        color="#FFFFFF"
                                                                                        height={25}
                                                                                        width={25}
                                                                                    />
                                                                                }
                                                                                <span className="pl-4">Proceed</span>
                                                                            </button>
                                                                        }
                                                                        <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => { setBuyBakeTxDone(false); setPizzaValidationError(''); setLoader(false) }}>Close</button>
                                                                    </div>
                                                                </> :
                                                                <>
                                                                    <h3 className="rebake-popup">{buyBakeTxMsg}</h3>
                                                                    <div className="btn-toolbar">
                                                                        <button type="button" className="btn close-btn" data-dismiss="modal" onClick={() => setBuyBakeTxDone(false)}>Close</button>
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
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

const mapStateToProps = (state) => {
    return {
        userIngredients: state?.userIngredients?.userIngredients,
        randomPizzaIngredient: state?.userIngredients?.randomPizzaIngredient,
        pagination: state?.userIngredients?.pagination,
        categories: state?.category?.categories,
        user: state.user.userData,
        userAuth: state.user.userAuth,
        cave: state.cave,
        walletData: state.wallet.data,
        walletPagination: state.wallet.pagination,
        buyAndBakeIngredients: state?.ingredient?.ingredients,
    };
}

export default connect(mapStateToProps, { randomBakePizza, getRandomIngredients, getUserIngredients, bakePizza, beforeBakePizza, getBakedPizzas, deletePizza, rebakePizzaIngredients, rebakedPizza, beforeUserIngredient, getCatgories, getBakedPizzasByUser, getWalletData, beforeWalletData, ingForBuyAndBake, beforeIngredient })(Cave)
