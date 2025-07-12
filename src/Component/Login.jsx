import React, { useState, useRef, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { AuthContext } from '../Auth/AuthContext';
import { motion, useAnimation } from 'framer-motion';

const CartoonCharacter = () => {
  // Controls for blinking eyes
  const controls = useAnimation();

  React.useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start({ scaleY: 1, transition: { duration: 0.1 } }); // eyes open
        await new Promise(r => setTimeout(r, 2000));
        await controls.start({ scaleY: 0.1, transition: { duration: 0.1 } }); // eyes closed
        await new Promise(r => setTimeout(r, 200));
      }
    };
    sequence();
  }, [controls]);

  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      className="fixed top-8 left-8 w-24 h-24 bg-yellow-400 rounded-full flex flex-col items-center justify-center shadow-lg cursor-default select-none"
      title="Hey! Welcome to the login page"
    >
      {/* Eyes */}
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
      {/* Mouth */}
      <div className="w-8 h-2 bg-black rounded-b-full mt-1" />
    </motion.div>
  );
};

const Login = () => {
  const { createUserWithGoogle, setUser, loginUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const emailRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    loginUser(email, password)
      .then((userCredential) => {
        const currentUser = userCredential.user;
        toast.success(`Welcome back ${currentUser.displayName}`);
        navigate(location?.state || '/');
      })
      .catch((error) => {
        toast.warning(error.code);
      });
  };

  const handleGoogleLogin = () => {
    createUserWithGoogle()
      .then((result) => {
        const currentUser = result.user;
        setUser(currentUser);
        toast.success(`Welcome back ${currentUser.displayName}`);
        navigate(location?.state || '/');
      })
      .catch(() => {
        toast.error("Google login failed.");
      });
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
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
                placeholder="Type your email"
                ref={emailRef}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-gray-600">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  className="w-full px-4 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Type your password"
                />
                <span
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  title={showPassword ? "Hide Password" : "Show Password"}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </span>
              </div>
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
