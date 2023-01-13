import { GET_ARTISTS, GET_ERRORS, BEFORE_ARTISTS} from "../../redux/types";
import { ENV } from '../../config/config';
import { toast } from "react-toastify";
import { emptyError } from '../../redux/error/error.action'

export const beforeArtists = () => {
    return {
        type: BEFORE_ARTISTS
    }
}

export const getArtists = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}artist/list`;
    
    if(qs) {
        url += `?${qs}`
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_ARTISTS,
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
            dispatch({
                type: GET_ERRORS,
                payload: error
            })
        }
    })
};    

