import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/catalyst.png';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
import { Button } from 'react-bootstrap';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Login() {
  document.title = 'catalyst | Student Login';
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setLoading] = useState(false);

  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../student/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'email') return setError({ ...error, email: '' });
    if (e.target.name === 'password') return setError({ ...error, password: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.password) return setError({ email: 'Email Required!', password: 'Password Required!' })
    if (!formData?.email) return setError({ email: 'Email Required!' })
    if (!formData?.password) return setError({ password: 'Password Required!' })

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/student/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('../student/dashboard');
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in Student login.jsx => ", error);
      setLoading(false);
    }
  }

  // if user came from signup page then this toast appears
  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };
  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      // Clear the state after the toast is shown
      navigate('.', { replace: true, state: {} });
    }
  }, []);

  // toggle eye
  const [isEyeOpen, setEyeOpen] = useState(false);

  const handleEye = () => {
    setEyeOpen(!isEyeOpen);
  }

  return (
    <>
      {/* for any message "toast" */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Glass morphism form */}
        <form 
          className="relative z-10 form-signin flex justify-center items-center flex-col gap-4 backdrop-blur-xl bg-white/20 border-2 border-white/30 rounded-2xl p-10 shadow-2xl w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5 animate-scaleIn transform transition-all duration-500 hover:shadow-3xl" 
          onSubmit={handleSubmit}
        >
          {/* Logo with animation */}
          <div className="flex justify-center items-center flex-col mb-4 group">
            <div className="relative">
              <img 
                className="mb-4 rounded-xl shadow-2xl w-32 h-32 lg:w-40 lg:h-40 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" 
                src={Logo} 
                alt="Logo Image" 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-2">
              Please Log In
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
          </div>

          {/* Enhanced Email Input */}
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-envelope text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>
              </div>
              <input 
                type="email" 
                id="inputEmail" 
                className="form-control pl-12 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm" 
                placeholder="Email address" 
                autoFocus 
                autoComplete="email" 
                name="email" 
                value={email} 
                onChange={handleChange} 
              />
            </div>
            {error?.email && (
              <div className="mt-1 ml-2 text-red-500 text-sm flex items-center gap-1 animate-fadeInDown">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                {error.email}
              </div>
            )}
          </div>

          {/* Enhanced Password Input */}
          <div className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300"></i>
              </div>
              <input 
                type={isEyeOpen ? "text" : "password"} 
                id="inputPassword" 
                className="form-control pl-12 pr-12 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition-all duration-300 bg-white/80 backdrop-blur-sm" 
                placeholder="Password" 
                autoComplete="current-password" 
                name="password" 
                value={password} 
                onChange={handleChange} 
              />
              <button
                type="button"
                onClick={handleEye}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} text-lg`}></i>
              </button>
            </div>
            {error?.password && (
              <div className="mt-1 ml-2 text-red-500 text-sm flex items-center gap-1 animate-fadeInDown">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                {error.password}
              </div>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <div className="flex justify-center items-center flex-col w-full">
            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    Loading...
                  </>
                ) : (
                  <>
                    Log In
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-300"></i>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>

          {/* Enhanced Sign Up Link */}
          <span className="text-center text-white/90">
            Don't have an account?{' '}
            <span 
              className="text-white font-bold cursor-pointer px-2 py-1 rounded-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-1 group" 
              onClick={() => navigate('../student/signup')}
            >
              Create new account
              <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
          </span>

          {/* Back to Home Button */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-home"></i>
              Back to Home
            </button>
          </div>
          
          <p className="text-center text-white/70 text-sm mt-4">
            © catalyst 2024 - 25
          </p>
        </form>
      </div>
    </>
  )
}

export default Login
