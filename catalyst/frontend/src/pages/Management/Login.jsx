import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../assets/catalyst.png';
import Toast from '../../components/Toast';
import isAuthenticated from '../../utility/auth.utility';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginManagement() {
  document.title = 'catalyst | Management Login';

  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);

  const [error, setError] = useState({});

  // if login user visit redirect to home page
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("../tpo/dashboard");
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
      const response = await axios.post(`${BASE_URL}/management/login`, formData);
      localStorage.setItem('token', response.data.token);
      navigate('/management/dashboard');
    } catch (error) {
      if (error.response.data.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      console.log("Error in Management login.jsx => ", error);
      setLoading(false);
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

      <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
        {/* Enhanced animated background with gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient mesh overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-purple-100/30 to-pink-100/30 animate-gradient-shift bg-[length:300%_300%]"></div>
          
          {/* Animated background particles - enhanced */}
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300/50 rounded-full animate-float backdrop-blur-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
              }}
            ></div>
          ))}
          
          {/* Larger floating orbs */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`orb-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-200/20 to-purple-200/20 blur-3xl animate-float"
              style={{
                width: `${150 + Math.random() * 100}px`,
                height: `${150 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Enhanced Light theme form card with Tailwind utilities */}
        <form 
          className="relative z-10 form-signin flex justify-center items-center flex-col gap-6 rounded-3xl p-10 sm:p-12 shadow-2xl w-full max-w-md mx-auto animate-scaleIn transform transition-all duration-500 hover:shadow-glow-lg backdrop-blur-xl border-2 border-blue-200/50 bg-white/90" 
          onSubmit={handleSubmit}
          style={{ 
            backgroundColor: 'var(--color-background)', 
            borderColor: 'rgba(37, 99, 235, 0.2)'
          }}
        >
          {/* Enhanced Logo with Tailwind animations */}
          <div className="flex justify-center items-center flex-col mb-6 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-700 animate-glow-pulse"></div>
              <img 
                className="relative mb-4 rounded-2xl shadow-2xl w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-blue-100/50 group-hover:ring-blue-300/50" 
                src={Logo} 
                alt="catalyst Logo" 
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
              Management Log In
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg animate-shimmer-slide"></div>
          </div>

          {/* Enhanced Email Input with Tailwind utilities */}
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <i className="fa-solid fa-envelope text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300 transform group-focus-within:scale-110"></i>
              </div>
              <input 
                type="email" 
                id="inputEmail" 
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70" 
                style={{
                  color: 'var(--color-text)'
                }}
                placeholder="Enter your email address" 
                autoFocus 
                autoComplete="email" 
                name="email" 
                value={email} 
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-blue-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 transition-all duration-500 pointer-events-none -z-0"></div>
            </div>
            {error?.email && (
              <div className="mt-2 ml-2 text-red-500 text-sm flex items-center gap-2 animate-fadeInDown bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                <span className="font-medium">{error.email}</span>
              </div>
            )}
          </div>

          {/* Enhanced Password Input with Tailwind utilities */}
          <div className="w-full">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <i className="fa-solid fa-lock text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300 transform group-focus-within:scale-110"></i>
              </div>
              <input 
                type={isEyeOpen ? "text" : "password"} 
                id="inputPassword" 
                className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-blue-200/50 bg-white/80 backdrop-blur-sm text-gray-800 placeholder-gray-400 transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white focus:shadow-lg focus:shadow-blue-200/50 hover:border-blue-300/70" 
                style={{
                  color: 'var(--color-text)'
                }}
                placeholder="Enter your password" 
                autoComplete="current-password" 
                name="password" 
                value={password} 
                onChange={handleChange}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-pink-500/0 group-focus-within:from-blue-500/5 group-focus-within:via-purple-500/5 group-focus-within:to-pink-500/5 transition-all duration-500 pointer-events-none -z-0"></div>
              <button
                type="button"
                onClick={handleEye}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg"
              >
                <i className={`${isEyeOpen ? "fa-solid fa-eye" : "fa-regular fa-eye-slash"} text-lg`}></i>
              </button>
            </div>
            {error?.password && (
              <div className="mt-2 ml-2 text-red-500 text-sm flex items-center gap-2 animate-fadeInDown bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                <span className="font-medium">{error.password}</span>
              </div>
            )}
          </div>

          {/* Enhanced Submit Button with Tailwind gradient and animations */}
          <div className="flex justify-center items-center flex-col w-full mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="relative overflow-hidden w-full py-4 px-6 text-white font-bold rounded-xl shadow-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_200%] animate-gradient-shift transition-all duration-300 hover:scale-105 hover:shadow-glow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group transform active:scale-95"
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                    <span className="text-base">Loading...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">Log In</span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform duration-300 text-sm"></i>
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Enhanced Switch Login Link with Tailwind */}
          <div className="text-center w-full">
            <span className="text-gray-600 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Log In as TPO?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('../tpo/login')}
              className="font-bold cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 inline-flex items-center gap-2 group bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 active:scale-95"
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Click Here
              </span>
              <i className="fa-solid fa-arrow-right text-sm group-hover:translate-x-2 transition-transform duration-300 text-blue-600"></i>
            </button>
          </div>

          {/* Enhanced Back to Home Button with Tailwind */}
          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center gap-2.5 bg-blue-50/80 hover:bg-blue-100/80 border-2 border-blue-200/50 hover:border-blue-300/70 text-blue-700 hover:text-blue-800 font-medium shadow-sm hover:shadow-md backdrop-blur-sm"
            >
              <i className="fa-solid fa-home text-sm"></i>
              <span className="text-sm">Back to Home</span>
            </button>
          </div>
          
          <p className="text-center text-xs sm:text-sm mt-6 text-gray-500" style={{ color: 'var(--color-text-secondary)' }}>
            © catalyst 2024 - 25 | All rights reserved
          </p>
        </form>
      </div>
    </>
  )
}

export default LoginManagement
