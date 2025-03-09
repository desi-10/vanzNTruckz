import { prisma } from "@/lib/db";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_URL || "http://localhost:3000/";

describe("Register API", () => {
  beforeAll(async () => {
    await prisma.user.deleteMany(); // Reset DB
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
      role: "CUSTOMER",
    });
    expect(status).toBe(201);
  });
});

describe("Login API", () => {
  it("should return a token", async () => {
    const { data, status } = await axios.post(url + "/api/auth/mobile/login", {
      identifier: "admin@vansntracks.com",
      password: "admin123",
    });

    expect(data.data.role).toBe("CUSTOMER");
    expect(status).toBe(200);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });
});

describe("Reset Password API", () => {
  beforeAll(async () => {
    await prisma.emailOTP.deleteMany();
    console.log("Database Reset");
  });

  let otp: string;

  it("should return an otp", async () => {
    const { data, status } = await axios.post(
      url + "/api/auth/mobile/otp-generation",
      {
        identifier: "admin@vansntracks.com",
      }
    );

    otp = data.otp;
    expect(status).toBe(200);
    expect(data.otp.length).toBe(4);
  });

  it("should reset password", async () => {
    const { status } = await axios.post(
      url + "/api/auth/mobile/forgot-password",
      {
        identifier: "admin@vansntracks.com",
        otp,
        password: "newpassword",
      }
    );

    expect(status).toBe(200);
  });

  it("should return a token", async () => {
    const { data, status } = await axios.post(url + "/api/auth/mobile/login", {
      identifier: "admin@vansntracks.com",
      password: "newpassword",
    });

    expect(data.data.role).toBe("CUSTOMER");
    expect(status).toBe(200);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });
});
