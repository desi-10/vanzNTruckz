const registerDocs = {
  "/api/auth/mobile/register": {
    post: {
      summary: "User Registration",
      description:
        "Registers a new user using either an email or phone number and securely stores their password.",
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
                password: {
                  type: "string",
                  description:
                    "User's password. Must be at least 6 characters long.",
                  example: "password123",
                },
                name: {
                  type: "string",
                  description: "User's full name. Minimum 2 characters.",
                  example: "John Doe",
                },
              },
              required: ["identifier", "password", "name"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "User registered successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User registered successfully",
                  },
                  user: {
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
                    },
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
        409: {
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

export default registerDocs;
