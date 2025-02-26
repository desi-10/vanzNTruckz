const loginDocs = {
  "/api/auth/mobile/login": {
    post: {
      summary: "User Login",
      description:
        "Authenticates a user using either an email or phone number and returns a JWT token upon successful login.",
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
                    "User's email or phone number. Must be a valid email or phone number with 10-15 digits.",
                  example: "user@example.com",
                },
                password: {
                  type: "string",
                  description: "User's password (minimum 6 characters).",
                  example: "password123",
                },
              },
              required: ["identifier", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Login successful",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: {
                        type: "string",
                        example: "cl8jkwz8e0001z2k3h9q",
                      },
                      name: {
                        type: "string",
                        example: "John Doe",
                      },
                      email: {
                        type: "string",
                        example: "user@example.com",
                      },
                      phone: {
                        type: "string",
                        example: "1234567890",
                      },
                      address: {
                        type: "string",
                        example: "123 Main Street",
                      },
                      role: {
                        type: "string",
                        example: "USER",
                      },
                      image: {
                        type: "string",
                        example: "https://example.com/user.jpg",
                      },
                      accessToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
                      },
                      refreshToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
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
        401: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Incorrect password",
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
                    example: "Something went wrong",
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

export default loginDocs;
