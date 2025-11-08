import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../../assets/catalyst.png";
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Signup() {
  document.title = 'catalyst | Student Sign Up';
  const navigate = useNavigate();
  const location = useLocation();

  const prefillEmail = location?.state?.prefillEmail || '';

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../student/dashboard");
    }
  }, [navigate]);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [error, setError] = useState({});

  // useState for from data 
  const [formData, setFormData] = useState({
    first_name: '',
    email: prefillEmail,
    number: '',
    password: '',
  });

  const { first_name, number, email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'first_name') setError({ ...error, first_name: '' })
    if (e.target.name === 'email') setError({ ...error, email: '' })
    if (e.target.name === 'number') setError({ ...error, number: '' })
    if (e.target.name === 'password') {
      setError({ ...error, password: '' })
      if (!validatePassword(e.target.value)) setError({ ...error, password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' })
    }
  }

  function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData?.email && !formData?.first_name && !formData?.number && !formData?.password)
      return setError({ email: 'Email Required!', first_name: 'Name Required!', number: 'Number Required!', password: 'Password Required!' })
    if (!formData?.email || !formData?.first_name || !formData?.number || !formData?.password) {
      let email, first_name, number, password;
      if (!formData?.email) email = 'Email Required!';
      if (!formData?.first_name) first_name = 'Name Required!';
      if (!formData?.number) number = 'Number Required!';
      if (!formData?.password) password = 'Password Required!';
      setError({ email: email, first_name: first_name, number: number, password: password })
      return;
    }

    if (!validatePassword(formData?.password)) return setError({ password: 'Password Must Contains: Minimum 8 Char with atleast 1 Special Char, 1 Number, 1 Uppercase, 1 Lowercase' })

    if (formData?.number?.length !== 10) return setError({ ...error, number: 'Number Length Should be 10 digital only!' })

    try {
      const response = await axios.post(`${BASE_URL}/student/signup`, formData);
      // console.log(response.data);
      setToastMessage("User Created Successfully! Now You Can Login.");
      setShowToast(true);

      const dataToPass = {
        showToastPass: true,
        toastMessagePass: "User Created Successfully! Now You Can Login."
      }
      navigate('../student/login', { state: dataToPass });

      // after 3sec to go login page
      // setTimeout(() => navigate("../student/login"), 2000);
    } catch (error) {
      if (error.response.data.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Student Signup.jsx => ", error);
    }
  }

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

      <div className="relative flex justify-center items-center py-2 min-h-screen bg-gradient-to-br from-red-400 via-pink-500 to-purple-500 overflow-hidden">
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
          className="relative z-10 form-signin flex justify-center items-center flex-col gap-4 backdrop-blur-xl bg-white/20 border-2 border-white/30 rounded-2xl shadow-2xl p-10 w-1/3 max-lg:w-2/3 max-md:w-3/4 max-[400px]:w-4/5 animate-scaleIn transform transition-all duration-500 hover:shadow-3xl overflow-y-auto max-h-[90vh]" 
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
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-pink-100 bg-clip-text text-transparent mb-2">
              Sign Up as a Student
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"></div>
          </div>
          {/* Enhanced Name Input */}
          <div className="w-full">
            <label htmlFor="inputName" className="sr-only">Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-user text-gray-400 group-focus-within:text-pink-500 transition-colors duration-300"></i>
              </div>
              <input 
                type="text" 
                id="inputName" 
                className="pl-12 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 bg-white backdrop-blur-sm text-gray-900 placeholder-gray-500" 
                style={{ 
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Full Name" 
                autoFocus 
                autoComplete="name" 
                name="first_name" 
                value={first_name} 
                onChange={handleChange} 
              />
            </div>
            {error?.first_name && (
              <div className="mt-1 ml-2 text-red-500 text-sm flex items-center gap-1 animate-fadeInDown">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                {error.first_name}
              </div>
            )}
          </div>

          {/* Enhanced Email Input */}
          <div className="w-full">
            <label htmlFor="inputEmail" className="sr-only">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-envelope text-gray-400 group-focus-within:text-pink-500 transition-colors duration-300"></i>
              </div>
              <input 
                type="email" 
                id="inputEmail" 
                className="pl-12 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 bg-white backdrop-blur-sm text-gray-900 placeholder-gray-500" 
                style={{ 
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Email Address" 
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

          {/* Enhanced Phone Input */}
          <div className="w-full">
            <label htmlFor="inputNumber" className="sr-only">Phone Number</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-phone text-gray-400 group-focus-within:text-pink-500 transition-colors duration-300"></i>
              </div>
              <input
                type="number"
                id="inputNumber"
                className="pl-12 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 bg-white backdrop-blur-sm text-gray-900 placeholder-gray-500"
                style={{ 
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Phone Number (10 digits)"
                autoComplete="tel"
                name="number"
                value={number}
                onChange={handleChange}
                onInput={(e) => {
                  if (e.target.value.length > 10) {
                    e.target.value = e.target.value.slice(0, 10);
                  }
                }}
              />
            </div>
            {error?.number && (
              <div className="mt-1 ml-2 text-red-500 text-sm flex items-center gap-1 animate-fadeInDown">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                {error.number}
              </div>
            )}
          </div>

          {/* Enhanced Password Input */}
          <div className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-lock text-gray-400 group-focus-within:text-pink-500 transition-colors duration-300"></i>
              </div>
              <input 
                type={isEyeOpen ? "text" : "password"} 
                id="inputPassword" 
                className="pl-12 pr-12 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 transition-all duration-300 bg-white backdrop-blur-sm text-gray-900 placeholder-gray-500" 
                style={{ 
                  color: '#111827',
                  backgroundColor: '#ffffff'
                }}
                placeholder="Password" 
                autoComplete="new-password" 
                name="password" 
                value={password} 
                onChange={handleChange} 
              />
              <button
                type="button"
                onClick={handleEye}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-pink-500 transition-colors duration-300"
              >
                <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} text-lg`}></i>
              </button>
            </div>
            {error?.password && (
              <div className="mt-1 ml-2 text-red-500 text-sm flex items-start gap-1 animate-fadeInDown">
                <i className="fa-solid fa-circle-exclamation text-xs mt-1"></i>
                <span className="text-xs">{error.password}</span>
              </div>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <div className="flex justify-center items-center flex-col w-full">
            <button
              type="submit"
              className="relative overflow-hidden w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Sign Up
                <i className="fa-solid fa-rocket group-hover:rotate-12 group-hover:translate-x-1 transition-transform duration-300"></i>
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>

          {/* Enhanced Login Link */}
          <span className="text-center text-white/90">
            Already have an account?{' '}
            <span 
              className="text-white font-bold cursor-pointer px-2 py-1 rounded-lg hover:bg-white/20 transition-all duration-300 inline-flex items-center gap-1 group" 
              onClick={() => navigate('../student/login')}
            >
              Login
              <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-1 transition-transform duration-300"></i>
            </span>
          </span>
          
          <p className="text-center text-white/70 text-sm mt-4">
            © catalyst 2024 - 25
          </p>
        </form>
      </div>
    </>
  )
}

export default Signup
