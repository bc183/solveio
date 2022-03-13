import { SET_SEARCH_TERM, UNSET_SEARCH_TERM } from "../constants/searchConstants";

export const searchReducer = (state = { searchTerm: "" }, action) => {
    switch (action.type) {
        case SET_SEARCH_TERM:
            return {
                searchTerm: action.payload
            }
        case UNSET_SEARCH_TERM:
            return {
                searchTerm: ""
            }
        default:
            return state
    }
}