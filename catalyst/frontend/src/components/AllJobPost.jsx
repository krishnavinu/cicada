import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import Placeholder from 'react-bootstrap/Placeholder';
import { useLocation, useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ModalBox from './Modal';
import Toast from './Toast';
import TablePlaceholder from './TablePlaceholder';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AllJobPost() {
  document.title = 'catalyst | Job Listings';
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState({});
  const [currentUser, setCurrentUser] = useState(null);  // Set to null initially

  // Toast and Modal states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [dataToParasModal, setDataToParasModal] = useState(null);
  const [modalBody, setModalBody] = useState({
    cmpName: '',
    jbTitle: ''
  });

  // Checking for authentication and fetching user details
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
          email: res.data.email,
          role: res.data.role,
        });
        fetchJobs();  // Fetch jobs only after the user info is loaded
      })
      .catch(err => {
        console.log("Error in fetching user details => ", err);
        setToastMessage(err.message || 'Error loading user data');
        setShowToast(true);
      });
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/jobs`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const jobsData = response.data.data || [];
      setJobs(jobsData);
      
      // Extract company names - backend should populate them
      const companyNames = {};
      const unpopulatedIds = [];
      
      jobsData.forEach(job => {
        if (job.company) {
          // Check if company is already populated (object with companyName)
          if (typeof job.company === 'object' && job.company._id) {
            companyNames[job.company._id] = job.company.companyName || 'Unknown Company';
          } else if (typeof job.company === 'string') {
            // If it's just an ID string, we need to fetch it
            unpopulatedIds.push(job.company);
          }
        }
      });
      
      // Fetch unpopulated company names
      if (unpopulatedIds.length > 0) {
        const uniqueIds = [...new Set(unpopulatedIds)];
        const promises = uniqueIds.map(async (companyId) => {
          try {
            const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              }
            });
            if (response.data && response.data.company) {
              companyNames[companyId] = response.data.company.companyName;
            } else {
              companyNames[companyId] = 'Unknown Company';
            }
          } catch (error) {
            console.log("Error fetching company name => ", error);
            companyNames[companyId] = 'Unknown Company';
          }
        });
        
        await Promise.all(promises);
      }
      
      setCompanies(companyNames);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
      setLoading(false);
    }
  };

  const handleDeletePost = (jobId, cmpName, jbTitle) => {
    setDataToParasModal(jobId);
    setModalBody({
      cmpName: cmpName,
      jbTitle: jbTitle
    });
    setShowModal(true);
  };

  const confirmDelete = async (jobId) => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/delete-job`, { jobId });
      setShowModal(false);
      fetchJobs();
      if (response?.data?.msg) {
        setToastMessage(response?.data?.msg);
        setShowToast(true);
      }
    } catch (error) {
      if (error?.response?.data?.msg) {
        setToastMessage(error?.response?.data?.msg);
        setShowToast(true);
      }
      console.log("Error deleting job ", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setDataToParasModal(null);
  };

  const { showToastPass, toastMessagePass } = location.state || { showToastPass: false, toastMessagePass: '' };

  useEffect(() => {
    if (showToastPass) {
      setToastMessage(toastMessagePass);
      setShowToast(showToastPass);
      navigate('.', { replace: true, state: {} });
    }
    if (!jobs) setLoading(false);
  }, []);

  return (
    <>
      {/* Toast Component */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className=''>
        {
          loading || !currentUser ? (
            <TablePlaceholder />
          ) : (
            <div className="overflow-x-auto max-sm:text-sm max-sm:p-1">
              <div className="table-scrollbar">
                <Table 
                  striped 
                  bordered 
                  hover 
                  className='my-6 rounded-lg shadow w-full'
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text)'
                  }}
                >
                  <thead>
                    <tr>
                      <th>Sr. No.</th>
                      <th><b>Company Name</b></th>
                      <th>Job Title</th>
                      <th>Annual CTC</th>
                      <th>Last date of Application</th>
                      <th>No. of Students Applied</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs?.length > 0 ? (
                      jobs?.map((job, index) => {
                        const isMatched = job?.applicants?.find(student => student.studentId == currentUser.id);
                        return (
                            <tr
                              key={job?._id}
                              className={`transition-all duration-300 hover:shadow-md hover:scale-[1.01] cursor-pointer group ${isMatched ? 'table-success' : ''}`}
                              style={{
                                backgroundColor: isMatched ? 'rgba(var(--color-success-rgb, 5, 150, 105), 0.1)' : 'inherit'
                              }}
                            >
                              <td 
                                className="transition-colors duration-300"
                                style={{ color: 'var(--color-text)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                              >
                                {index + 1}
                              </td>
                              <td 
                                className="transition-colors duration-300"
                                style={{ color: 'var(--color-text)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                              >
                                <b>
                                  {job?.company?.companyName || companies[job?.company?._id || job?.company] || 'Unknown Company'}
                                </b>
                              </td>
                              <td 
                                className="font-semibold transition-colors duration-300"
                                style={{ color: 'var(--color-text)' }}
                                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                              >
                                {job?.jobTitle}
                              </td>
                              <td>
                                <span 
                                  className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                                  style={{
                                    background: 'linear-gradient(135deg, var(--color-success) 0%, #047857 100%)'
                                  }}
                                >
                                  ₹{job?.salary} LPA
                                </span>
                              </td>
                              <td style={{ color: 'var(--color-text-secondary)' }}>
                                {new Date(job?.applicationDeadline).toLocaleDateString('en-IN')}
                              </td>
                              <td>
                                <span 
                                  className="px-3 py-1 rounded-full text-sm font-medium"
                                  style={{
                                    backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                                    color: 'var(--color-primary)'
                                  }}
                                >
                                  {job?.applicants?.length || 0} Applied
                                </span>
                              </td>
                            <td>
                              <div className="flex justify-around items-center">
                                <div className="px-0.5">
                                  {/* View Post */}
                                  <OverlayTrigger
                                    placement="top"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={<Tooltip>View Post</Tooltip>}
                                  >
                                    <button
                                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg group/btn"
                                      onClick={() => {
                                        const rolePaths = {
                                          'tpo_admin': `../tpo/job/${job._id}`,
                                          'management_admin': `../management/job/${job._id}`,
                                          'superuser': `../admin/job/${job._id}`,
                                          'student': `../student/job/${job._id}`,
                                        };
                                        navigate(rolePaths[currentUser.role]);
                                      }}
                                    >
                                      <i className="fa-solid fa-eye text-sm group-hover/btn:scale-110 transition-transform duration-300"></i>
                                    </button>
                                  </OverlayTrigger>
                                </div>
                                {
                                  currentUser.role !== 'student' && (
                                    <>
                                      {/* Edit Post */}
                                      <div className="px-0.5">
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 400 }}
                                          overlay={<Tooltip>Edit Post</Tooltip>}
                                        >
                                          <button
                                            className="p-2 rounded-lg bg-green-100 hover:bg-green-500 text-green-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg group/btn"
                                            onClick={() => {
                                              const rolePaths = {
                                                'tpo_admin': `../tpo/post-job/${job._id}`,
                                                'management_admin': `../management/post-job/${job._id}`,
                                                'superuser': `../admin/post-job/${job._id}`,
                                              };
                                              navigate(rolePaths[currentUser.role]);
                                            }}
                                          >
                                            <i className="fa-solid fa-pen-to-square text-sm group-hover/btn:scale-110 transition-transform duration-300"></i>
                                          </button>
                                        </OverlayTrigger>
                                      </div>

                                      {/* Delete Post */}
                                      <div className="px-0.5">
                                        <OverlayTrigger
                                          placement="top"
                                          delay={{ show: 250, hide: 400 }}
                                          overlay={<Tooltip>Delete Post</Tooltip>}
                                        >
                                          <button
                                            className="p-2 rounded-lg bg-red-100 hover:bg-red-500 text-red-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg group/btn"
                                            onClick={() => handleDeletePost(job?._id, job?.company?.companyName || companies[job?.company?._id || job?.company] || 'Unknown', job?.jobTitle)}
                                          >
                                            <i className="fa-solid fa-trash-can text-sm group-hover/btn:scale-110 transition-transform duration-300"></i>
                                          </button>
                                        </OverlayTrigger>
                                      </div>
                                    </>
                                  )
                                }
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No Job Posts Found!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>



          )
        }
      </div>

      {/* Modal Box for Confirm Delete */}
      <ModalBox
        show={showModal}
        modalHeader={`Confirm Delete ${modalBody?.cmpName}`}
        modalBody={<>
          Are you sure you want to delete this post of <b>{modalBody?.jbTitle}</b> from {modalBody?.cmpName}?
        </>}
        modalActions={<>
          <button className='btn btn-secondary' onClick={closeModal}>
            Cancel
          </button>
          <button className='btn btn-danger' onClick={() => confirmDelete(dataToParasModal)}>
            Delete
          </button>
        </>}
      />
    </>
  );
}

export default AllJobPost;
