const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const Company = require("../../models/company.model");
const { sendSimpleEmail } = require("../../utils/emailHelper");


const UpdateJobStatus = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId).populate('company');
    const student = await User.findById(req.params.studentId);

    if (!job || !student) return res.json({ msg: "Student or Job Not Found!" });

    let previousStatus = null;
    let newStatus = null;

    job.applicants.find(app => {
      if (app.studentId == req.params.studentId) {
        previousStatus = app.status;
        if (req.body.applicant.currentRound) app.currentRound = req.body.applicant.currentRound;
        if (req.body.applicant.roundStatus) app.roundStatus = req.body.applicant.roundStatus;
        if (req.body.applicant.selectionDate) app.selectionDate = req.body.applicant.selectionDate;
        if (req.body.applicant.joiningDate) app.joiningDate = req.body.applicant.joiningDate;
        if (req.body.applicant.offerLetter) app.offerLetter = req.body.applicant.offerLetter;
        if (req.body.applicant.status) {
          app.status = req.body.applicant.status;
          newStatus = req.body.applicant.status;
        }
      }
    });

    student?.studentProfile?.appliedJobs?.find(app => {
      if (app.jobId == req.params.jobId) {
        if (req.body.applicant.status) app.status = req.body.applicant.status;
        if (req.body.applicant.package) app.package = req.body.applicant.package;
      }
    });

    await student.save();
    await job.save();

    // Send automated email notification based on status change
    if (newStatus && newStatus !== previousStatus) {
      try {
        const studentName = `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';
        const companyName = job.company?.companyName || 'Company';
        let subject = '';
        let html = '';

        if (newStatus === 'interview') {
          subject = `Interview Invitation - ${job.jobTitle} at ${companyName}`;
          const interviewDate = job.applicants.find(a => a.studentId.toString() === req.params.studentId)?.selectionDate || 'TBD';
          html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
                <h2>Interview Invitation</h2>
              </div>
              <div style="padding: 30px; background-color: #f9fafb;">
                <p>Dear ${studentName},</p>
                <p>Congratulations! You have been shortlisted for an interview for the position of <strong>${job.jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                <p><strong>Interview Date:</strong> ${new Date(interviewDate).toLocaleDateString()}</p>
                <p>Please prepare accordingly and be on time. We look forward to meeting you!</p>
                <p style="margin-top: 30px;">Best regards,<br>catalyst Team</p>
              </div>
            </div>
          `;
        } else if (newStatus === 'hired') {
          subject = `Congratulations! Job Offer - ${job.jobTitle} at ${companyName}`;
          const packageAmount = student.studentProfile?.appliedJobs?.find(a => a.jobId?.toString() === req.params.jobId)?.package || job.salary || 'TBD';
          html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                <h2>🎉 Congratulations!</h2>
              </div>
              <div style="padding: 30px; background-color: #f9fafb;">
                <p>Dear ${studentName},</p>
                <p>We are delighted to inform you that you have been selected for the position of <strong>${job.jobTitle}</strong> at <strong>${companyName}</strong>!</p>
                <p><strong>Package:</strong> ${packageAmount} LPA</p>
                <p>This is a great achievement! Please check your dashboard for further details and next steps.</p>
                <p style="margin-top: 30px;">Best regards,<br>catalyst Team</p>
              </div>
            </div>
          `;
        } else if (newStatus === 'rejected') {
          subject = `Application Update - ${job.jobTitle} at ${companyName}`;
          html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #6b7280; color: white; padding: 20px; text-align: center;">
                <h2>Application Update</h2>
              </div>
              <div style="padding: 30px; background-color: #f9fafb;">
                <p>Dear ${studentName},</p>
                <p>Thank you for your interest in the position of <strong>${job.jobTitle}</strong> at <strong>${companyName}</strong>.</p>
                <p>After careful consideration, we have decided to move forward with other candidates at this time.</p>
                <p>We encourage you to continue applying for other opportunities. Best of luck with your job search!</p>
                <p style="margin-top: 30px;">Best regards,<br>catalyst Team</p>
              </div>
            </div>
          `;
        }

        if (subject && html) {
          await sendSimpleEmail(student.email, subject, html);
        }
      } catch (emailError) {
        console.log("Error sending status update email:", emailError);
        // Don't fail the update if email fails
      }
    }

    return res.json({ msg: "Job Status Updated Successfully!" });
  } catch (error) {
    console.log("update-job-status.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}


module.exports = {
  UpdateJobStatus
};