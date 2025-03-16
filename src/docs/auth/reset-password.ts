import { OpenAPIV3 } from "openapi-types";

const forgotPasswordDocs: OpenAPIV3.PathsObject = {
  "/api/auth/mobile/forgot-password": {
    post: {
      summary: "Forgot Password",
      description:
        "Allows users to reset their password by verifying a one-time password (OTP) sent to their email or phone number.",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["identifier", "otp", "password"],
              properties: {
                identifier: {
                  type: "string",
                  description: "Email address or phone number of the user",
                  example: `"user@example.com" || "0551234567"`,
                },
                otp: {
                  type: "string",
                  description:
                    "4-digit OTP code sent to the user's email or phone",
                  example: "1234",
                },
                password: {
                  type: "string",
                  description: "New password with a minimum of 6 characters",
                  example: "NewPassword123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password reset successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Password reset successfully.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid input format or missing required fields",
        },
        401: {
          description: "Invalid OTP or OTP expired",
        },
        404: {
          description: "User not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};

export default forgotPasswordDocs;
