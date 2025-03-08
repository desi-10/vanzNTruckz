import { prisma } from "@/lib/db";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";

describe("Register API", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Reset DB
    console.log("Database Reset");
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let otp: string;

  it("should generate an otp", async () => {
    const { data, status } = await axios.post(
      url + "/api/auth/mobile/otp-generation",
      { identifier: "admin@vansntracks.com" }
    );

    otp = data.otp;
    expect(status).toBe(200);
    expect(data.otp.length).toBe(4);
  });

  it("should register a user", async () => {
    const { status } = await axios.post(url + "/api/auth/mobile/register", {
      identifier: "admin@vansntracks.com",
      password: "admin123",
      name: "Admin",
      otp,
      role: "DRIVER",
    });
    expect(status).toBe(201);
  });
});

describe("Login API", () => {
  let accessToken: string;

  it("should return a token", async () => {
    const { data, status } = await axios.post(url + "/api/auth/mobile/login", {
      identifier: "admin@vansntracks.com",
      password: "admin123",
    });

    accessToken = data.data.accessToken;
    expect(data.data.role).toBe("DRIVER");
    expect(status).toBe(200);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });

  it("should update KYC", async () => {
    const formData = new FormData();
    const dummyFile = new File([""], "test.jpg", {
      type: "image/jpeg",
    });

    formData.append("profilePicture", dummyFile);
    formData.append("carPicture", dummyFile);
    formData.append("phoneNumber", "0541234567");
    formData.append("vehicleType", "Sedan");
    formData.append("numberPlate", "GT-1234-23");
    formData.append("numberPlatePicture", dummyFile);
    formData.append("license", "DL1234567");
    formData.append("licensePicture", dummyFile);
    formData.append("licenseExpiry", "2025-08-10");
    formData.append("roadworthySticker", dummyFile);
    formData.append("roadworthyExpiry", "2025-12-15");
    formData.append("insuranceSticker", dummyFile);
    formData.append("insurance", "INS-123456");
    formData.append("ghanaCard", "GHA-1234567890");
    formData.append("ghanaCardPicture", dummyFile);

    const { data, status } = await axios.patch(url + "/api/v1/kyc", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    expect(status).toBe(200);
    expect(data.message).toBe("Driver updated successfully");
    expect(data.data.licenseExpiry).toBeDefined();
  });
});
