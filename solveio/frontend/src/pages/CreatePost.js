import React, { useState, useEffect } from 'react'
import { createPost } from '../redux/actions/postActions';
import { useSnackbar } from 'react-simple-snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UNSET_CREATED_POST } from '../redux/constants/postConstants';
import PostForm from '../components/PostForm';
import PopularUsers from '../components/PopularUsers';
import TrendingTags from '../components/TrendingTags';



export default function CreatePost() {
    const [title, setTitle] = useState({ value: "", error: null });
    const [tags, setTags] = useState("");
    const [description, setDescription] = useState({ value: "", error: null });
    const [disabled, setDisabled] = useState(false);
    const [code, setCode] = useState("");
    const { loading, createdPost } = useSelector(state => state.post ?? {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const options = {
        position: 'top-right',
    }      
    const [openSnackbar, closeSnackbar] = useSnackbar(options);

    const handleCreatePost = () => {
        const tagsArray = tags.trim().length > 0 ? tags.split(" "): null;
        const data = {
            title: title.value,
            body: description.value,
            code_body: code.trim() === "" ? null: code,
            tags: tagsArray
        }
        dispatch(createPost(data));
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
                    <p className="text-2xl text-white-50">Ask a question.</p>
                    <PostForm 
                        title={title} 
                        description={description} 
                        code={code} 
                        setCode={setCode}
                        handleDescriptionChange={handleDescriptionChange}
                        handleSuccess={handleCreatePost}
                        handleTitleChange={handleTitleChange}
                        successLabel={"Post"}
                        loading={loading}
                        disabled={disabled}
                        tags={tags}
                        setTags={setTags}
                        />
                </div>
                <TrendingTags />
            </div>
        </div>
    )
}
