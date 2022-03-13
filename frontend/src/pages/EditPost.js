import React, { useState, useEffect } from 'react'
import { getPost } from '../redux/actions/postActions';
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { EDIT_POST_REQUEST, EDIT_POST_SUCCESS, UNSET_CREATED_POST } from '../redux/constants/postConstants';
import PostForm from '../components/PostForm';
import axiosInstance from '../axios/axiosInstance';
import TrendingTags from '../components/TrendingTags';
import PopularUsers from '../components/PopularUsers';



export default function EditPost() {
    const { id } = useParams();
    const { post } = useSelector(state => state.post); 
    const dispatch = useDispatch();
    const [title, setTitle] = useState({ value: "", error: null });
    const [description, setDescription] = useState({ value: "", error: null });
    const [disabled, setDisabled] = useState(false);
    const [code, setCode] = useState("");
    const { loading, createdPost } = useSelector(state => state.post ?? {});
    useEffect(() => {
        dispatch(getPost(id));
    }, []);
    useEffect(() => {
        if (post) {
            setTitle({ value: post?.title, error: null });
            setDescription({ value: post?.body, error: null });
            setCode(post?.code_body ? post?.code_body: "");
        }
    }, [post])
    const navigate = useNavigate();
    const options = {
        position: 'top-right',
    }      
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    const handleEditPost = async () => {
        const data = {
            title: title.value,
            body: description.value,
            code_body: code.trim() === "" ? null: code,
        }

        try {
            dispatch({ type: EDIT_POST_REQUEST })
            const response = await axiosInstance.put(`posts/update/${id}/`, data);
            dispatch({ type: EDIT_POST_SUCCESS, payload: response.data });
            navigate(`/post/${id}`)
            openSnackbar("Question updated successfully.")
        } catch (error) {
            console.log(error);
            dispatch({ type: EDIT_POST_SUCCESS, payload: error.response.data });
        }
        
    }

    useEffect(() => {
        if (title.value === "" || description.value === "") {
            setDisabled(true);
            return;
        }
        setDisabled(false);
    }, [title.value, description.value])

    useEffect(() => {
        if (createdPost) {
            navigate("/")
            openSnackbar("Question posted Successfully.", [2000], )
            dispatch({ type: UNSET_CREATED_POST });
        }
    }, [createdPost, dispatch, navigate, openSnackbar])

    const handleTitleChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setTitle({
                value: value,
                error: "Please enter Title."
            });
            return;
        }

        setTitle({
            value: value,
            error: null
        });
    }

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
                    <p className="text-2xl text-white-50">Edit Question.</p>
                    <PostForm 
                        title={title} 
                        description={description} 
                        code={code} 
                        setCode={setCode}
                        handleDescriptionChange={handleDescriptionChange}
                        handleSuccess={handleEditPost}
                        handleTitleChange={handleTitleChange}
                        successLabel={"Save Changes"}
                        loading={loading}
                        disabled={disabled}
                        noTags
                        />
                </div>
                <TrendingTags />
            </div>
        </div>
    )
}
