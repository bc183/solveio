import axiosInstance from "../../axios/axiosInstance"
import { USER_ANSWER_LIST_FAILURE, USER_ANSWER_LIST_REQUEST, USER_ANSWER_LIST_SUCCESS } from "../constants/userAnswerListConstants";

export const getUserAnswerList = (page, id) => async (dispatch) => {
    try {
        dispatch({ type: USER_ANSWER_LIST_REQUEST });
        const response = await axiosInstance.get(`/answers/user/${id}/?page=${page}`);
        dispatch({ type: USER_ANSWER_LIST_SUCCESS, payload: {data: response.data, page: page }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: USER_ANSWER_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}