import { OpenAPIV3 } from "openapi-types";

const kycDocs: OpenAPIV3.PathsObject = {
  "/api/v1/drivers/kyc": {
    patch: {
      summary: "Driver KYC Update",
      description:
        "Allows authenticated drivers to update their KYC (Know Your Customer) information, including profile picture, car picture, license, number plate, and other required documents.",
      tags: ["Driver"],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profilePicture: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                carPicture: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                phoneNumber: {
                  type: "string",
                  example: "0551234567",
                  nullable: true,
                },
                vehicleType: {
                  type: "string",
                  example: "Sedan",
                  nullable: true,
                },
                numberPlate: {
                  type: "string",
                  example: "GR-1234-22",
                  nullable: true,
                },
                numberPlatePicture: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                license: {
                  type: "string",
                  example: "D12345678",
                  nullable: true,
                },
                licensePicture: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                licenseExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-06-30",
                  nullable: true,
                },
                roadworthySticker: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                roadworthyExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-12-31",
                  nullable: true,
                },
                insuranceSticker: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
                insurance: {
                  type: "string",
                  example: "Allianz",
                  nullable: true,
                },
                ghanaCard: {
                  type: "string",
                  example: "GHA-1234567890",
                  nullable: true,
                },
                ghanaCardPicture: {
                  type: "string",
                  format: "binary",
                  nullable: true,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Driver updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Driver updated successfully",
                  },
                  data: {
                    type: "object",
                    properties: {
                      userId: { type: "string", example: "abc123" },
                      profilePicture: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/profile.jpg",
                        },
                      },
                      carPicture: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/car.jpg",
                        },
                      },
                      licensePicture: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/license.jpg",
                        },
                      },
                      numberPlatePicture: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/number_plate.jpg",
                        },
                      },
                      ghanaCardPicture: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/ghana_card.jpg",
                        },
                      },
                      roadworthySticker: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/roadworthy.jpg",
                        },
                      },
                      insuranceSticker: {
                        type: "object",
                        format: "uri",
                        example: {
                          id: "cl8jkwz8e0001z2k3h9q",
                          url: "https://example.com/uploads/insurance.jpg",
                        },
                      },
                      phoneNumber: { type: "string", example: "0551234567" },
                      vehicleType: { type: "string", example: "Sedan" },
                      numberPlate: { type: "string", example: "GR-1234-22" },
                      license: { type: "string", example: "D123456789" },
                      licenseExpiry: { type: "string", example: "2025-06-30" },
                      roadworthyNumber: {
                        type: "string",
                        example: "GR-1234-22",
                      },
                      roadworthyExpiry: {
                        type: "string",
                        example: "2025-12-31",
                      },
                      insurance: { type: "string", example: "Allianz" },
                      insuranceExpiry: {
                        type: "string",
                        example: "2025-12-31",
                      },
                      ghanaCard: { type: "string", example: "GHA-1234567890" },
                      updatedAt: {
                        type: "string",
                        format: "date-time",
                        example: "2025-03-08T12:00:00Z",
                      },
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid data",
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
        401: {
          description: "Unauthorized",
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
        409: {
          description: "Conflict - Duplicate data",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Phone number already in use",
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

export default kycDocs;
