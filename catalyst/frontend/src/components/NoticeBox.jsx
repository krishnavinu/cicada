import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function NoticeBox() {
  const [loading, setLoading] = useState(true);
  const [noticesData, setNoticesData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  // Fetch the current user data
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

  // Fetch notices only after the user role is available
  useEffect(() => {
    if (currentUser?.role) {
      fetchNotices();
    }
  }, [currentUser?.role]);

  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/management/get-all-notices`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      let filteredNotices = [];
      if (currentUser?.role === 'management_admin') {
        filteredNotices = response.data.filter(notice => notice.sender_role === 'tpo_admin');
      } else if (currentUser?.role === 'tpo_admin') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'tpo_admin');
      } else if (currentUser?.role === 'student') {
        filteredNotices = response.data.filter(notice => notice.receiver_role === 'student');
      }

      setNoticesData(filteredNotices);
    } catch (error) {
      console.log('Error while fetching notices => ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            <i className="fa-solid fa-bullhorn text-white"></i>
          </div>
          <h3 
            className="font-bold text-xl"
            style={{ color: 'var(--color-text)' }}
          >
            Notices
          </h3>
        </div>
        <span className=''>
          {
            currentUser?.role === 'student' && (
              <Link 
                to='/student/all-notice' 
                className='no-underline font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-1 group'
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            )
          }
          {
            currentUser?.role === 'tpo_admin' && (
              <Link 
                to='/tpo/all-notice' 
                className='no-underline font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-1 group'
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            )
          }
          {
            currentUser?.role === 'management_admin' && (
              <Link 
                to='/management/all-notice' 
                className='no-underline font-semibold transition-all duration-300 hover:scale-105 inline-flex items-center gap-1 group'
                style={{ color: 'var(--color-primary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                }}
              >
                View All
                <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
              </Link>
            )
          }
        </span>
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
            {noticesData?.length > 0 ? (
              noticesData.map((notice, index) => (
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
                    to={
                      currentUser?.role === 'student'
                        ? `/student/notice/${notice?._id}`
                        : currentUser?.role === 'tpo_admin'
                          ? `/tpo/notice/${notice?._id}`
                          : currentUser.role === 'management_admin'
                            ? `/management/notice/${notice?._id}`
                            : ''
                    }
                    target="_blank"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--color-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--color-text)';
                    }}
                  >
                    <i 
                      className="fa-solid fa-file-alt text-sm group-hover:scale-110 transition-transform duration-300"
                      style={{ color: 'var(--color-primary)' }}
                    ></i>
                    {notice?.title}
                    {(new Date() - new Date(notice?.createdAt)) / (1000 * 60 * 60 * 24) <= 2 && (
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
                      {new Date(notice?.createdAt).toLocaleDateString('en-IN')} {new Date(notice?.createdAt).toLocaleTimeString('en-IN')}
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
                <p>No notices found!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoticeBox;
