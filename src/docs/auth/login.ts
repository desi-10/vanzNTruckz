const loginDocs = {
  "/api/auth/login": {
    post: {
      summary: "User Login",
      description: "Authenticates a user using email and password.",
      tags: ["Authentication"], // Corrected from "tag" to "tags" (array)
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
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
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Successful authentication",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  data: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "user123" },
                      name: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "user@example.com" },
                      accessToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1...",
                      },
                      refreshToken: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1...",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid request or authentication failure",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Invalid email or password",
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

export default loginDocs;
