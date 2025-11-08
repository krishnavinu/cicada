import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Toast from './Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function ViewUserData() {
  document.title = 'catalyst | User Details';
  const navigate = useNavigate();

  // userId but its userId
  const { userId } = useParams();

  // userData to store user data get from userId
  const [userData, setUserData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [currentUserData, setCurrentUserData] = useState('');

  // count of interview
  const [placement, setPlacement] = useState({});

  // if student placed then job details
  const [jobDetail, setJobDetail] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true); // Set loading to true when the process starts

        const token = localStorage.getItem('token');

        // Fetch current user data
        const currentUserResponse = axios.get(`${BASE_URL}/user/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch student data using userId
        const studentDataResponse = axios.get(`${BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Await both responses simultaneously
        const [currentUserDataRes, studentDataRes] = await Promise.all([
          currentUserResponse,
          studentDataResponse,
        ]);

        setCurrentUserData(currentUserDataRes.data);
        setUserData(studentDataRes.data);

        if (studentDataRes.data?.studentProfile?.appliedJobs) {
          const appliedJobs = studentDataRes.data.studentProfile.appliedJobs;

          // Count interview and rejection statuses
          const interviewCount = appliedJobs.filter((app) => app.status === "interview").length;
          const rejectCount = appliedJobs.filter((app) => app.status === "rejected").length;

          // Check if the student has been hired
          const hiredJob = appliedJobs.find((app) => app.status === "hired");

          // Set placement state
          setPlacement({
            interview: interviewCount,
            reject: rejectCount,
            isPlaced: !!hiredJob,
            packageOffered: hiredJob ? hiredJob.package : null,
            jobId: hiredJob ? hiredJob.jobId._id : null,
          });
        }

        // Fetch job details if the student has a job placement
        if (placement.jobId) {
          const jobDetailResponse = await axios.get(`${BASE_URL}/tpo/job/${placement.jobId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setJobDetail(jobDetailResponse.data);

          // Fetch company details based on job's company
          if (jobDetailResponse.data.company) {
            const companyResponse = await axios.get(`${BASE_URL}/company/company-data?companyId=${jobDetailResponse.data.company}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            setCompany(companyResponse.data.company);
          }
        }

      } catch (error) {
        if (error.response?.data) {
          setToastMessage(error.response.data.msg || error.message);
          setShowToast(true);
          if (error.response.data.msg === "Student not found" || "user not found") {
            navigate("../404");
          }
        } else {
          console.error("Error fetching data", error);
        }
      } finally {
        // Once all operations are done, set loading to false
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId, placement.jobId, placement.companyId]);

  // console.log(typeof(userData?.studentProfile?.interships?.length))

  return (
    <>
      {loading ? (
        <>
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        </>
      ) : (
        <>
          {/*  any message here  */}
          < Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            message={toastMessage}
            delay={3000}
            position="bottom-end"
          />

          <div className="my-8 grid grid-cols-2 gap-4 text-base max-sm:text-sm max-md:grid-cols-1">
            <div 
              className="backdrop-blur-xl border-2 rounded-lg shadow-lg p-6 h-fit max-md:p-3"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 
                className="text-2xl max-md:text-xl font-semibold mb-4"
                style={{ color: 'var(--color-text)' }}
              >
                Personal Details
              </h3>
              <div className="grid grid-cols-2 max-md:grid-cols-1">
                {/* Personal Info */}
                <div className="space-y-4">
                  <div>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Full Name: 
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>
                      {userData?.first_name + " "}
                      {userData?.middle_name && userData?.middle_name + " "}
                      {userData?.last_name}
                    </span>
                  </div>

                  <div>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Email: 
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>
                      {userData?.email}
                    </span>
                  </div>

                  <div>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Number: 
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>
                      {userData?.number}
                    </span>
                  </div>

                  {userData?.gender && (
                    <div>
                      <span 
                        className="font-bold"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Gender: 
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>
                        {userData?.gender}
                      </span>
                    </div>
                  )}
                  {userData?.dateOfBirth && (
                    <div>
                      <span 
                        className="font-bold"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Date of Birth: 
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>
                        {new Date(userData?.dateOfBirth).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  )}

                  {userData?.fullAddress && (
                    <div>
                      <span 
                        className="font-bold"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Address: 
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>
                        {userData?.fullAddress?.address + " - " + userData?.fullAddress?.pincode}
                      </span>
                    </div>
                  )}
                  <div>
                    <span 
                      className="font-bold"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      Joined On: 
                    </span>
                    <span style={{ color: 'var(--color-text)' }}>
                      {new Date(userData?.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {userData?.studentProfile?.isApproved && (
                    <div>
                      <span 
                        className="font-bold"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        Is Student Approved: 
                      </span>
                      <span style={{ color: 'var(--color-text)' }}>
                        {userData?.studentProfile?.isApproved === true ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-start items-end max-md:items-center max-md:mt-1">
                  {/* Profile Picture */}
                  <Col xs={6} md={9} className=" flex justify-end rounded">
                    <Image src={userData?.profile} thumbnail />
                  </Col>
                  {(userData?.studentProfile?.resume !== "undefined" && userData?.role === 'student') && (
                    <div className="py-2 px-2 max-sm:text-sm">
                      <span 
                        className='py-1 pr-2 rounded cursor-pointer transition-all duration-300'
                        style={{
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 100%)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)';
                        }}
                      >
                        <a 
                          href={userData?.studentProfile?.resume} 
                          target='_blanck' 
                          className='no-underline text-white'
                        >
                          <i className="fa-regular fa-eye px-2" />
                          View Resume
                        </a>
                      </span>
                      <p 
                        className='text-sm max-sm:text-xs mt-1'
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {userData?.studentProfile?.resume?.filename}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>


            {userData?.role === "student" && (
              <>
                {/* placement status  */}
                <div 
                  className="backdrop-blur-xl border-2 rounded-lg shadow-lg p-6 h-fit max-md:p-3"
                  style={{
                    background: placement?.isPlaced === true 
                      ? 'rgba(5, 150, 105, 0.2)' 
                      : 'var(--color-surface)',
                    borderColor: placement?.isPlaced === true
                      ? 'rgba(5, 150, 105, 0.4)'
                      : 'var(--color-border)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className=''>
                    <h3 
                      className="text-2xl max-md:text-xl font-semibold mb-4"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Placement Status
                    </h3>
                    <div className="grid gap-1">
                      {/* placement status  */}
                      <div className="grid">
                        <div className="grid grid-flow-col">
                          <div className="space-y-4">
                            <div>
                              {/* No. of jobs applied  */}
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                No. of Jobs Applied: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {userData?.studentProfile?.appliedJobs?.length}
                              </span>
                            </div>
                            <div>
                              {/* No. of interview */}
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                No. of Interview: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {placement?.interview}
                              </span>
                            </div>
                            <div>
                              {/* No. of rejection */}
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                No. of Rejection: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {placement?.reject}
                              </span>
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <div>
                              {/* Is Placed */}
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                Is Placed?: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {placement?.isPlaced === true
                                  ? <b style={{ color: 'var(--color-success)' }}>Yes</b>
                                  : <b style={{ color: 'var(--color-error)' }}>No</b>}
                              </span>
                            </div>
                            {
                              placement?.isPlaced === true && (
                                <>
                                  <div>
                                    {/* If Placed then package? */}
                                    <span 
                                      className="font-bold"
                                      style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                      Package: 
                                    </span>
                                    <span style={{ color: 'var(--color-text)' }}>
                                      {placement?.packageOffered + " LPA"}
                                    </span>
                                  </div>
                                  <div>
                                    {/* company details */}
                                    <span 
                                      className="font-bold"
                                      style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                      Company Name: 
                                    </span>
                                    <span style={{ color: 'var(--color-text)' }}>
                                      {company?.companyName}
                                    </span>
                                  </div>
                                  <div>
                                    {/* Job Title */}
                                    <span 
                                      className="font-bold"
                                      style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                      Job Title: 
                                    </span>
                                    <span style={{ color: 'var(--color-text)' }}>
                                      {jobDetail?.jobTitle}
                                    </span>
                                  </div>
                                </>
                              )
                            }
                          </div>
                        </div>
                        {placement?.isPlaced !== true && (
                          <>
                            <div className="my-2">
                              <Accordion flush className='flex flex-col gap-4'>
                                <Accordion.Item eventKey={'0'} className='shadow-md'>
                                  <Accordion.Header>Job Applied Detail</Accordion.Header>
                                  <Accordion.Body>
                                    <Table striped borderless hover sixe='sm'>
                                      <thead>
                                        <tr>
                                          <th style={{ width: "5%" }}>#</th>
                                          <th style={{ width: "20%" }}>Company Name</th>
                                          <th style={{ width: "20%" }}>Job Title</th>
                                          <th style={{ width: "20%" }}>Current Round</th>
                                          <th style={{ width: "15%" }}>Round Status</th>
                                          <th style={{ width: "10%" }}>Status</th>
                                          <th style={{ width: "10%" }}>Applied On</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {
                                          userData?.studentProfile?.appliedJobs?.length > 0 ? (
                                            userData?.studentProfile?.appliedJobs?.map((job, index) => {
                                              const applicant = job.jobId?.applicants?.find(applicant => applicant.studentId === userData._id);
                                              return (
                                                <>
                                                  <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{job?.jobId?.company?.companyName || '-'}</td>
                                                    <td>{job?.jobId?.jobTitle || '-'}</td>
                                                    <td>
                                                      {applicant?.currentRound
                                                        ? applicant.currentRound.charAt(0).toUpperCase() + applicant.currentRound.slice(1)
                                                        : '-'}
                                                    </td>
                                                    <td>
                                                      {applicant?.roundStatus
                                                        ? applicant.roundStatus.charAt(0).toUpperCase() + applicant.roundStatus.slice(1)
                                                        : '-'}
                                                    </td>
                                                    <td>{job?.status ? job?.status.charAt(0).toUpperCase() + job?.status.slice(1) : '-'}</td>
                                                    <td>
                                                      {new Date(job?.appliedAt.split('T')[0]).toLocaleDateString('en-IN') || '-'}
                                                    </td>
                                                  </tr>
                                                </>
                                              )
                                            })
                                          ) : (
                                            <tr>
                                              <td colSpan={7}>Not Yet Applied Any Job!</td>
                                            </tr>
                                          )
                                        }

                                      </tbody>
                                    </Table>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            </div>
                          </>
                        )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}



            {
              // if user profile completed and role is of student only 
              (userData?.isProfileCompleted === true && userData?.role === 'student') && (
                <>
                  <div 
                    className="backdrop-blur-xl border-2 rounded-lg shadow-lg p-6 max-md:p-3"
                    style={{
                      background: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className=''>
                      <h3 
                        className="text-2xl max-md:text-xl font-semibold mb-4"
                        style={{ color: 'var(--color-text)' }}
                      >
                        College Information
                      </h3>

                      <div className="grid gap-1">
                        {/* College Information */}
                        <div className="grid grid-flow-col">
                          <div className="space-y-4">
                            {userData?.studentProfile?.UIN && (
                              <div>
                                <span 
                                  className="font-bold"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  UIN: 
                                </span>
                                <span style={{ color: 'var(--color-text)' }}>
                                  {userData?.studentProfile?.UIN}
                                </span>
                              </div>
                            )}
                            {userData?.studentProfile?.rollNumber && (
                              <div>
                                <span 
                                  className="font-bold"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  Roll Number: 
                                </span>
                                <span style={{ color: 'var(--color-text)' }}>
                                  {userData?.studentProfile?.rollNumber}
                                </span>
                              </div>

                            )}
                            {userData?.studentProfile?.department && (
                              <div>
                                <span 
                                  className="font-bold"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  Department: 
                                </span>
                                <span style={{ color: 'var(--color-text)' }}>
                                  {userData?.studentProfile?.department + " "}
                                  Engineering
                                </span>
                              </div>
                            )}
                            {userData?.studentProfile?.year && (
                              <div>
                                <span 
                                  className="font-bold"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  Year: 
                                </span>
                                <span style={{ color: 'var(--color-text)' }}>
                                  {userData?.studentProfile?.year}
                                  {userData?.studentProfile?.year === 1 && 'st'}
                                  {userData?.studentProfile?.year === 2 && 'nd'}
                                  {userData?.studentProfile?.year === 3 && 'rd'}
                                  {userData?.studentProfile?.year === 4 && 'th'}
                                </span>
                              </div>
                            )}
                            {userData?.studentProfile?.addmissionYear && (
                              <div>
                                <span 
                                  className="font-bold"
                                  style={{ color: 'var(--color-text-secondary)' }}
                                >
                                  Addmission Year: 
                                </span>
                                <span style={{ color: 'var(--color-text)' }}>
                                  {userData?.studentProfile?.addmissionYear}
                                </span>
                              </div>
                            )}
                            <div>
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                Live KT's: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {userData?.studentProfile?.liveKT || 0}
                              </span>
                            </div>
                            <div>
                              <span 
                                className="font-bold"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                Any Gap: 
                              </span>
                              <span style={{ color: 'var(--color-text)' }}>
                                {userData?.studentProfile?.gap === true ? "Yes" : "No"}
                              </span>
                            </div>
                          </div>

                          {userData?.studentProfile?.SGPA && (
                            <>
                              <div className="flex flex-col gap-3">
                                <div className="font-bold">SGPA:</div>
                                <div className="flex gap-6 justify-center items-start max-sm:flex-col max-sm:gap-3">
                                  <div className="space-y-6 max-sm:space-y-3">
                                    {
                                      userData?.studentProfile?.SGPA?.sem1 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-all duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem I: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem1}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem2 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem II: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem2}
                                          </span>
                                        </div>

                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem3 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem III: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem3}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem4 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem IV: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem4}
                                          </span>
                                        </div>
                                      )
                                    }
                                  </div>
                                  <div className="space-y-6 max-sm:space-y-3">
                                    {
                                      userData?.studentProfile?.SGPA?.sem5 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem V: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem5}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem6 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem VI: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem6}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem7 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem VII: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem7}
                                          </span>
                                        </div>
                                      )
                                    }
                                    {
                                      userData?.studentProfile?.SGPA?.sem8 && (
                                        <div 
                                          className='border-2 px-2 rounded transition-transform duration-200 cursor-pointer hover:scale-125'
                                          style={{
                                            borderColor: 'rgba(139, 92, 246, 0.3)',
                                            backgroundColor: 'rgba(139, 92, 246, 0.1)'
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
                                          }}
                                        >
                                          <span 
                                            className="font-bold"
                                            style={{ color: 'var(--color-text-secondary)' }}
                                          >
                                            Sem VIII: 
                                          </span>
                                          <span style={{ color: 'var(--color-text)' }}>
                                            {userData?.studentProfile?.SGPA?.sem8}
                                          </span>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            }


            {(userData?.studentProfile?.pastQualification && userData?.role === 'student') && (
              <>
                <div 
                  className="backdrop-blur-xl border-2 rounded-lg shadow-lg p-6 h-fit max-md:p-3"
                  style={{
                    background: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div className=''>
                    <h3 
                      className="text-2xl max-md:text-xl font-semibold mb-4"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Past Qualification
                    </h3>
                    <div className="grid gap-4">
                      {/* past Qualification ssc */}
                      {
                        userData?.studentProfile?.pastQualification?.ssc && (
                          <>
                            <div className="">
                              <div className="font-bold">
                                SSC:
                              </div>
                              <div className="space-y-1 pl-2">
                                {
                                  userData?.studentProfile?.pastQualification?.ssc?.board && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Board: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.ssc?.board}
                                      </span>
                                    </div>
                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.ssc?.year && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Passing Year: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.ssc?.year}
                                      </span>
                                    </div>

                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.ssc?.percentage && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Percentage: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.ssc?.percentage + "%"}
                                      </span>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          </>
                        )
                      }
                      {/* past Qualification hsc */}
                      {
                        userData?.studentProfile?.pastQualification?.hsc && (
                          <>
                            <div className="">
                              <div 
                                className="font-bold"
                                style={{ color: 'var(--color-text)' }}
                              >
                                HSC:
                              </div>
                              <div className="space-y-1 pl-2">
                                {
                                  userData?.studentProfile?.pastQualification?.hsc?.board && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Board: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.hsc?.board}
                                      </span>
                                    </div>
                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.hsc?.year && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Passing Year: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.hsc?.year}
                                      </span>
                                    </div>

                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.hsc?.percentage && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Percentage: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.hsc?.percentage + "%"}
                                      </span>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          </>
                        )
                      }
                      {/* past Qualification diploma */}
                      {
                        userData?.studentProfile?.pastQualification?.diploma && (
                          <>
                            <div className="">
                              <div 
                                className="font-bold"
                                style={{ color: 'var(--color-text)' }}
                              >
                                Diploma:
                              </div>
                              <div className="space-y-4 pl-2">
                                {
                                  userData?.studentProfile?.pastQualification?.diploma?.department && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Board: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.diploma?.department}
                                      </span>
                                    </div>
                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.diploma?.year && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Passing Year: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.diploma?.year}
                                      </span>
                                    </div>

                                  )
                                }
                                {
                                  userData?.studentProfile?.pastQualification?.diploma?.percentage && (
                                    <div>
                                      <span 
                                        className="font-bold"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                      >
                                        Percentage: 
                                      </span>
                                      <span style={{ color: 'var(--color-text)' }}>
                                        {userData?.studentProfile?.pastQualification?.diploma?.percentage}
                                      </span>
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              </>
            )}


            {/* Internship details  */}
            {(userData?.studentProfile?.internships && userData.studentProfile.internships.length !== 0) && (
              <div 
                className="col-span-2 backdrop-blur-xl border-2 rounded-lg shadow-lg p-6 h-fit max-md:p-3 max-md:col-span-1"
                style={{
                  background: 'rgba(36, 30, 42, 0.7)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className=''>
                  <div className="flex justify-between">
                    <h3 
                      className="text-2xl max-md:text-xl font-semibold mb-4"
                      style={{ color: 'var(--color-text)' }}
                    >
                      Internship Details
                    </h3>
                    <h5 
                      className='text-xl font-semibold mb-4'
                      style={{ color: 'var(--color-text)' }}
                    >
                      ({userData?.studentProfile?.internships?.length || 0})
                    </h5>
                  </div>

                  <div className="grid gap-1">
                    {/* Internship details  */}
                    <div className=''>

                      <Accordion defaultActiveKey={['1']} flush className='flex flex-col gap-4'>
                        <Accordion.Item eventKey={'1'} className='shadow-md'>
                          <Accordion.Header>Job Applied Detail</Accordion.Header>
                          <Accordion.Body>
                            <Table striped borderless hover>
                              <thead>
                                <tr>
                                  <th style={{ width: "5%" }}>#</th>
                                  <th style={{ width: "25%" }}>Company Name</th>
                                  <th style={{ width: "25%" }}>Company Website</th>
                                  <th style={{ width: "15%" }}>Internship Type</th>
                                  <th style={{ width: "15%" }}>Duration</th>
                                  <th style={{ width: "15%" }}>Monthly Stipend</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  userData?.studentProfile?.internships?.map((internship, index) => (
                                    <tr key={internship._id}>
                                      <td>{index + 1}</td>
                                      <td>{internship?.companyName}</td>
                                      <td>
                                        <a
                                          href={internship?.companyWebsite}
                                          target='_blanck'
                                          className='no-underline text-blue-500 hover:text-blue-700'
                                        >
                                          {internship?.companyWebsite || '-'}
                                        </a>
                                      </td>
                                      <td>{internship?.type || '-'}</td>
                                      <td>{internship?.internshipDuration + " days" || '-'}</td>
                                      <td>
                                        {internship?.monthlyStipend ? `Rs. ${internship?.monthlyStipend}` : '-'}
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </Table>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>



                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ViewUserData
