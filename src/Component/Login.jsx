import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { AuthContext } from "../Auth/AuthContext";
import { motion, useAnimation } from "framer-motion";
import { useForm } from "react-hook-form";
import axiosInstance from "../Api/axios";
import { getIdToken } from "firebase/auth";   // ✅ Import Firebase token getter

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
      isMounted.current = false;
    };
  }, [controls]);

  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="mx-auto mb-6 w-24 h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-lg"
    >
      <div className="flex justify-between w-12">
        <motion.div animate={controls} initial={{ scaleY: 1 }} style={{ originY: 0.5 }} className="w-4 h-4 bg-black rounded-full" />
        <motion.div animate={controls} initial={{ scaleY: 1 }} style={{ originY: 0.5 }} className="w-4 h-4 bg-black rounded-full" />
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

  const sendUserToBackend = async (currentUser) => {
    try {
      const token = await getIdToken(currentUser); // ✅ Get Firebase token

      await axiosInstance.post(
        "/users/upsert",
        {
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Attach token to header
          },
        }
      );
    } catch (err) {
      console.error("Error sending user:", err);
      toast.error("User sync failed");
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
    try {
      const userCredential = await loginUser(email, password);
      const currentUser = userCredential.user;
      await sendUserToBackend(currentUser);

      toast.success(`Welcome back ${currentUser.displayName || "User"}`);
      navigate(location?.state || "/");
    } catch (error) {
      toast.warning(error.code || "Login failed");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await createUserWithGoogle();
      const currentUser = result.user;
      await sendUserToBackend(currentUser);

      setUser(currentUser);
      toast.success(`Welcome back ${currentUser.displayName || "User"}`);
      navigate(location?.state || "/");
    } catch (error) {
      toast.error("Google login failed.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#6a11cb] to-[#2575fc] p-4 sm:p-6"
    >
      <CartoonCharacter />
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Type your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
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
              <span onClick={togglePassword} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>
            {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}
          </div>

          <motion.button type="submit" whileHover={{ scale: 1.05 }} className="w-full py-2 bg-indigo-600 text-white rounded-md">
            LOGIN
          </motion.button>
        </form>

        <div className="my-4 text-center">Or Sign In using</div>

        <motion.button
          onClick={handleGoogleLogin}
          whileHover={{ scale: 1.05 }}
          className="w-full bg-white border p-3 rounded-md flex items-center justify-center gap-2"
        >
          <FcGoogle size={28} /> Register with Google
        </motion.button>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            SIGN UP
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
