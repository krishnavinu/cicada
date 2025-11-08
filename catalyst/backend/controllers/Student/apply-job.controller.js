const User = require("../../models/user.model");
const jobSchema = require("../../models/job.model");
const Company = require("../../models/company.model");
const { sendSimpleEmail } = require("../../utils/emailHelper");


const AppliedToJob = async (req, res) => {
  try {
    // console.log(req.params);
    // if studentId is not defined return
    if (req.params.studentId === "undefined") return;
    if (req.params.jobId === "undefined") return;

    const user = await User.findById(req.params.studentId);
    const job = await jobSchema.findById(req.params.jobId).populate('company');

    // retune if already applied
    if (user?.studentProfile?.appliedJobs?.some(job => job.jobId == req.params.jobId)) return res.json({ msg: "Already Applied!" });

    if (!user?.studentProfile?.resume) return res.json({ msg: 'Please Upload Resume First, Under "Placements" > "Placement Profile"' });

    user?.studentProfile?.appliedJobs?.push({ jobId: req.params.jobId, status: "applied" });
    job?.applicants?.push({ studentId: user._id });
    await user.save();
    await job.save();

    // Send automated email notification
    try {
      const studentName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Student';
      const companyName = job.company?.companyName || 'Company';
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
            <h2>Application Confirmation</h2>
          </div>
          <div style="padding: 30px; background-color: #f9fafb;">
            <p>Dear ${studentName},</p>
            <p>Your application for the position of <strong>${job.jobTitle}</strong> at <strong>${companyName}</strong> has been received successfully.</p>
            <p>We will review your application and get back to you soon.</p>
            <p>Thank you for your interest!</p>
            <p style="margin-top: 30px;">Best regards,<br>catalyst Team</p>
          </div>
        </div>
      `;
      await sendSimpleEmail(user.email, `Application Confirmation - ${job.jobTitle}`, html);
    } catch (emailError) {
      console.log("Error sending application email:", emailError);
      // Don't fail the application if email fails
    }

    return res.status(201).json({ msg: "Applied Successfully!" });
  } catch (error) {
    console.log("apply-job.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

const CheckAlreadyApplied = async (req, res) => {
  try {
    // if studentId is not defined return
    if (req.params.studentId === "undefined") return;
    if (req.params.jobId === "undefined") return;

    const user = await User.findById(req.params.studentId);

    // retune if already applied
    if (user?.studentProfile?.appliedJobs?.some(job => job.jobId == req.params.jobId)) return res.json({ applied: true });
    else return res.json({ applied: false });

  } catch (error) {
    console.log("apply-job.controller.js => ", error);
    return res.status(500).json({ msg: "Internal Server Error!" });
  }
}

module.exports = {
  AppliedToJob,
  CheckAlreadyApplied
};