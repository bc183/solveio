import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'react-simple-snackbar';
import RingLoader from "react-spinners/RingLoader";
import axiosInstance from '../axios/axiosInstance';
import TailwindCard from '../components/TailwindCard';
import { USER_REGISTER_FAILURE, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from '../redux/constants/userConstants';

export default function Register() {
    const [email, setEmail] = useState({ value: "", error: null });
    const [username, setUsername] = useState({ value: "", error: null });
    const [password, setPassword] = useState({ value: "", error: null });
    const [firstName, setFirstName] = useState({ value: "", error: null });
    const [lastName, setLastName] = useState({ value: "", error: null });
    const [submitDisabled, setsubmitDisabled] = useState(true);
    const [hide, setHide] = useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-center" })
    const { loading, errorMessage } = useSelector(state => state.user);

    const handleRegister = async () => {
        const data = {
            email: email.value,
            user_name: username.value,
            first_name: firstName.value,
            last_name: lastName.value,
            password: password.value
        }

        try {
            dispatch({ type: USER_REGISTER_REQUEST });
            await axiosInstance.post("/users/register/", data);
            dispatch({ type: USER_REGISTER_SUCCESS });
            navigate("/login");
            openSnackbar("Registration successfull. Please, login.")
        } catch (error) {
            if (error.response.data.email) {
                dispatch({ type: USER_REGISTER_FAILURE, payload: "User with email already exists." });
            } else if (error.response.data.user_name) {
                dispatch({ type: USER_REGISTER_FAILURE, payload: "User with username already exists." });
            }
            console.log(error.response.data.email);
        }
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

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setPassword({
                value: value,
                error: "Please enter Password."
            });
            return;
        }

        setPassword({
            value: value,
            error: null
        });
    }

    useEffect(() => {
        if (email.value === "" || password.value === "" || username.value === "" || firstName.value === "" || lastName.value === "") {
            setsubmitDisabled(true);
            return;
        }
        setsubmitDisabled(false);
    }, [email.value, password.value, username.value, firstName.value, lastName.value])

    return (
        <div className="container-fluid background">
            <div className="row">
                <div className="col-12 col-md-4 offset-md-4 mt-5">
                    <div className="text-center">
                        <p className="text-white font-bold text-xl">Solve.io</p>
                    </div>
                    <TailwindCard bgClass="bg-dark">
                        <p className="text-white font-bold text-xl mb-2">Register</p>
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
                        <div className="mb-2">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={password.value} id="password" type={hide ? 'password': 'text'} placeholder="password" onChange={handlePasswordChange}></input>
                            {!hide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setHide(false)}></i>}
                            {password.error && <p className="text-red-600 text-xs italic">{password.error}</p>}
                        </div>
                        {errorMessage && <p className="text-red-600 text-sm italic">{errorMessage}</p>}
                        <div className="flex items-center justify-between">
                            <button onClick={handleRegister} disabled={submitDisabled} className={`${submitDisabled ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                                Register
                            </button>
                            { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                        </div>
                        <p className="text-sm text-white mt-2">Have an account ? <span><Link className="inline text-decoration-none" to="/login">Login</Link></span></p>
                    </TailwindCard>
                </div>
            </div>
        </div>
    )
}
