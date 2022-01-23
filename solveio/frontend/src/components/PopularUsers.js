import React, { useEffect, useState } from 'react'
import axiosInstance from '../axios/axiosInstance';
import TailwindCard from './TailwindCard';
import HashLoader from "react-spinners/HashLoader";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function PopularUsers() {
    const [popularUsers, setPopularUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const getPopularUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("get-popular-users/");
            setPopularUsers(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setErrorMessage(error);
            console.log(error);
        }
    }


    useEffect(() => {
        getPopularUsers();
    }, []);

    return (
        <motion.div className="d-none d-md-block col-md-3 mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading && 
            <div className="flex justify-content-center align-items-center pt-40">
                <HashLoader size={100} color='gray'/>
            </div>}
            {!loading && <div className="mb-4">
                <h4 className="text-white-50 inline">Popular users.</h4>
            </div>}
            {!loading && <TailwindCard bgClass="bg-dark">
                { popularUsers?.map((user, index) => (
                    <div key={index}>
                        <div className="row">
                            <div className="col-1">
                                <i className="fas fa-user-circle pr-2 text-white"></i>
                            </div>
                            <div className="col-5 mx-3 mx-sm-0">
                                <div className="flex justify-between">
                                    <Link className="text-md text-white-50 hover:cursor-pointer inline no-underline" to={`/user/${user?.id}`}>{ user.user_name }</Link>
                                </div>
                            </div>
                            <p className="text-white-50 mt-2">{ user.answers } Questions answered</p>
                        </div>
                    </div>
                )) }
            </TailwindCard>} 
        </motion.div>
    )
}
