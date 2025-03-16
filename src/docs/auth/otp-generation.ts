import { OpenAPIV3 } from "openapi-types";

export const otpDocs: OpenAPIV3.PathsObject = {
  "/api/auth/mobile/otp-generation": {
    post: {
      summary: "Generate OTP",
      description:
        "Generates and sends an OTP to a given email or phone number for authentication.",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                identifier: {
                  type: "string",
                  description: "The email or phone number to receive the OTP.",
                  example: "user@example.com or 1234567890",
                },
                route: {
                  type: "string",
                  description:
                    "Optional route to specify purpose (e.g., 'reset-password').",
                  example: "reset-password",
                },
              },
              required: ["identifier"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "OTP sent successfully.",
        },
        "400": {
          description: "Invalid input format.",
        },
        "404": {
          description: "User not found.",
        },
        "500": {
          description: "Internal server error.",
        },
      },
    },
  },
};

export default otpDocs;
