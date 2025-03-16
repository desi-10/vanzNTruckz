const getUserDocs = {
  "/api/v1/users/:id": {
    get: {
      summary: "Get User Details",
      description:
        "Retrieves the authenticated user's details using session-based authentication for web or JWT for mobile.",
      tags: ["User"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "User retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "user_123" },
                      name: { type: "string", example: "John Doe" },
                      email: { type: "string", example: "john@example.com" },
                      image: {
                        type: "string",
                        example: "https://example.com/profile.jpg",
                      },
                      role: { type: "string", example: "USER" },
                      driverProfile: {
                        type: "object",
                        nullable: true,
                        properties: {
                          licenseNumber: {
                            type: "string",
                            example: "D12345678",
                          },
                          vehicleType: { type: "string", example: "Sedan" },
                        },
                      },
                    },
                  },
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

export default getUserDocs;
