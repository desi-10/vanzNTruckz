import nodemailer from "nodemailer";

const createTransportoptions = {
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

export async function sendOtpViaEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport(createTransportoptions);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  });
}
