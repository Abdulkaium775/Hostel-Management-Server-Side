import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

export const MyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Loading user info...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-bold mb-4 text-center">My Profile</h2>
      
      <div className="flex flex-col items-center gap-4">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={`${user.displayName}'s profile`}
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl text-gray-600">
            {user.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}

        <div className="text-center">
          <p className="text-xl font-semibold">{user.displayName || "No Name"}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div>
          <span
            className={`inline-block px-4 py-1 rounded-full text-white font-semibold
              ${
                user.badge === "Gold"
                  ? "bg-yellow-500"
                  : user.badge === "Silver"
                  ? "bg-gray-400"
                  : "bg-yellow-800" /* Bronze as default */
              }`}
          >
            {user.badge || "Bronze"}
          </span>
        </div>
      </div>
    </div>
  );
};
