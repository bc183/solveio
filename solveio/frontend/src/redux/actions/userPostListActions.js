import axiosInstance from "../../axios/axiosInstance"
import { USER_POST_LIST_FAILURE, USER_POST_LIST_REQUEST, USER_POST_LIST_SUCCESS } from "../constants/userPostListConstants";

export const getUserPostsList = (page, id) => async (dispatch) => {
    try {
        dispatch({ type: USER_POST_LIST_REQUEST });
        const response = await axiosInstance.get(`/posts/user/${id}/?page=${page}`);
        dispatch({ type: USER_POST_LIST_SUCCESS, payload: {data: response.data, page: page }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: USER_POST_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}