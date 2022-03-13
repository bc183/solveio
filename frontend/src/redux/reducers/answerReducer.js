import { GET_ANSWER_REQUEST, GET_ANSWER_SUCCESS, GET_ANSWER_FAIL } from "../constants/answerConstants";

export const answerReducer = (state = { answer: {}, loading: false, errorMessage: null }, action) => {
    switch (action.type) {
        case GET_ANSWER_REQUEST:
            return {
                answer: null,
                loading: true,
                errorMessage: null,
            }
        case GET_ANSWER_SUCCESS:
            return {
                answer: action.payload,
                loading: false,
                errorMessage: null,
            }
        case GET_ANSWER_FAIL:
            return {
                answer: null,
                loading: false,
                errorMessage: action.payload,
            }
        default:
            return state;
    }
}