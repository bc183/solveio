import React, { useState } from 'react';
import TailwindCard from '../components/TailwindCard';
import RingLoader from "react-spinners/RingLoader";
import axiosInstance from '../axios/axiosInstance';
import { useSnackbar } from 'react-simple-snackbar';

export default function ForgotPassword() {

    const [email, setEmail] = useState({ value: "", error: null });
    const [loading, setLoading] = useState(false);
    const [openSnackBar, closeSnackBar] = useSnackbar({ position: "top-center" });

    const checkEmail = async () => {
        try {
            setLoading(true);
            await axiosInstance.post("users/check-mail/", { email: email.value });
            setLoading(false);
            setEmail({value: "", error: null});
            openSnackBar("The link to change your password has been sent to your mail. Please, check you mail for further instructions.");
        } catch (error) {
            setLoading(false);
            setEmail({...email, error: error.response.data.error});
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

    return (
    <div className="container-fluid background">
        <div className="row">
            <div className="col-12 col-md-4 offset-md-4 mt-5">
                <div className="text-center">
                    <p className="text-white font-bold text-xl">Solve.io</p>
                </div>
                <TailwindCard bgClass="bg-dark">
                    <p className="text-white font-bold text-xl mb-2">Forgot Password</p>
                    <div className="mb-2">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="email">
                            Enter account Email
                        </label>
                        <input className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-grey-darker mb-3" value={email.value} id="email" type="text" placeholder="Email" onChange={handleEmailChange}></input>
                        {email.error && <p className="text-red-600 text-xs italic"> {email.error} </p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button onClick={checkEmail} disabled={email.value === ""} className={`${email.value === "" ? "bg-blue-200": "bg-blue-600"} text-white font-bold py-2 px-4 rounded`} type="button">
                            Check Email
                        </button>
                        { loading && <RingLoader size={40} css={"color: #4f545c; display: inline;"} /> }
                    </div>
                </TailwindCard>
            </div>
        </div>
    </div>
  )
}
