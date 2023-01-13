import { GET_SETTINGS } from "../../redux/types";

const initialState = {
    setting: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SETTINGS:
            return {
                ...state,
                setting: action.payload
            }
        default:
            return {
                ...state
            }
    }
}