import { toast } from 'react-toastify';
import { GET_USER_INGREDIENTS,Buy_INGREDIENT,GET_ERRORS, BEFORE_USER_INRGEDIENT, RANDOM_PIZZA_INGREDIENTS} from '../types';
import { emptyError } from '../error/error.action';
import { ENV } from '../../config/config';

export const getUserIngredients = (userId, qs = '', body = {}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}ingredient/user-ingredients/${userId}`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_USER_INGREDIENTS,
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
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const buyIngredient = (body, method = 'POST') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}ingredient/buy-ingredient`;
    fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({...body})
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: Buy_INGREDIENT,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const beforeUserIngredient = () => {
    return {
        type: BEFORE_USER_INRGEDIENT
    }
}

// ingredients for random pizza bake
export const getRandomIngredients = (userId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}ingredient/ingredients-random-pizza`;
    if(userId){
        url = `${ENV.url}ingredient/ingredients-random-pizza/${userId}`
    }
    
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        },
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: RANDOM_PIZZA_INGREDIENTS,
                payload: data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};