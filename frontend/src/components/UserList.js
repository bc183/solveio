import React from 'react';
import { Link } from 'react-router-dom';
import TailwindCard from './TailwindCard';

export default function UserList({ userList }) {
  return (
    <div>
        { userList.map((user, index) => (
            <TailwindCard key={index} bgClass={"bg-dark"}>
                <div className="row">
                    <div className="col-1">
                        <img className="rounded" src={user?.profile_pic} alt="profile"></img>
                    </div>
                    <div className="col-9 mx-3 mx-sm-0">
                        <div className="flex justify-between">
                            <Link className="text-md text-white-50 hover:cursor-pointer inline no-underline" to={`/user/${user?.id}`}>{ user?.user_name }</Link>
                        </div>
                    </div>
                </div>
            </TailwindCard>
        ))}
    </div>
  )
}
