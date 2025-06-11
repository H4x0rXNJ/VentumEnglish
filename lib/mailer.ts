import nodemailer from "nodemailer";

const baseUrl = process.env.PUBLIC_BASE_URL;
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const baseStyle = `
  font-family: Arial, sans-serif;
  color: #333;
  max-width: 400px;
  padding: 20px;
  text-align: left;
  margin: 0;
`;

const headingStyle = `
  font-size: 1.55rem;
  line-height: 1.75rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
`;

const paragraphStyle = `
  margin: 16px 0 1.5rem 0;
  font-size: 14px;
  line-height: 24px;
  color: #666666;
  font-weight: 300;
`;

const buttonStyle = `
  display: inline-block;
  border-radius: 0.75rem;
  background-color: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  text-align: center;
  padding: 10px 40px;
  text-decoration: none;
  max-width: 200px;
  width: 100%;
  margin: 0 0 0.5rem 0;
`;

export function sendResetPasswordEmail(to: string, token: string) {
  const resetLink = `${baseUrl}/reset-password/${token}`;
  const htmlContent = `
    <div style="${baseStyle}">
      <h3 style="${headingStyle}">Change your Password</h3>
      <p style="${paragraphStyle}">
       We received a request to change your password. Click the button below to change your password. If you didn’t ask to change your password, you can ignore this email.
      </p>
      <a href="${resetLink}" style="${buttonStyle}">Change password →</a>
      <p style="${paragraphStyle}">
        Visit our <a href="${baseUrl}" style="text-decoration: underline; color: #2563eb;">help center</a> if you need assistance.
      </p>
      <p style="margin-bottom: 1.5rem;">
        Best, <br/> VenTum
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
      <p style="font-size: 12px; color: #777; margin: 0; line-height: 1.4;">
        © 2025 VenTum Inc.<br/>
        Trung Kinh #2484 Cau Giay, HN 10016
      </p>
    </div>
  `;

  const mailOptions = {
    from: '"VenTum" <no-reply@ventum.com>',
    to,
    subject: "Reset your password for VenTum",
    html: htmlContent,
  };
  transporter.sendMail(mailOptions).catch((err) => {
    console.error("Failed to send reset password email:", err);
  });
}

export function sendVerificationEmail(to: string, code: string) {
  const verifyLink = `${baseUrl}/api/verify-email?code=${code}`;
  const htmlContent = `
      <div style="${baseStyle}">
        <h3 style="${headingStyle}">Verify your Email</h3>
        <p style="${paragraphStyle}">
          Please click the button below to verify your email address. If you didn’t request this, please ignore this email.
        </p>
        <a href="${verifyLink}" style="${buttonStyle}">Verify email →</a>
        <p style="${paragraphStyle}">
          Visit our <a href="${baseUrl}" style="text-decoration: underline; color: black;">help center</a> to learn more about our platform and to share your feedback.
        </p>
        <p style="margin-bottom: 1.5rem;">
          Best, <br/> VenTum
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;" />
        <p style="font-size: 12px; color: #777; margin: 0; line-height: 1.4;">
          © 2025 VenTum Inc.<br/>
          Trung Kinh #2484 Cau Giay, HN 10016
        </p>
      </div>
    `;
  const mailOptions = {
    from: '"VenTum" <no-reply@ventum.com>',
    to,
    subject: "Verify your email for VenTum",
    html: htmlContent,
  };
  transporter.sendMail(mailOptions).catch((err) => {
    console.error("Failed to send verify email:", err);
  });
}
