import axiosInstance from "../../axios/axiosInstance"
import { POST_LIST_FAILURE, POST_LIST_REQUEST, POST_LIST_SUCCESS } from "../constants/postListConstants";

export const getPostsList = (page) => async (dispatch) => {
    try {
        dispatch({ type: POST_LIST_REQUEST });
        const response = await axiosInstance.get(`/posts/all/?page=${page}`);
        dispatch({ type: POST_LIST_SUCCESS, payload: {data: response.data, page: page }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: POST_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}