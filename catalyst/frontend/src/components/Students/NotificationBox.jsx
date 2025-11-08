import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NotificationBox() {
  const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/user/detail`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setCurrentUser({ role: response.data.role });
      } catch (error) {
        console.log("Error fetching user details => ", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [currentUser?.role]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log(response.data.data)
      // retriving lastest post
      if (response.data && response.data.data) {
        setJobs(response.data.data.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt)).slice(0, 10));
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.log('Error while fetching notices => ', error);
      setJobs([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <div 
        className="my-2 mx-2 w-full backdrop-blur-xl border-2 rounded-2xl py-4 px-4 shadow-xl hover:shadow-2xl transition-all duration-500 card-hover animate-fadeInUp"
        style={{
          background: 'rgba(36, 30, 42, 0.7)',
          borderColor: 'rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
              }}
            >
              <i className="fa-solid fa-bell text-white"></i>
            </div>
            <h3 
              className="font-bold text-xl"
              style={{ color: 'var(--color-text)' }}
            >
              Notifications
            </h3>
          </div>
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-error)' }}
          ></div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-72">
            <div className="relative">
              <i 
                className="fa-solid fa-spinner fa-spin text-4xl"
                style={{ color: 'var(--color-primary)' }}
              ></i>
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse"
                style={{ backgroundColor: 'var(--color-primary)' }}
              ></div>
            </div>
          </div>
        ) : (
          <div 
            className="relative h-72 overflow-y-auto rounded-xl"
            style={{
              background: 'rgba(26, 21, 31, 0.4)',
              border: '1px solid rgba(139, 92, 246, 0.2)'
            }}
          >
            <div className="w-full flex flex-col gap-2 p-2">
              {jobs?.length > 0 ? (
                jobs.map((job, index) => (
                  <div 
                    key={index} 
                    className="py-3 px-3 rounded-lg transition-all duration-300 hover:translate-x-2 group cursor-pointer border-l-4 border-transparent"
                    style={{
                      borderLeftColor: 'transparent',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                      e.currentTarget.style.borderLeftColor = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.borderLeftColor = 'transparent';
                    }}
                  >
                    <Link
                      className="no-underline font-medium group-hover:underline transition-all duration-300 flex items-center gap-2"
                      style={{ color: 'var(--color-text)' }}
                      to={`/student/job/${job?._id}`}
                      target="_blank"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--color-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-text)';
                      }}
                    >
                      <i 
                        className="fa-solid fa-briefcase text-sm group-hover:scale-110 transition-transform duration-300"
                        style={{ color: 'var(--color-primary)' }}
                      ></i>
                      {job?.jobTitle}
                      {(new Date() - new Date(job?.postedAt)) / (1000 * 60 * 60 * 24) <= 2 && (
                        <Badge 
                          className="border-0 animate-pulse"
                          style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#ffffff'
                          }}
                        >
                          New
                        </Badge>
                      )}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      <i 
                        className="fa-solid fa-clock text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      ></i>
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {new Date(job?.postedAt).toLocaleDateString('en-IN')} {new Date(job?.postedAt).toLocaleTimeString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="flex flex-col items-center justify-center h-full"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <i className="fa-solid fa-inbox text-4xl mb-2"></i>
                  <p>No notifications found!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationBox
