import axiosInstance from "../../axios/axiosInstance"
import { SEARCH_LIST_FAILURE, SEARCH_LIST_REQUEST, SEARCH_LIST_SUCCESS } from "../constants/searchListConstants";

export const getSearchList = (page, searchTerm) => async (dispatch) => {
    try {
        dispatch({ type: SEARCH_LIST_REQUEST });
        const response = await axiosInstance.get(`${searchTerm.charAt(0) === "#" ? "search-tag": "search"}/${searchTerm.charAt(0) === "#" ? searchTerm.substring(1): searchTerm}/?page=${page}`);
        dispatch({ type: SEARCH_LIST_SUCCESS, payload: {data: response.data, page: page }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: SEARCH_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}