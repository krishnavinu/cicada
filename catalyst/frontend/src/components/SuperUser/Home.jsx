import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function Home() {
  document.title = 'catalyst | Admin Dashboard';

  const [countUsers, setCountUsers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/all-users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setCountUsers(response.data);
      } catch (error) {
        console.log("Home.jsx => ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground intensity="medium" />
      <div className="relative z-10 p-6">
        {loading ? (
          <div className="flex justify-center h-72 items-center">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <p className="text-gray-600 font-medium">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-3 shadow-lg bounce-icon">
                  <i className="fa-solid fa-user-shield text-white text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 gradient-text">Super Admin Dashboard</h1>
                  <p className="text-gray-600 font-medium">Manage all users and system settings</p>
                </div>
              </div>
            </div>

            {/* User Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Link className='no-underline' to='../admin/management'>
                <GlassCard hoverable={true} glow={true} className="p-6 text-center cursor-pointer h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-lg">
                      <i className="fa-solid fa-users-cog text-white text-3xl"></i>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-800 mb-2'>Management Admin</h3>
                      <p className='text-4xl font-bold gradient-text'>{countUsers.managementUsers}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
              
              <Link className='no-underline' to='../admin/tpo'>
                <GlassCard hoverable={true} glow={true} className="p-6 text-center cursor-pointer h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 shadow-lg">
                      <i className="fa-solid fa-briefcase text-white text-3xl"></i>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-800 mb-2'>TPO Admin</h3>
                      <p className='text-4xl font-bold gradient-text'>{countUsers.tpoUsers}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
              
              <Link className='no-underline' to='../admin/student'>
                <GlassCard hoverable={true} glow={true} className="p-6 text-center cursor-pointer h-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 shadow-lg">
                      <i className="fa-solid fa-user-graduate text-white text-3xl"></i>
                    </div>
                    <div>
                      <h3 className='text-xl font-bold text-gray-800 mb-2'>Student User</h3>
                      <p className='text-4xl font-bold gradient-text'>{countUsers.studentUsers}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
              
              <GlassCard hoverable={true} glow={true} className="p-6 text-center h-full">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 shadow-lg">
                    <i className="fa-solid fa-crown text-white text-3xl"></i>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Superuser</h3>
                    <p className='text-4xl font-bold gradient-text'>{countUsers.superUsers}</p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Student Approval Pending Alert */}
            {countUsers.studentApprovalPendingUsers !== 0 && (
              <div className="flex justify-center">
                <Link className='no-underline w-full max-w-2xl' to='../admin/approve-student'>
                  <GlassCard 
                    hoverable={true} 
                    glow={true} 
                    className="p-6 text-center cursor-pointer border-2 border-red-300 bg-gradient-to-br from-red-50 to-pink-50"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-4 shadow-lg animate-pulse">
                        <i className="fa-solid fa-exclamation-triangle text-white text-3xl"></i>
                      </div>
                      <div>
                        <h3 className='text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3'>
                          Student Approval Pending
                          <Badge bg="danger" pill className='text-sm'>Action Needed</Badge>
                        </h3>
                        <p className='text-4xl font-bold text-red-600'>{countUsers.studentApprovalPendingUsers}</p>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
