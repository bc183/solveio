import React, { useState, useEffect } from 'react'
import { createPost } from '../redux/actions/postActions';
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UNSET_CREATED_POST } from '../redux/constants/postConstants';
import PostForm from '../components/PostForm';
import axiosInstance from '../axios/axiosInstance';
import PopularUsers from '../components/PopularUsers';
import TrendingTags from '../components/TrendingTags';

export default function CreateAnswer() {
    const { id } = useParams();
    const [description, setDescription] = useState({ value: "", error: null });
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [code, setCode] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const options = {
        position: 'top-right',
    }      
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    const handleCreateAnswer = async () => {
        const data = {
            body: description.value,
            code_body: code.trim() === "" ? null: code
        }
        
        try {
            setLoading(true);
            const response = await axiosInstance.post(`answers/${id}/`, data);
            console.log(response);
            navigate(`/post/${id}`);
            openSnackbar("Answered Succesfully.")
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
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
                <PopularUsers />
                <div className="col-12 col-md-6 mt-2">
                    <p className="text-2xl text-white-50">Answering to this <Link to={`/post/${id}`}>Post</Link></p>
                    <PostForm 
                        description={description} 
                        code={code} 
                        setCode={setCode}
                        handleDescriptionChange={handleDescriptionChange}
                        handleSuccess={handleCreateAnswer}
                        successLabel={"Answer"}
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
