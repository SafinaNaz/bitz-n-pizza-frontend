import { toast } from 'react-toastify';
import { GET_ERRORS,GET_INGREDIENTS, BEFORE_INRGEDIENT} from '../../redux/types';
import { emptyError } from '../error/error.action';
import { ENV } from '../../config/config';

export const getIngredients = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}ingredient/list-by-category`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_INGREDIENTS,
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

export const beforeIngredient = () =>{
    return{
        type: BEFORE_INRGEDIENT
    }
}

// ingredient for buy and bake fn
export const ingForBuyAndBake = () => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}ingredient/list`;
    
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_INGREDIENTS,
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