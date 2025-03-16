import { OpenAPIV3 } from "openapi-types";

const kycStatusDocs: OpenAPIV3.PathsObject = {
  "/api/v1/drivers/kyc/status/": {
    get: {
      summary: "Retrieve Driver KYC Status",
      description:
        "Fetches the KYC (Know Your Customer) status of an authenticated driver, including profile picture, car picture, license details, and other required documents.",
      tags: ["Driver"],
      security: [{ BearerAuth: [] }],
      responses: {
        "200": {
          description: "KYC status retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "KYC status retrieved successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      profilePicture: { type: "boolean", example: true },
                      carPicture: { type: "boolean", example: false },
                      phoneNumber: { type: "boolean", example: true },
                      vehicleType: { type: "boolean", example: true },
                      numberPlate: { type: "boolean", example: true },
                      numberPlatePicture: { type: "boolean", example: false },
                      license: { type: "boolean", example: true },
                      licensePicture: { type: "boolean", example: true },
                      licenseExpiry: { type: "boolean", example: true },
                      roadworthySticker: { type: "boolean", example: true },
                      roadworthyExpiry: { type: "boolean", example: false },
                      insuranceSticker: { type: "boolean", example: true },
                      insurance: { type: "boolean", example: true },
                      ghanaCard: { type: "boolean", example: true },
                      ghanaCardPicture: { type: "boolean", example: false },
                    },
                  },
                },
              },
            },
          },
        },
        "401": {
          description: "Unauthorized - Invalid or missing token",
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
        "500": {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: { type: "string", example: "Something went wrong" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default kycStatusDocs;
