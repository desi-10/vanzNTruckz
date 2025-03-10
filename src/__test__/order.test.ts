import { prisma } from "@/lib/db";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

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

describe("Order API", () => {
  let accessToken: string;

  it("should return a token", async () => {
    const { data, status } = await axios.post(url + "/api/auth/mobile/login", {
      identifier: "admin@vansntracks.com",
      password: "admin123",
    });

    accessToken = data.data.accessToken;
    expect(data.data.role).toBe("CUSTOMER");
    expect(status).toBe(200);
    expect(data.data.accessToken).toBeDefined();
    expect(data.data.refreshToken).toBeDefined();
  });

  it("should create an order", async () => {
    const formData = new FormData();
    // const dummyFile = new Blob([""], { type: "image/jpeg" });
    const base64Image = await fetch("https://picsum.photos/200/300").then(
      (res) => res.blob()
    );

    const dummyFile = new File([base64Image], "dummy.jpg", {
      type: "image/jpeg",
    });

    formData.append("pickUp", "123 Main Street");
    formData.append("dropOff", "456 Main Street");
    formData.append("vehicleType", "Sedan");
    formData.append("parcelType", "Box");
    formData.append("pieces", "2");
    formData.append("image", dummyFile);
    formData.append("recepientName", "John Doe");
    formData.append("recepientNumber", "123456789");
    formData.append("additionalInfo", "Additional Info");
    formData.append("BaseCharges", "100.12");
    formData.append("distanceCharges", "200.20");
    formData.append("timeCharges", "300");
    formData.append("AdditionalCharges", "400");
    formData.append("totalEstimatedFare", "500");

    const { data, status } = await axios.post(
      url + "/api/v1/orders",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    expect(status).toBe(200);
    expect(data.message).toBe("Order created successfully");
    expect(data.data.pickUp).toBe("123 Main Street");
  });

  it("should return the orders", async () => {
    const { data, status } = await axios.get(url + "/api/v1/orders", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    expect(status).toBe(200);
    expect(data.message).toBe("Orders retrieved successfully");
    expect(data.data.length).toBeGreaterThan(0);
  });
});
