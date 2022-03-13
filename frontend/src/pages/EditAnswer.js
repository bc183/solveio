import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';
import axiosInstance from '../axios/axiosInstance';
import { getAnswer } from '../redux/actions/answerActions';
import { EDIT_ANSWER_FAIL, EDIT_ANSWER_REQUEST, EDIT_ANSWER_SUCCESS } from '../redux/constants/answerConstants';
import TrendingTags from '../components/TrendingTags';



export default function EditAnswer() {
    const { id } = useParams();
    const { answer, loading } = useSelector(state => state.answer); 
    const dispatch = useDispatch();
    const [description, setDescription] = useState({ value: "", error: null });
    const [disabled, setDisabled] = useState(false);
    const [code, setCode] = useState("");
    useEffect(() => {
        dispatch(getAnswer(id));
    }, []);
    useEffect(() => {
        if (answer) {
            setDescription({ value: answer?.body, error: null });
            setCode(answer?.code_body ? answer?.code_body: "");
        }
    }, [answer])
    const navigate = useNavigate();
    const options = {
        position: 'top-right',
    }      
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    const handleEditAanswer = async () => {
        const data = {
            body: description.value,
            code_body: code.trim() === "" ? null: code
        }

        try {
            dispatch({ type: EDIT_ANSWER_REQUEST })
            const response = await axiosInstance.put(`answers/update/${id}/`, data);
            dispatch({ type: EDIT_ANSWER_SUCCESS, payload: response.data });
            dispatch(getAnswer(id));
            openSnackbar("Answer updated successfully.")
        } catch (error) {
            console.log(error);
            dispatch({ type: EDIT_ANSWER_FAIL, payload: error.response.data });
        }
        
    }

    useEffect(() => {
        if (description.value === "") {
            setDisabled(true);
            return;
        }
        setDisabled(false);
    }, [description.value])

    const handleDescriptionChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setDescription({
                value: value,
                error: "Please enter Description."
            });
            return;
        }

        setDescription({
            value: value,
            error: null
        });
    }

    return (
        <div className="container-fluid background-home">
            <div className="row">
                <div className="col-12 col-md-6 offset-md-3 mt-2">
                    <p className="text-2xl text-white-50">Edit Answer.</p>
                    <PostForm 
                        description={description} 
                        code={code} 
                        setCode={setCode}
                        handleDescriptionChange={handleDescriptionChange}
                        handleSuccess={handleEditAanswer}
                        successLabel={"Save Changes"}
                        loading={loading}
                        disabled={disabled}
                        noTitle
                        noTags
                        />
                </div>
                <TrendingTags />
            </div>
        </div>
    )
}
