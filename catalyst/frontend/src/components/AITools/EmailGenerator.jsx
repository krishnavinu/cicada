import { useState } from 'react';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function EmailGenerator() {
  const [emailType, setEmailType] = useState('notice');
  const [context, setContext] = useState({
    companyName: '',
    driveDate: '',
    venue: '',
    position: '',
    package: '',
    studentName: ''
  });
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleContextChange = (field, value) => {
    setContext(prev => ({ ...prev, [field]: value }));
  };

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/ai/email/generate`,
        {
          type: emailType,
          context
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setGeneratedEmail(response.data);
      setToastMessage('Email generated successfully!');
      setShowToast(true);
    } catch (error) {
      setToastMessage('Error generating email');
      setShowToast(true);
      console.error('Error generating email:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage('Copied to clipboard!');
    setShowToast(true);
  };

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">AI Email Generator</h2>

        <div className="grid grid-cols-2 gap-6">
          {/* Input Form */}
          <div>
            <FloatingLabel label="Email Type" className="mb-3">
              <Form.Select
                value={emailType}
                onChange={(e) => setEmailType(e.target.value)}
              >
                <option value="notice">Placement Drive Notice</option>
                <option value="interview">Interview Invitation</option>
                <option value="offer">Job Offer</option>
                <option value="rejection">Rejection Email</option>
              </Form.Select>
            </FloatingLabel>

            <div className="space-y-3">
              {emailType === 'notice' && (
                <>
                  <FloatingLabel label="Company Name">
                    <Form.Control
                      type="text"
                      value={context.companyName}
                      onChange={(e) => handleContextChange('companyName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Drive Date">
                    <Form.Control
                      type="datetime-local"
                      value={context.driveDate}
                      onChange={(e) => handleContextChange('driveDate', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Venue">
                    <Form.Control
                      type="text"
                      value={context.venue}
                      onChange={(e) => handleContextChange('venue', e.target.value)}
                    />
                  </FloatingLabel>
                </>
              )}

              {emailType === 'interview' && (
                <>
                  <FloatingLabel label="Company Name">
                    <Form.Control
                      type="text"
                      value={context.companyName}
                      onChange={(e) => handleContextChange('companyName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Position">
                    <Form.Control
                      type="text"
                      value={context.position}
                      onChange={(e) => handleContextChange('position', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Interview Date & Time">
                    <Form.Control
                      type="datetime-local"
                      value={context.driveDate}
                      onChange={(e) => handleContextChange('driveDate', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Venue">
                    <Form.Control
                      type="text"
                      value={context.venue}
                      onChange={(e) => handleContextChange('venue', e.target.value)}
                    />
                  </FloatingLabel>
                </>
              )}

              {emailType === 'offer' && (
                <>
                  <FloatingLabel label="Student Name">
                    <Form.Control
                      type="text"
                      value={context.studentName}
                      onChange={(e) => handleContextChange('studentName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Company Name">
                    <Form.Control
                      type="text"
                      value={context.companyName}
                      onChange={(e) => handleContextChange('companyName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Position">
                    <Form.Control
                      type="text"
                      value={context.position}
                      onChange={(e) => handleContextChange('position', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Package (LPA)">
                    <Form.Control
                      type="number"
                      value={context.package}
                      onChange={(e) => handleContextChange('package', e.target.value)}
                    />
                  </FloatingLabel>
                </>
              )}

              {emailType === 'rejection' && (
                <>
                  <FloatingLabel label="Student Name">
                    <Form.Control
                      type="text"
                      value={context.studentName}
                      onChange={(e) => handleContextChange('studentName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Company Name">
                    <Form.Control
                      type="text"
                      value={context.companyName}
                      onChange={(e) => handleContextChange('companyName', e.target.value)}
                    />
                  </FloatingLabel>
                  <FloatingLabel label="Position">
                    <Form.Control
                      type="text"
                      value={context.position}
                      onChange={(e) => handleContextChange('position', e.target.value)}
                    />
                  </FloatingLabel>
                </>
              )}
            </div>

            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={generateEmail}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Email'}
            </Button>
          </div>

          {/* Generated Email */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Generated Email</h3>
            {generatedEmail ? (
              <div className="border rounded p-4 bg-gray-50">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Subject:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border rounded"
                      value={generatedEmail.subject}
                      readOnly
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => copyToClipboard(generatedEmail.subject)}
                    >
                      <i className="fa-solid fa-copy"></i>
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body:</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded min-h-[400px]"
                    value={generatedEmail.body}
                    readOnly
                  />
                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={() => copyToClipboard(generatedEmail.body)}
                  >
                    <i className="fa-solid fa-copy mr-2"></i>Copy Body
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded p-8 bg-gray-50 text-center text-gray-500">
                Generated email will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailGenerator;

