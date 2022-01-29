import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import { css_var, customStyles } from '../css_var';
import { SET_SEARCH_TERM, UNSET_SEARCH_TERM } from '../redux/constants/searchConstants';
import { CLEAR_SEARCH_LIST } from '../redux/constants/searchListConstants';

export default function Header() {
    const { searchTerm } = useSelector(state => state.search);
    const { user, isLoggedIn } = useSelector(state => state.user)
    const [open, setOpen] = useState(false);
    const logout = () => {
        localStorage.clear();
        window.location.reload();
    }
    const location = useLocation();
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 

    const onChangeSearch = (e) => {
        dispatch({ type: SET_SEARCH_TERM, payload: e.target.value});
        if (e.target.value !== "" && e.target.value.charAt(0) === "@") {
            navigate("/search", {
                state: {
                    isUser: true
                }
            });
            return;
        }   
        navigate("/search");
    }

    useEffect(() => {
        if (location.pathname !== "/search") {
            dispatch({ type: UNSET_SEARCH_TERM });
            dispatch({ type: CLEAR_SEARCH_LIST });
        }
    }, [location.pathname, dispatch])

    let isLoginUrls = ["/login", "/register", "/forgot-password"].includes(location.pathname);
    if (location.pathname.startsWith("/update-password") && location.pathname !== "/update-password") {
        isLoginUrls = true;
    }

    return (
        <nav className={`${isLoginUrls ? "d-none": ""} navbar fixed-top navbar-expand-lg navbar-dark bg-dark py-3`}>
            <motion.span initial={{ y: -200 }} animate={{ y: 0 }} className="font-semibold text-xl text-white tracking-tight mx-2">
                <NavLink  to="/" className="text-white text-decoration-none" >Solve.io</NavLink>
            </motion.span>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto mr-5">
                    <input className="shadow appearance-none mx-2 bg-gray-600 border rounded w-80 py-2 px-3 text-white" value={searchTerm} onChange={onChangeSearch}  id="search" type="text" placeholder="Search. For tags use #, For users use @"></input>
                {!isLoggedIn && 
                    <motion.li initial={{ y: -200 }} animate={{ y: 0 }} className="nav-item active mt-2">
                        <a className="text-white text-decoration-none bg-gray-700 py-2 px-3 rounded" href="/login">Login</a>
                    </motion.li>}
                        {isLoggedIn && 
                    <React.Fragment>
                        <motion.li initial={{ y: -200 }} animate={{ y: 0 }} className="mr-5 mt-2">
                            <div className="dropdown show">
                                <div className="dropdown-toggle text-white" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fas fa-user-circle px-2"></i>{user.user_name}
                                </div>

                                <div className="dropdown-menu" style={{ backgroundColor: css_var.primary }} aria-labelledby="dropdownMenuLink">
                                    <Link to={`/user/${user?.id}`} className="dropdown-item text-white hover:!bg-gray-700">View Profile</Link>
                                    <Link to={`/user/${user?.id}/edit`} className="dropdown-item text-white hover:!bg-gray-700">Edit profile</Link>
                                </div>
                            </div>
                        </motion.li>
                        <motion.li initial={{ y: -200 }} animate={{ y: 0 }} className="nav-item active ml-2 mt-2">
                            <i className="fas fa-sign-out-alt text-white hover:cursor-pointer" onClick={() => setOpen(true)}></i>
                        </motion.li>
                    </React.Fragment>}
                </ul>
            </div>
            <Modal
                isOpen={open}
                onRequestClose={() => setOpen(false)}
                style={customStyles}
                contentLabel="Logout"
            >
                <h4>Are you sure you want to Logout ?</h4>
                <div className="flex justify-between mt-4">
                    <button onClick={() => setOpen(false)} className="bg-red-600 text-white font-bold py-2 px-4 rounded" type="button">
                        Cancel
                    </button>
                    <button onClick={logout} className="bg-blue-600 text-white font-bold py-2 px-4 rounded" type="button">
                        Logout
                    </button>
                </div>
            </Modal>
        </nav>
    )
}
