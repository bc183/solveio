import axiosInstance from "../../axios/axiosInstance"
import { SEARCH_LIST_FAILURE, SEARCH_LIST_REQUEST, SEARCH_LIST_SUCCESS } from "../constants/searchListConstants";

export const getSearchList = (page, searchTerm) => async (dispatch) => {
    try {
        let searchUrl;
        switch (searchTerm.charAt(0)) {
            case "#":
                searchUrl = "search-tag";
                searchTerm = searchTerm.substring(1);
                break;
            case "@":
                searchUrl = "search-users";
                searchTerm = searchTerm.substring(1);
                break;
            default:
                searchUrl = "search";
                break;
        }
        dispatch({ type: SEARCH_LIST_REQUEST });
        const response = await axiosInstance.get(`${searchUrl}/${searchTerm}/?page=${page}`);
        dispatch({ type: SEARCH_LIST_SUCCESS, payload: {data: response.data, page: page, isUser: searchUrl === "search-users" }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: SEARCH_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}