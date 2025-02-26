const registerDocs = {
  "/api/auth/mobile/register": {
    post: {
      summary: "User Registration",
      description:
        "Registers a new user using either an email or phone number after verifying an OTP. The password is securely stored.",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["identifier", "password", "name", "otp"],
              properties: {
                identifier: {
                  type: "string",
                  description: "User email or phone number",
                  example: "user@example.com",
                },
                password: {
                  type: "string",
                  description: "User password (minimum 6 characters)",
                  example: "securePassword123",
                },
                name: {
                  type: "string",
                  description: "Full name of the user",
                  example: "John Doe",
                },
                otp: {
                  type: "string",
                  description: "4-digit OTP received by the user",
                  example: "1234",
                },
              },
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User registered successfully.",
                  },
                  user: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "cl0mb1kzp0001r8mhz7f6xyz",
                      },
                      name: {
                        type: "string",
                        example: "John Doe",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid input format",
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
        "401": {
          description: "Invalid OTP",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Invalid OTP or OTP expired",
                  },
                },
              },
            },
          },
        },
        "409": {
          description: "User already exists",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "User already exists",
                  },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Something went wrong. Please try again.",
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

export default registerDocs;
