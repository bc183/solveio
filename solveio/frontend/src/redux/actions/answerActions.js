import axiosInstance from "../../axios/axiosInstance";
import { GET_ANSWER_REQUEST, GET_ANSWER_SUCCESS } from "../constants/answerConstants";

export const getAnswer = (id) => async (dispatch) => {
    try {
        dispatch({ type: GET_ANSWER_REQUEST });
        const response = await axiosInstance.get(`/answers/get/${id}/`);
        dispatch({ type: GET_ANSWER_SUCCESS, payload: response.data });
    } catch (error) {
        console.log(error);
    }
} 