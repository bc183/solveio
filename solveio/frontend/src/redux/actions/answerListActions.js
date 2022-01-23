import axiosInstance from "../../axios/axiosInstance"
import { ANSWER_LIST_FAILURE, ANSWER_LIST_REQUEST, ANSWER_LIST_SUCCESS } from "../constants/answerListConstants";

export const getAnswersList = (page, postId) => async (dispatch) => {
    try {
        dispatch({ type: ANSWER_LIST_REQUEST });
        const response = await axiosInstance.get(`/answers/all/${postId}/?page=${page}`);
        dispatch({ type: ANSWER_LIST_SUCCESS, payload: {data: response.data, page: page }});
    } catch (error) {
        if (error.response.status === 404) {
            dispatch({ type: ANSWER_LIST_FAILURE, payload: "You are all caught up!" })
        }
        console.log(error.response.status);
    }
}