export async function sendOtpViaSms(phone: string, otp: string) {
  try {
    console.log("Sending OTP via SMS to:", phone);
    console.log("OTP:", otp);
  } catch (error) {
    console.error("Failed to send OTP via SMS", error);
    throw new Error("Failed to send OTP via SMS");
  }
}
