require('dotenv').config();
const CryptoJS = require("crypto-js");
const dataEncryptionKey = 'kalsaOOLLaASASAFFSSEE';
const moment = require('moment');

export const ENV = {
    // blockchain variables
    bitzNpizzaContractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    web3ProviderAddress: process.env.REACT_APP_WEB3_PROVIDER_ADDRESS,
    blockChainExplorer: process.env.REACT_APP_BLOCKCHAIN_EXPLORER,
    openSeaBaseUrl: process.env.REACT_APP_OPENSEA_BASEURL,
    domainURL: process.env.REACT_APP_DOMAIN_URL,

    // process variables
    url: process.env.REACT_APP_BASE_URL,
    assetUrl: process.env.REACT_APP_BASE_URL,
    currency: process.env.REACT_APP_CURRENCY,
    appName: process.env.REACT_APP_NAME,

    random_bake_price: process.env.REACT_APP_RANDOM_BAKE_PRICE,
    bake_price: process.env.REACT_APP_BAKE_PRICE,
    rebake_price: process.env.REACT_APP_REBAKE_PRICE,
    unbake_price: process.env.REACT_APP_UNBAKE_PRICE,

    requiredChainName: process.env.REACT_APP_REQUIRED_CHAIN_NAME,
    currencies: [
        {
            name: 'Binance',
            symbol: 'BNB',
            icon: '/img/binance.svg',
        },
        {
            name: 'Ethereum',
            symbol: 'ETH',
            icon: '/img/ethereum.svg',
        }
    ],
    serviceFee: 2.5,

    // Headers
    Authorization: `Bearer ${process.env.REACT_APP_AUTHORIZATION}`,
    x_auth_token: process.env.REACT_APP_X_AUTH_TOKEN,

    // default images placeholders
    globalPlaceholderImage: '/img/placeholder.png',
    collectionFeaturedImg: 'https://via.placeholder.com/600x450/8e8e8e/ccc.png',
    userDefaultImg: 'https://via.placeholder.com/600x600/8e8e8e/ccc.png',
    categoryDefaultImg: 'https://via.placeholder.com/600x450/8e8e8e/ccc.png',

    //set user in local storage
    encryptUserData: function (data) {
        let userData = localStorage.getItem('encuse');
        if (userData && !data.accessToken) {
            let bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
            let originalData = bytes.toString(CryptoJS.enc.Utf8);
            originalData = JSON.parse(originalData);
            if (originalData && originalData.accessToken) {
                data.accessToken = originalData.accessToken;
            }
        }
        data = JSON.stringify(data);
        let encryptedUser = CryptoJS.AES.encrypt(data, dataEncryptionKey).toString();
        localStorage.setItem('encuser', encryptedUser);
        return true;
    },

    //return required keys
    getUserKeys: function (keys = null) {
        let userData = localStorage.getItem('encuser');
        if (userData) {
            var bytes = CryptoJS.AES.decrypt(userData, dataEncryptionKey);
            var originalData = bytes.toString(CryptoJS.enc.Utf8);
            originalData = JSON.parse(originalData);
            let user = {};
            if (keys) {
                keys = keys.split(" ");
                for (let key in keys) {
                    let keyV = keys[key];
                    user[keyV] = originalData[keyV];
                }
            }
            else {
                user = originalData;
            }
            return user;
        }
        return {};
    },

    //Object to query string
    objectToQueryString: function (body) {
        const qs = Object.keys(body).map(key => `${key}=${body[key]}`).join('&');
        return qs;
    },

    //validate image types
    isValidImageType: function (file) {
        if (file && file.type) {
            const acceptableTypes = ['image/png', 'image/x-png', 'image/jpeg', 'image/jpg']
            return (acceptableTypes.includes(file.type.toLowerCase()))
        }
    },

    //slick configurations
    slickSettings: {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 4,
        slidesToScroll: 4,
        dots: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    margin: 15,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    },

    dateRangeInitialSettings: {
        startDate: moment(),
        endDate: moment().add(6, 'months').toDate(),
        minDate: moment(),
        maxDate: moment().add(6, 'months').toDate(),
        ranges: {
            '1 Day': [
                moment().toDate(),
                moment().add(1, 'days').toDate(),
            ],
            '3 Days': [
                moment().toDate(),
                moment().add(3, 'days').toDate(),
            ],
            '1 Week': [
                moment().toDate(),
                moment().add(6, 'days').toDate(),
            ],
        }
    },

    countDownRenderer: ({ days, hours, minutes, seconds }) => {
        return (
            <div className="countdown-container d-flex" style={{ justifyContent: "space-between", width: "85%" }}>
                <div className="countdown-wrapper m-1">
                    <div>Days</div>
                    <div>{days}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Hours</div>
                    <div>{hours}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Minutes</div>
                    <div>{minutes}</div>
                </div>
                <div className="countdown-wrapper m-1">
                    <div>Seconds</div>
                    <div>{seconds}</div>
                </div>
            </div>
        )
    }
}
