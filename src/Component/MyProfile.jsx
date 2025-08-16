import React, { useContext } from "react";
import { AuthContext } from "../Auth/AuthContext";

const MyProfile = () => {
  const { user } = useContext(AuthContext);

  if (!user)
    return (
      <p className="text-center mt-10 text-darkText/70 font-medium">
        Loading user info...
      </p>
    );

  // Determine badge color and label (default Bronze)
  const badgeLabel = user.badge || "Bronze";

  let badgeClass = "bg-orange-500"; // Bronze default color
  if (badgeLabel === "Gold") badgeClass = "bg-yellow-500";
  else if (badgeLabel === "Silver") badgeClass = "bg-gray-400";
  else if (badgeLabel === "Platinum") badgeClass = "bg-purple-700";

  return (
    <div className="p-5 max-w-xl mx-auto space-y-6 bg-neutralBg min-h-screen">
      <h2 className="text-3xl font-bold text-darkText text-center md:text-left">
        My Profile
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg w-full flex flex-col items-center md:items-start md:flex-row md:gap-8 transition hover:shadow-2xl">
        {/* Profile Image */}
        <img
          src={user.photoURL || "https://via.placeholder.com/96"}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary mb-4 md:mb-0"
        />

        {/* User Info */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-semibold text-darkText">
            {user.displayName || "No Name"}
          </h3>
          <p className="text-darkText/70 mb-3">{user.email || "No Email"}</p>

          {/* Badge */}
          <span
            className={`inline-block px-5 py-1 rounded-full text-white font-semibold ${badgeClass} text-sm`}
          >
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
