import loginDocs from "@/docs/auth/login";
import registerDocs from "@/docs/auth/register";
import forgotPasswordDocs from "@/docs/auth/reset-password";
import otpDocs from "@/docs/auth/otp-generation";
import { createSwaggerSpec } from "next-swagger-doc";
import refreshTokenDocs from "@/docs/auth/refresh-token";
import kycDocs from "@/docs/kyc";
import kycStatusDocs from "@/docs/kyc-status";
import ordersGetDocs from "@/docs/get-orders";
import ordersPostDocs from "@/docs/create-order";
import getUserDocs from "@/docs/get-user";
import updateUserDocs from "@/docs/update-user";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "./src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "VanzNTruckz API",
        description: "VanzNTruckz API Documentation",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
      paths: {
        ...loginDocs,
        ...registerDocs,
        ...otpDocs,
        ...forgotPasswordDocs,
        ...refreshTokenDocs,
        ...kycDocs,
        ...kycStatusDocs,
        ...ordersPostDocs,
        ...ordersGetDocs,
        ...getUserDocs,
        ...updateUserDocs,
      },
    },
  });
  return spec;
};
