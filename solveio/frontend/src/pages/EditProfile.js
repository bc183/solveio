import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import PopularUsers from "../components/PopularUsers";
import TrendingTags from '../components/TrendingTags';
import HashLoader from "react-spinners/HashLoader";
import TailwindCard from '../components/TailwindCard';
import RingLoader from "react-spinners/RingLoader";
import { useSnackbar } from 'react-simple-snackbar';
import axiosInstance from '../axios/axiosInstance';
import { getCurrentUser } from '../redux/actions/userActions';
import { Link } from 'react-router-dom';

export default function EditProfile() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [updateLoading, setUpdateLoading] = useState(false);
    const { user, loading } = useSelector(state => state.user)
    const [email, setEmail] = useState({ value: "", error: null });
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [username, setUsername] = useState({ value: "", error: null });
    const [firstName, setFirstName] = useState({ value: "", error: null });
    const [lastName, setLastName] = useState({ value: "", error: null });
    const [submitDisabled, setsubmitDisabled] = useState(true);
    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-center" })

    const handleUpdate = async () => {
        let formData = new FormData();
        if (file) {
            formData.append("profile_pic", file);
        }
        formData.append("user_name", username.value);
        formData.append("email", email.value);
        formData.append("first_name", firstName.value);
        formData.append("last_name", lastName.value);
        try {
            setUpdateLoading(true);
            const response = await axiosInstance.put(`users/update/${id}/`, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            dispatch(getCurrentUser());
            openSnackbar("Updated Successfully.")
            setUpdateLoading(false);
        } catch (error) {
            setUpdateLoading(false);
            setErrorMessage(error?.response?.data?.detail)
        }
        
    }

    const openInput = () => {
        const inputElement = document.getElementById("file-input");
        inputElement.click();
    }

    const handleFileChange = (e) => {
        const inputElement = document.getElementById("file-input");
        const [file] = inputElement.files;
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
        setFile(e.target.files[0]);
    }

    const handleEmailChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setEmail({
                value: value,
                error: "Please enter email."
            });
            return;
        }

        setEmail({
            value: value,
            error: null
        });
    }

    const handleFirstNameChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setFirstName({
                value: value,
                error: "Please enter First Name."
            });
            return;
        }

        setFirstName({
            value: value,
            error: null
        });
    }

    const handleLastNameChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setLastName({
                value: value,
                error: "Please enter Last Name."
            });
            return;
        }

        setLastName({
            value: value,
            error: null
        });
    }

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setUsername({
                value: value,
                error: "Please enter Username."
            });
            return;
        }

        setUsername({
            value: value,
            error: null
        });
    }

    useEffect(() => {
        if (Object.keys(user).length > 0) {
            setEmail({ value: user.email, error: null });
            setUsername({ value: user.user_name, error: null });
            setFirstName({ value: user.first_name, error: null });
            setLastName({ value: user.last_name, error: null });
        }
    }, [user])

    useEffect(() => {
        if (email.value === "" || username.value === "" || firstName.value === "" || lastName.value === "") {
            setsubmitDisabled(true);
            return;
        }
        setsubmitDisabled(false);
    }, [email.value, username.value, firstName.value, lastName.value])
  return (
    <div className="container-fluid background-home">
        <div className="row">
            <PopularUsers />
            <div className="col-12 col-md-6 mt-3">
            {loading && 
            <div className="flex justify-content-center align-items-center pt-40">
                <HashLoader size={100} color='gray'/>
            </div>}
            {!loading && <div>
                <h4 className="text-white-50 inline">Edit {user?.user_name}'s profile.</h4>
            </div>}
            {!loading && (
                <div className="mt-4">
                    <input id="file-input" onChange={handleFileChange} type="file" className="d-none"></input>
                    <TailwindCard bgClass={"bg-dark"}>
                        <div className="flex align-items-center justify-center flex-column mb-3" >
                            <img className="hover:cursor-pointer" width={300} height={300} src={preview ? preview: user?.profile_pic} onClick={openInput} alt="profile"></img>
                        </div>
                        <div className="mb-2 row">
                            <div className="col-6">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="firstName">
                                    First Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" value={firstName.value} id="firstName" type="text" placeholder="First Name" onChange={handleFirstNameChange}></input>
                                {firstName.error && <p className="text-red-600 text-xs italic"> {firstName.error} </p>}
                            </div>
                            <div className="col-6">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="lastName">
                                    Last Name
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3" value={lastName.value} id="lastName" type="text" placeholder="Last Name" onChange={handleLastNameChange}></input>
                                {lastName.error && <p className="text-red-600 text-xs italic"> {lastName.error} </p>}
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={username.value} id="username" type="text" placeholder="Username" onChange={handleUsernameChange}></input>
                            {username.error && <p className="text-red-600 text-xs italic"> {username.error} </p>}
                        </div>
                        <div className="mb-2">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={email.value} id="email" type="text" placeholder="Email" onChange={handleEmailChange}></input>
                            {email.error && <p className="text-red-600 text-xs italic"> {email.error} </p>}
                        </div>
                        <div className="flex items-center justify-between mb-3">
                            <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded" type="button">
                                <Link to="/update-password" className="no-underline text-white">
                                    Update Password
                                </Link>
                            </button>
                        </div>
                        {errorMessage && <p className="text-red-600 text-sm italic">{errorMessage}</p>}
                        <div className="flex items-center justify-between">
                            <button onClick={handleUpdate} disabled={submitDisabled} className={`${submitDisabled ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                                Save
                            </button>
                            { updateLoading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                        </div>
                    </TailwindCard>
                </div>
            )}
            </div>
            <TrendingTags />
        </div>
    </div>

  );
}
