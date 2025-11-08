import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function PostJob() {
  document.title = 'catalyst | Post Job';
  const navigate = useNavigate();

  const { jobId } = useParams();
  const editor = useRef(null);

  const [data, setData] = useState({});
  const [companys, setCompanys] = useState(null);

  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.company || !data?.jobTitle || !data?.salary || !data?.applicationDeadline || !data?.jobDescription || !data?.eligibility || !data?.howToApply) {
      setToastMessage("All Fields Required!");
      setShowToast(true);
      return;
    }
    // console.log(data)
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/tpo/post-job`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )

      // console.log(response.data)
      if (response?.data?.msg) {
        setToastMessage(response.data.msg);
        setShowToast(true);

        const newDataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg,
        };
        navigate('../tpo/job-listings', { state: newDataToPass });
      }
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)

        setShowToast(true);
      }
      console.log("PostJob error while fetching => ", error);
    }
  }

  const handleDataChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);

        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchCompanys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/company/company-detail`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      setCompanys(response.data.companys);
    } catch (error) {
      console.log("Error fetching jobs ", error);
      if (error?.response?.data?.msg) {
        setToastMessage(error.response.data.msg);
        setShowToast(true);
      }
    }
  }

  useEffect(() => {
    // calling fetchJobDetail
    fetchJobDetail();
    fetchCompanys();
    if (!jobId) setLoading(false);
  }, []);

  // for formating date of birth
  const formatDate = (isoString) => {
    if (!isoString || isoString === "undefined") return "";
    const date = new Date(isoString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="relative min-h-screen">
        <AnimatedBackground intensity="low" />
        <div className="relative z-10 p-6">
          {
            loading ? (
              <div className="flex justify-center h-72 items-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                  <p className="text-gray-600 font-medium">Loading form...</p>
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto">
                <form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
                        <i className="fa-solid fa-briefcase text-white text-lg"></i>
                      </div>
                      <h2 className="text-3xl font-bold gradient-text">Post Job</h2>
                    </div>
                  </div>

                  {/* Company Selection */}
                  <GlassCard hoverable={false} glow={true} className="mb-6 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                        <i className="fa-solid fa-building text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold gradient-text">Company Details</h3>
                    </div>
                    <FloatingLabel controlId="floatingSelectDifficulty" label={
                      <>
                        <span>Select Company Name <span className='text-red-500'>*</span></span>
                      </>
                    }>
                      <Form.Select
                        aria-label="Floating label select difficulty"
                        className='cursor-pointer'
                        name='companySelected'
                        value={data?.company || ''}
                        onChange={(e) => {
                          setData({
                            ...data,
                            company: e.target.value
                          });
                        }}
                      >
                        <option disabled value='' className='text-gray-400'>Select Company Name</option>
                        {
                          companys?.map((company, index) => (
                            <option key={index} value={company._id}>{company.companyName}</option>
                          ))
                        }
                      </Form.Select>
                    </FloatingLabel>
                  </GlassCard>

                  {/* Job Details */}
                  <GlassCard hoverable={false} glow={true} className="mb-6 p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2">
                        <i className="fa-solid fa-file-alt text-white"></i>
                      </div>
                      <h3 className="text-xl font-bold gradient-text">Job Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <FloatingLabel controlId="floatingJobTitle" label={
                        <>
                          <span>Job Title <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          placeholder="Job Title"
                          name='jobTitle'
                          value={data?.jobTitle || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingSalary" label={
                        <>
                          <span>Salary (In LPA) <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="text"
                          placeholder="Salary"
                          name="salary"
                          value={data?.salary || ''}
                          onChange={(e) => {
                            // Allow only numbers and decimals
                            if (!isNaN(e.target.value) && /^[0-9]*[.,]?[0-9]*$/.test(e.target.value)) {
                              handleDataChange(e);
                            }
                          }}
                        />
                      </FloatingLabel>

                      <FloatingLabel controlId="floatingDeadlineDate" label={
                        <>
                          <span>Deadline Date <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="date"
                          placeholder="Deadline Date"
                          name='applicationDeadline'
                          value={formatDate(data?.applicationDeadline) || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                    </div>

                    {/* Text Editors */}
                    <div className="space-y-6">
                      <div>
                        <label className='text-gray-700 font-semibold mb-2 block'>
                          Enter Job Description <span className="text-red-500">*</span>
                        </label>
                        <JoditEditor
                          ref={editor}
                          tabIndex={1}
                          value={data?.jobDescription || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              jobDescription: e
                            })
                          }}
                        />
                      </div>
                      <div>
                        <label className='text-gray-700 font-semibold mb-2 block'>
                          Enter Eligibility <span className="text-red-500">*</span>
                        </label>
                        <JoditEditor
                          ref={editor}
                          tabIndex={2}
                          value={data?.eligibility || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              eligibility: e
                            })
                          }}
                        />
                      </div>
                      <div>
                        <label className='text-gray-700 font-semibold mb-2 block'>
                          Enter Process To Apply <span className="text-red-500">*</span>
                        </label>
                        <JoditEditor
                          ref={editor}
                          tabIndex={3}
                          value={data?.howToApply || ''}
                          onChange={(e) => {
                            setData({
                              ...data,
                              howToApply: e
                            })
                          }}
                        />
                      </div>
                    </div>
                  </GlassCard>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button 
                      variant="primary" 
                      type='submit' 
                      size='lg'
                      className="gradient-button px-8 py-3 text-lg font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                        border: 'none',
                        color: '#ffffff'
                      }}
                    >
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      POST JOB
                    </Button>
                  </div>
                </form>
              </div>
            )
          }
        </div>
      </div>

      {/* ModalBox Component for Delete Confirmation */}
      <ModalBox
        show={showModal}
        close={closeModal}
        header={"Confirmation"}
        body={`Do you want to post job for ${data?.jobTitle}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}
export default PostJob
