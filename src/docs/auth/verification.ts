const otpDocs = {
  "/api/auth/mobile/verification": {
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
                  description:
                    "User's email or phone number. Must be a valid email or a phone number with 10-15 digits.",
                  example: "user@example.com",
                },
              },
              required: ["identifier"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP sent successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "OTP sent successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid input format or identifier",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Please enter a valid email or phone number",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Internal server error",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default otpDocs;
