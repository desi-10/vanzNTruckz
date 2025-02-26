const registerDocs = {
  "/api/auth/register": {
    post: {
      summary: "User Registration",
      description: "Registers a new user and sends a verification email.",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: {
                  type: "string",
                  example: "John Doe",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "password123",
                },
              },
              required: ["name", "email", "password"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "User successfully registered",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example:
                      "User registered successfully. Please verify your email.",
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid request data or user already exists",
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
                  error: { type: "string", example: "Internal Server Error" },
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
