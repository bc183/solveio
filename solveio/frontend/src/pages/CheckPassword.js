import React, { useState } from 'react';
import PopularUsers from '../components/PopularUsers';
import TailwindCard from '../components/TailwindCard';
import TrendingTags from '../components/TrendingTags';
import RingLoader from "react-spinners/RingLoader";
import axiosInstance from '../axios/axiosInstance';
import { useSnackbar } from 'react-simple-snackbar';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

export default function CheckPassword() {


    const [password, setPassword] = useState({ value: "", error: null });
    const [newPassword, setNewPassword] = useState({ value: "", error: null });
    const [isPasswordChecked, setIsPasswordChecked] = useState(false);
    const [hide, setHide] = useState(true);
    const [newPasswordHide, setNewPasswordHide] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, closeSnackbar] = useSnackbar({ position: "top-center" });

    const { user } = useSelector(state => state.user);

    const navigate = useNavigate();

    const updatePassword = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.put("users/update-password-logged-in/", { password: newPassword.value });
            if (response.data?.success) {
                openSnackbar("Password updated successfully.");
                navigate(`/user/${user.id}/edit`);
            }
            setLoading(false);
        } catch (error) {
            setErrorMessage(error?.response?.data?.detail)
        }
    }

    const checkPassword = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("users/check-password/", { password: password.value });
            console.log(response);
            setLoading(false);
            setIsPasswordChecked(true);
            setErrorMessage(null);
            openSnackbar("Password check successfull. You can update your password.");
        } catch (error) {
            console.log(error);
            setLoading(false);
            setErrorMessage(error?.response?.data?.detail);
        }
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

    const handleNewPasswordChange = (event) => {
        const value = event.target.value;
        if (value === "") {
            setNewPassword({
                value: value,
                error: "Please enter Password."
            });
            return;
        }

        setNewPassword({
            value: value,
            error: null
        });
    }

    return (
    <div className="container-fluid background-home">
        <div className="row">
            <PopularUsers />
            <div className="col-12 col-md-6 mt-3">
                <div className="mb-4">
                    <h4 className="text-white-50 inline">Update Password.</h4>
                </div>
                <TailwindCard bgClass="bg-dark">
                    <p className="text-white font-bold text-xl mb-2">Update Password</p>
                    {!isPasswordChecked && <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={password.value} id="password" type={hide ? 'password': 'text'} placeholder="password" onChange={handlePasswordChange}></input>
                        {!hide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setHide(false)}></i>}
                        {password.error && <p className="text-red-600 text-xs italic">{password.error}</p>}
                    </div>}
                    {isPasswordChecked && <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="newPassword">
                            New Password
                        </label>
                        <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={newPassword.value} id="newPassword" type={hide ? 'newPassword': 'text'} placeholder="newPassword" onChange={handleNewPasswordChange}></input>
                        {!newPasswordHide ? <i className="ml-2 far fa-eye text-white inline hover:cursor-pointer" onClick={() => setNewPasswordHide(true)}></i>: <i className="far fa-eye-slash text-white ml-2 hover:cursor-pointer" onClick={() => setNewPasswordHide(false)}></i>}
                        {newPassword.error && <p className="text-red-600 text-xs italic">{newPassword.error}</p>}
                    </div>
                    }
                    {errorMessage && <p className="text-red-600 text-sm italic">{errorMessage}</p>}
                    {!isPasswordChecked && <div className="flex items-center justify-between">
                        <button onClick={checkPassword} disabled={password.value === ""} className={`${password.value === "" ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                            Check Password
                        </button>
                        { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                    </div>}
                    {isPasswordChecked && <div className="flex items-center justify-between">
                        <button onClick={updatePassword} disabled={newPassword.value === ""} className={`${newPassword.value === "" ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                            Update Password
                        </button>
                        { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                    </div>
                    }
                </TailwindCard>
            </div>
            <TrendingTags />
        </div>
    </div>
  );
}
