import { OpenAPIV3 } from "openapi-types";

const updateUserDocs: OpenAPIV3.PathsObject = {
  "/api/v1/users/:ID": {
    patch: {
      summary: "Update User Profile",
      description:
        "Updates the user's profile information, including name, phone, and profile image. The user must be authenticated via session (web) or JWT (mobile).",
      tags: ["User"],
      security: [
        { sessionAuth: [] }, // Web authentication
        { bearerAuth: [] }, // Mobile authentication (JWT)
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                identifier: {
                  type: "string",
                  description: "Email or phone number of the user.",
                },
                name: {
                  type: "string",
                  description: "Full name of the user.",
                },
                phone: {
                  type: "string",
                  description: "Phone number of the user.",
                },
                image: {
                  type: "string",
                  format: "binary",
                  description: "Profile image file upload.",
                },
              },
              required: ["identifier"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "User updated successfully.",
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
                      id: { type: "string", example: "user_cuid_12345" },
                      name: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "johndoe@example.com" },
                      phone: { type: "string", example: "+1234567890" },
                      image: {
                        type: "string",
                        example: "https://cdn.example.com/profile.jpg",
                      },
                      emailVerified: { type: "string", format: "date-time" },
                      phoneVerified: { type: "string", format: "date-time" },
                    },
                  },
                },
              },
            },
          },
        },
        "400": {
          description: "Invalid request data.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Invalid data" },
                  errors: { type: "object" },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized access.",
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
        "404": {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "User does not exist" },
                },
              },
            },
          },
        },
        "500": {
          description: "Internal server error.",
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

export default updateUserDocs;
