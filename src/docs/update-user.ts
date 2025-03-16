import { OpenAPIV3 } from "openapi-types";

const updateUser: OpenAPIV3.PathsObject = {
  "/api/v1/users/{id}": {
    patch: {
      summary: "Update User Profile",
      description:
        "Updates the authenticated user's profile details. If updating email or phone, an OTP is required.",
      tags: ["User"],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "newemail@example.com",
                },
                name: { type: "string", example: "John Doe" },
                phone: { type: "string", example: "+1234567890" },
                image: { type: "string", format: "binary" },
                otp: { type: "string", example: "123456" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User updated successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "user_123" },
                      name: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                      phone: { type: "string", example: "+1234567890" },
                      image: {
                        type: "string",
                        example: "https://example.com/profile.jpg",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad request (e.g., missing OTP for email/phone update)",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "OTP is required" },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized - User is not authenticated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Unauthorized" },
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "User not found" },
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

export default updateUser;
