import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { motion, useAnimation } from "framer-motion";
import { AuthContext } from "../Auth/AuthContext";
import { useForm } from "react-hook-form";
import axiosInstance from "../Api/axios";


const CartoonCharacterRegister = () => {
  const controls = useAnimation();
  React.useEffect(() => {
    controls.start({
      rotate: [0, 15, -15, 15, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" },
    });
  }, [controls]);

  return (
    <motion.div
      animate={controls}
      className="fixed top-8 left-8 w-24 h-24 rounded-full bg-red-400 shadow-lg flex flex-col items-center justify-center cursor-default select-none"
      title="Welcome! Register here"
      style={{ position: "fixed", zIndex: 1000 }}
    >
      <div className="relative w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
        <div className="flex justify-between w-10 absolute top-5 left-3">
          <div className="w-3 h-3 bg-black rounded-full"></div>
          <div className="w-3 h-3 bg-black rounded-full"></div>
        </div>
        <div className="w-6 h-1 bg-black rounded-b-full absolute bottom-6 left-5"></div>
        <motion.div
          animate={{ rotate: [0, 20, -20, 20, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-6 h-6 bg-pink-500 rounded-full absolute top-1 right-0 shadow"
          style={{ transformOrigin: "bottom center" }}
        />
      </div>
    </motion.div>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser, createUserWithGoogle, updateUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const upsertUserToDB = async (user) => {
    try {
      await axiosInstance.post("/users/upsert", {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
    } catch (err) {
      console.error("User upsert failed:", err);
      toast.error("Could not save user to DB");
    }
  };

  const onSubmit = async (data) => {
    const { name, email, password, photoUrl } = data;

    // 🔒 Password validation
    if (!/[A-Z]/.test(password)) return toast.error("At least one uppercase letter required");
    if (!/[a-z]/.test(password)) return toast.error("At least one lowercase letter required");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    try {
      const userCredential = await createUser(email, password);
      const user = userCredential.user;

      await updateUser({ displayName: name, photoURL: photoUrl });

      await upsertUserToDB({
        email: user.email,
        displayName: name,
        photoURL: photoUrl || "",
      });

      toast.success("Account created successfully!");
      navigate(location?.state || "/");
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await createUserWithGoogle();
      const user = result.user;

      await upsertUserToDB({
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL || "",
      });

      toast.success(`Welcome ${user.displayName}`);
      navigate(location?.state || "/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };

  return (
    <>
      <CartoonCharacterRegister />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen flex justify-center items-center bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] p-6"
      >
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 text-gray-900">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Register</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              type="text"
              placeholder="Name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                {...register("password", { required: "Password is required" })}
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            <input
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              type="url"
              placeholder="Photo URL (Optional)"
              {...register("photoUrl")}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
            >
              Register
            </motion.button>
          </form>

          <motion.button
            onClick={handleGoogleLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 w-full bg-white text-black border p-3 rounded-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition font-semibold"
          >
            <FcGoogle size={24} />
            Register with Google
          </motion.button>

          <p className="mt-4 text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-medium underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Register;
