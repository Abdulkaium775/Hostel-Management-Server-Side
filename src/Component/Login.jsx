import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/AuthContext";
import { motion, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import axiosInstance from "../Api/axios";

const CartoonCharacter = () => {
  const controls = useAnimation();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    const blinkLoop = async () => {
      while (isMounted.current) {
        await controls.start({ scaleY: 1, transition: { duration: 0.1 } });
        await new Promise((res) => setTimeout(res, 2000));
        if (!isMounted.current) break;
        await controls.start({ scaleY: 0.1, transition: { duration: 0.1 } });
        await new Promise((res) => setTimeout(res, 200));
      }
    };

    blinkLoop();

    return () => {
      isMounted.current = false; // stop loop on unmount
    };
  }, [controls]);

  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="fixed top-8 left-8 w-24 h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-lg cursor-default select-none"
      title="Hey! Welcome to the login page"
    >
      <div className="flex justify-between w-12">
        <motion.div
          animate={controls}
          initial={{ scaleY: 1 }}
          style={{ originY: 0.5 }}
          className="w-4 h-4 bg-black rounded-full"
        />
        <motion.div
          animate={controls}
          initial={{ scaleY: 1 }}
          style={{ originY: 0.5 }}
          className="w-4 h-4 bg-black rounded-full"
        />
      </div>
      <div className="w-8 h-2 bg-black rounded-b-full mt-1" />
    </motion.div>
  );
};

const Login = () => {
  const { createUserWithGoogle, setUser, loginUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const userCredential = await loginUser(email, password);
      const currentUser = userCredential.user;

      await axiosInstance.post("/users/upsert", {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      });

      toast.success(`Welcome back ${currentUser.displayName}`);
      navigate(location?.state || "/");
    } catch (error) {
      toast.warning(error.code || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await createUserWithGoogle();
      const currentUser = result.user;

      await axiosInstance.post("/users/upsert", {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      });

      setUser(currentUser);
      toast.success(`Welcome back ${currentUser.displayName}`);
      navigate(location?.state || "/");
    } catch (error) {
      toast.error("Google login failed.");
    }
  };

  return (
    <>
      <CartoonCharacter />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] p-6"
      >
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Type your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Type your password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-4 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
                <span
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>

            <div className="text-right">
              <Link to="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-2 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] text-white rounded-md font-semibold hover:opacity-90 transition"
            >
              LOGIN
            </motion.button>
          </form>

          <div className="my-4 text-center text-gray-500">Or Sign In using</div>

          <motion.div
            className="flex justify-center gap-4 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="text-xl px-4 bg-gradient-to-r from-[#8e2de2] to-[#4a00e0] rounded-md"
              aria-label="Sign in with Google"
            >
              <FcGoogle size={28} />
            </motion.button>
          </motion.div>

          <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              SIGN UP
            </Link>
          </p>
        </div>
      </motion.div>
    </>
  );
};

export default Login;
