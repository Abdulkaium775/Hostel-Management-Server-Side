import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p>Loading user info...</p>;

  // Determine badge color and label (default Bronze)
  const badgeLabel = user.badge || "Bronze";

  let badgeClass = "bg-orange-500"; // Bronze default color
  if (badgeLabel === "Gold") badgeClass = "bg-yellow-500";
  else if (badgeLabel === "Silver") badgeClass = "bg-gray-400";
  else if (badgeLabel === "Platinum") badgeClass = "bg-purple-700";

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-2xl font-bold">My Profile</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto space-y-4">
        <img
          src={user.photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto object-cover"
        />
        <h3 className="text-xl font-semibold text-center">
          {user.displayName || "No Name"}
        </h3>
        <p className="text-center text-gray-600">{user.email || "No Email"}</p>
        <div className="text-center">
          <span
            className={`inline-block px-4 py-1 rounded-full text-white font-medium ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
