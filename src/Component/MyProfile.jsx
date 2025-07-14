import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-2xl font-bold">My Profile</h2>
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md mx-auto space-y-3">
        <img src={user.photoURL} alt="Profile" className="w-24 h-24 rounded-full mx-auto" />
        <h3 className="text-xl font-semibold text-center">{user.displayName}</h3>
        <p className="text-center">{user.email}</p>
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-white ${
            user.badge === "Gold" ? "bg-yellow-500" :
            user.badge === "Silver" ? "bg-gray-400" : "bg-orange-500"
          }`}>
            {user.badge || "Bronze"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
