import React from 'react';
import TailwindCard from './TailwindCard';
import moment from "moment";
import { useSelector } from 'react-redux';


export default function User({ user }) {

    const { user: loggedInUser } = useSelector(state => state.user);
    return (
    <TailwindCard bgClass={"bg-dark"}>
        <div className="flex align-items-center justify-center">
            <div className="flex align-items-center justify-center flex-column">
                <img width={300} height={300} src={user?.profile_pic} alt="profile"></img>
                <p className="font-semibold text-white-50 mt-2">{user?.first_name} {user?.last_name}</p>
                <p className="font-semibold text-white-50 mt-2">{user?.user_name}</p>
                {user?.id === loggedInUser?.id && <p className="font-semibold text-white-50 mt-2">{user?.email}</p>}
                <p className="font-semibold text-white-50 mt-1">Answers posted {user?.answers}</p>
                <p className="font-semibold text-white-50 mt-1">Joined Solve.io on {moment(user?.started_at).format("MMMM Do, YYYY")}</p>
            </div>
        </div>
    </TailwindCard>
    );
}
