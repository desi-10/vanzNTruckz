export function generateOtp() {
  return Math.floor(1000 + Math.random() * 900000).toString(); // Generates a 4-digit OTP
}
