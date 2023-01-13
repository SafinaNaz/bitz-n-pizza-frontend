import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_RARITY_REWARD_PIZZA, GET_RARITY_REWARD_PIZZA } from '../../redux/types';
import { emptyError } from '../../redux/error/error.action';
import { ENV } from '../../config/config';

export const getPizzaRarityRewards= (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}rarity-reward/list`;
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
                type: GET_RARITY_REWARD_PIZZA,
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

export const beforePizzaRarityRewards = () =>{
    return{
        type: BEFORE_RARITY_REWARD_PIZZA
    }
}