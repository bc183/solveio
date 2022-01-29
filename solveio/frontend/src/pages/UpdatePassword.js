import React, { useState } from 'react';
import TailwindCard from '../components/TailwindCard';
import RingLoader from "react-spinners/RingLoader";
import axiosInstance from '../axios/axiosInstance';
import { useSnackbar } from 'react-simple-snackbar';
import { useNavigate, useParams } from 'react-router';

export default function UpdatePassword() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState({ value: "", error: null });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", error: null });
    const [errorMessage, setErrorMessage] = useState(null);
    const [passwordHide, setPasswordHide] = useState(true);
    const [confirmPasswordHide, setConfirmPasswordHide] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openSnackBar, closeSnackBar] = useSnackbar({ position: "top-center" });

    const updatePassword = async () => {
        try {
            setLoading(true);
            if (password.value !== confirmPassword.value) {
                setErrorMessage("Password and Confirm Password doesn't match.");
                setLoading(false);
                return;
            }
            await axiosInstance.post("users/update-password/", { password: password.value, token: token });
            setLoading(false);
            openSnackBar("Password Changed Successfully.");
            navigate("/login");
        } catch (error) {
            setLoading(false);
            setErrorMessage(error?.response?.data?.detail);
        }
    }

    const handlePasswordChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setPassword({
                value: value,
                error: "Please enter password."
            });
            return;
        }

        setPassword({
            value: value,
            error: null
        });
    }

    const handleConfirmPasswordChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setConfirmPassword({
                value: value,
                error: "Please enter confirm password."
            });
            return;
        }

        setConfirmPassword({
            value: value,
            error: null
        });
    }


    return (
    <div className="container-fluid background">
        <div className="row">
            <div className="col-12 col-md-4 offset-md-4 mt-5">
                <div className="text-center">
                    <p className="text-white font-bold text-xl">Solve.io</p>
                </div>
                <TailwindCard bgClass="bg-dark">
                    <p className="text-white font-bold text-xl mb-2">Forgot Password</p>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Enter new password.
                        </label>
                        <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={password.value} id="password" type={passwordHide ? 'password': 'text'} placeholder="password" onChange={handlePasswordChange}></input>
                        {!passwordHide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setPasswordHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setPasswordHide(false)}></i>}
                        {password.error && <p className="text-red-600 text-xs italic">{password.error}</p>}
                    </div>
                    <div className="mb-2">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={confirmPassword.value} id="confirmPassword" type={confirmPasswordHide ? 'password': 'text'} placeholder="confirmPassword" onChange={handleConfirmPasswordChange}></input>
                        {!confirmPasswordHide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setConfirmPasswordHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setConfirmPasswordHide(false)}></i>}
                        {confirmPassword.error && <p className="text-red-600 text-xs italic">{confirmPassword.error}</p>}
                    </div>
                    {errorMessage && <p className="text-red-600 text-sm italic">{errorMessage}</p>}
                    <div className="flex items-center justify-between">
                        <button onClick={updatePassword} disabled={(password.value === "" || confirmPassword.value === "")} className={`${(password.value === "" || confirmPassword.value === "") ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                            Update Password
                        </button>
                        { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                    </div>
                </TailwindCard>
            </div>
        </div>
    </div>
  )
}
