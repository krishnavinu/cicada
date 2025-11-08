import React, { useState, useEffect } from 'react'
import TablePlaceholder from '../TablePlaceholder';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function MyApplied() {
  document.title = 'catalyst | My Applied Job';
  const [loading, setLoading] = useState(true);

  // useState for load data
  const [currentUser, setCurrentUser] = useState({});

  const [jobs, setJobs] = useState([]);

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          role: res.data.role,
        });
      })
      .catch(err => {
        console.log("MyApplied.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);


  const fetchMyJob = async () => {
    if (!currentUser?.id) return;
    try {
      const response = await axios.get(`${BASE_URL}/tpo/myjob/${currentUser?.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response?.data)
        setJobs(response?.data)
      // if (response?.data?.msg)
    } catch (error) {
      console.log("Error While Fetching Error => ", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyJob();
  }, [currentUser?.id]);

  const renderTooltipViewPost = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View Post
    </Tooltip>
  );

  return (
    <div className="relative min-h-screen">
      {/* Animated Background */}
      <div className="animated-bg-container fixed inset-0 -z-10">
        <div className="mesh-gradient-bg"></div>
        <div className="particle-bg">
          {[...Array(30)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-blue-300/40 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6">
      {
        loading ? (
          <TablePlaceholder />
        ) : (
          <GlassCard hoverable={false} glow={true} className="p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
                <i className="fa-solid fa-briefcase text-white text-lg"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
                My Applied Jobs
              </h2>
            </div>
            <Table
              striped
              bordered
              hover
              responsive="sm"
              className='rounded-lg shadow-lg text-base max-sm:text-sm overflow-hidden'
            >
            <thead>
              <tr>
                <th style={{ width: '6%' }}>Sr. No.</th>
                <th style={{ width: '16%' }}><b>Company Name</b></th>
                <th style={{ width: '16%' }}>Job Title</th>
                <th style={{ width: '10%' }}>Annual CTC</th>
                <th style={{ width: '10%' }}>Applied On</th>
                <th style={{ width: '10%' }}>Last date of Application</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '12%' }}>No. of Students Applied</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs?.length > 0 ? (
                jobs?.map((job, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <b>
                        {job?.companyName}
                      </b>
                    </td>
                    <td>
                      {job?.jobTitle}
                    </td>
                    <td>
                      {job?.salary}
                    </td>
                    <td>
                      {new Date(job?.appliedAt.split('T')).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      {new Date(job?.applicationDeadline).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      {job?.status.charAt(0).toUpperCase() + job?.status.slice(1)}
                    </td>
                    <td>
                      {job?.numberOfApplicants}
                    </td>
                    <td>
                      {/* for hover label effect  */}
                      <div className="flex justify-around items-center">
                        <div className="px-0.5">
                          {/* view post  */}
                          <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltipViewPost}
                          >
                            <Link 
                              className="transition-colors duration-200 ease-in-out" 
                              to={`/student/job/${job.jobId}`}
                              style={{ color: 'var(--color-text)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                            >
                              <i className='fa-solid fa-circle-info text-2xl max-sm:text-lg cursor-pointer transition-colors duration-200 ease-in-out' />
                            </Link>
                          </OverlayTrigger>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9">No Jobs found</td>
                </tr>
              )}
            </tbody>
          </Table>
          </GlassCard>
        )
      }
      </div>
    </div>
  )
}

export default MyApplied
