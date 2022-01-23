import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';
import RingLoader from "react-spinners/RingLoader";
import TailwindCard from '../components/TailwindCard';
import { loginUser } from '../redux/actions/userActions';

export default function Login() {
    const [email, setEmail] = useState({ value: "", error: null });
    const [password, setPassword] = useState({ value: "", error: null });
    const [submitDisabled, setsubmitDisabled] = useState(true);
    const [hide, setHide] = useState(true);

    const user = useSelector(state => state.user);

    const { loading, errorMessage, isLoggedIn } = user;

    const dispatch = useDispatch();

    const handleLogin = () => {
        const data = {
            email: email.value,
            password: password.value
        }
        dispatch(loginUser(data));
    } 

    useEffect(() => {
        if (isLoggedIn) {
            window.location.pathname = "/";
        }
    }, [isLoggedIn]);

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
        if (email.value === "" || password.value === "") {
            setsubmitDisabled(true);
            return;
        }
        setsubmitDisabled(false);
    }, [email.value, password.value])

    return (
        <div className="container-fluid background">
            <div className="row">
                <div className="col-12 col-md-4 offset-md-4 mt-5">
                    <div className="text-center">
                        <p className="text-white font-bold text-xl">Solve.io</p>
                    </div>
                    <TailwindCard bgClass="bg-dark">
                        <p className="text-white font-bold text-xl mb-2">Login</p>
                        <div className="mb-4">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={email.value} id="email" type="text" placeholder="Email" onChange={handleEmailChange}></input>
                            {email.error && <p className="text-red-600 text-xs italic"> {email.error} </p>}
                        </div>
                        <div className="mb-6">
                            <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={password.value} id="password" type={hide ? 'password': 'text'} placeholder="password" onChange={handlePasswordChange}></input>
                            {!hide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setHide(false)}></i>}
                            {password.error && <p className="text-red-600 text-xs italic">{password.error}</p>}
                        </div>
                        {errorMessage && <p className="text-red-600 text-sm italic">{errorMessage}</p>}
                        <div className="flex items-center justify-between">
                            <button onClick={handleLogin} disabled={submitDisabled} className={`${submitDisabled ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                                Sign In
                            </button>
                            { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                        </div>
                        <p className="text-sm text-white mt-2">Don't have an account ? <span><Link className="inline text-decoration-none" to="/register">Register</Link></span></p>
                    </TailwindCard>
                </div>
            </div>
        </div>
    )
}
