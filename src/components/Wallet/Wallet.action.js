import { SET_WALLET_ADDRESS, GET_WALLET_ADDRESS, GET_ERRORS, GET_WALLET_DATA, BEFORE_WALLET_DATA } from '../../redux/types';
import { emptyError } from '../../redux/error/error.action';
import { ENV } from '../../config/config';

export const setWalletAddress = (address) => dispatch  => {
    dispatch({
        type: SET_WALLET_ADDRESS,
        payload: address
    })
}

export const beforeWalletData = () => dispatch  => {
    dispatch({
        type: BEFORE_WALLET_DATA
    })
}

export const getWalletAddress = () => dispatch =>  {
    dispatch({
        type: GET_WALLET_ADDRESS,
    })
}

export const getWalletData = (userId, qs = '', type, categoryId) => dispatch => {
    // alert("hello")
    dispatch(emptyError());
    let url = `${ENV.url}users/myWallet/${userId}`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ type : type, categoryId})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_WALLET_DATA,
                payload: data.data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            // const { data } = error.response
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};