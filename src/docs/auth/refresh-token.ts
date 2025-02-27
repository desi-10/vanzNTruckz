const refreshTokenDocs = {
  "/api/auth/refresh-token": {
    post: {
      summary: "Refresh Access Token",
      description:
        "Generates a new access token using a valid refresh token. The refresh token is validated and decoded before generating a new access token.",
      tags: ["Authentication"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "The valid refresh token obtained during login",
                  example: "your_refresh_token_here",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "New access token generated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    description: "The newly generated access token",
                    example: "your_new_access_token_here",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    description: "Validation error message",
                    example: "Invalid refresh token",
                  },
                  errors: {
                    type: "object",
                    description: "Detailed validation errors",
                    example: {
                      refreshToken: {
                        _errors: ["Refresh token is required"],
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Invalid or expired refresh token",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Invalid or expired refresh token",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
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

export default refreshTokenDocs;
