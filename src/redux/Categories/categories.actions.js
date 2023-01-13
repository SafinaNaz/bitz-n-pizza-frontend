import { toast } from 'react-toastify';
import { GET_ERRORS,GET_CATEGORIES} from '../types';
import { emptyError } from '../error/error.action';
import {ENV} from './../../config/config'

export const getCatgories = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}/category/list`;

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
                type: GET_CATEGORIES,
                payload: data.categories
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
