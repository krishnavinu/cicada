import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Toast from '../Toast';
import ModalBox from '../Modal';
import AnimatedBackground from '../UI/AnimatedBackground';
import GlassCard from '../UI/GlassCard';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function AddCompany() {
  document.title = 'catalyst | Add Company';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { companyId } = useParams();

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // useState for Modal display
  const [showModal, setShowModal] = useState(false);

  const [data, setData] = useState();

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data?.companyName || !data?.companyDescription || !data?.companyDifficulty || !data?.companyLocation || !data?.companyWebsite)
      return setError("All Fields Required!");
    setShowModal(true);
  }

  const confirmSubmit = async () => {
    const url = companyId
      ? `${BASE_URL}/company/update-company?companyId=${companyId}`
      : `${BASE_URL}/company/add-company`;
    try {
      const response = await axios.post(url, data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      if (response?.status === 201) {
        setShowModal(false);
        setToastMessage(response?.data?.msg);
        const dataToPass = {
          showToastPass: true,
          toastMessagePass: response?.data?.msg
        }
        navigate('../tpo/companys', { state: dataToPass });
      }
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
      setShowModal(false);
      setToastMessage(error?.response?.data?.msg);
      setShowToast(true);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${companyId}`);
      setData(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (companyId) fetchCompanyData() }, [companyId])


  useEffect(() => {
    if (!companyId) setLoading(false);
  }, [])


  const handleDataChange = (e) => {
    setError('');
    setData({ ...data, [e.target.name]: e.target.value })
  }


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
              <div className="max-w-3xl mx-auto">
                <Form onSubmit={handleSubmit}>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-2 shadow-lg bounce-icon">
                        <i className="fa-solid fa-building text-white text-lg"></i>
                      </div>
                      <h2 className="text-3xl font-bold gradient-text">
                        {companyId ? 'Update Company' : 'Add Company'}
                      </h2>
                    </div>
                  </div>

                  {/* Form Card */}
                  <GlassCard hoverable={false} glow={true} className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FloatingLabel controlId="floatingCompanyName" label={
                          <>
                            <span>Company Name <span className='text-red-500'>*</span></span>
                          </>
                        }>
                          <Form.Control
                            type="text"
                            placeholder="Company Name"
                            name='companyName'
                            value={data?.companyName || ''}
                            onChange={handleDataChange}
                          />
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingCompanyLocation" label={
                          <>
                            <span>Company Location <span className='text-red-500'>*</span></span>
                          </>
                        }>
                          <Form.Control
                            type="text"
                            placeholder="Company Location"
                            name='companyLocation'
                            value={data?.companyLocation || ''}
                            onChange={handleDataChange}
                          />
                        </FloatingLabel>
                      </div>
                      <FloatingLabel controlId="floatingCompanyWebsite" label={
                        <>
                          <span>Company Website <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          type="url"
                          placeholder="Company Website"
                          name='companyWebsite'
                          value={data?.companyWebsite || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingSelectDifficulty" label={
                        <>
                          <span>Difficulty Level <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Select
                          aria-label="Floating label select difficulty"
                          className='cursor-pointer'
                          name='companyDifficulty'
                          value={data?.companyDifficulty || ''}
                          onChange={handleDataChange}
                        >
                          <option disabled value='' className='text-gray-400'>Enter Difficulty Level</option>
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Hard">Hard</option>
                        </Form.Select>
                      </FloatingLabel>
                      <FloatingLabel controlId="floatingcompanyDescription" label={
                        <>
                          <span>Company Description <span className='text-red-500'>*</span></span>
                        </>
                      }>
                        <Form.Control
                          as="textarea"
                          placeholder="Company Description"
                          name='companyDescription'
                          style={{ height: '120px', maxHeight: "450px" }}
                          value={data?.companyDescription || ''}
                          onChange={handleDataChange}
                        />
                      </FloatingLabel>
                      {
                        error &&
                        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <i className="fa-solid fa-exclamation-circle text-red-500"></i>
                          <span className='text-red-500 font-medium'>{error}</span>
                        </div>
                      }
                    </div>
                  </GlassCard>

                  {/* Submit Button */}
                  <div className="flex justify-center mt-6">
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
                      <i className={`fa-solid ${companyId ? 'fa-save' : 'fa-plus'} mr-2`}></i>
                      {companyId ? 'Update Company' : 'Add Company'}
                    </Button>
                  </div>
                </Form>
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
        body={`Do you want to add company ${data?.companyName}?`}
        btn={"Post"}
        confirmAction={confirmSubmit}
      />
    </>
  )
}
export default AddCompany
