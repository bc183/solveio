import React from 'react'
import { Navigate, Outlet } from 'react-router';

export default function ProtectedRoutes() {

    const accessToken = localStorage.getItem("accessToken");

    return accessToken ? <Outlet />: <Navigate to="/login" />
}
