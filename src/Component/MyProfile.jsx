import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <p className="text-center mt-10 text-gray-500">Loading user info...</p>;

  // Determine badge color and label (default Bronze)
  const badgeLabel = user.badge || "Bronze";

  let badgeClass = "bg-orange-500"; // Bronze default color
  if (badgeLabel === "Gold") badgeClass = "bg-yellow-500";
  else if (badgeLabel === "Silver") badgeClass = "bg-gray-400";
  else if (badgeLabel === "Platinum") badgeClass = "bg-purple-700";

  return (
    <div className="p-5 max-w-xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-center md:text-left">My Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-md w-full flex flex-col items-center md:items-start md:flex-row md:gap-8">
        <img
          src={user.photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0"
        />
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-semibold">{user.displayName || "No Name"}</h3>
          <p className="text-gray-600 mb-3">{user.email || "No Email"}</p>
          <span
            className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
