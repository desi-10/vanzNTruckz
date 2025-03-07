const kycDocs = {
  "/api/v1/kyc": {
    patch: {
      summary: "Driver KYC Update",
      description:
        "Allows authenticated drivers to update their KYC (Know Your Customer) information, including profile picture, car picture, license, number plate, and other required documents.",
      tags: ["KYC"],
      security: [{ BearerAuth: [] }],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profilePicture: {
                  type: "string",
                  format: "binary",
                  description: "Profile picture of the driver",
                },
                carPicture: {
                  type: "string",
                  format: "binary",
                  description: "Car picture of the driver's vehicle",
                },
                phoneNumber: {
                  type: "string",
                  example: "0541234567",
                  description: "Driver's phone number (10 digits)",
                },
                vehicleType: {
                  type: "string",
                  example: "Sedan",
                  description: "Type of vehicle the driver uses",
                },
                numberPlate: {
                  type: "string",
                  example: "GT-1234-23",
                  description: "Vehicle number plate",
                },
                numberPlatePicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the number plate",
                },
                license: {
                  type: "string",
                  example: "DL1234567",
                  description: "Driver's license number",
                },
                licensePicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the driver's license",
                },
                licenseExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-08-10",
                  description: "Driver's license expiry date",
                },
                roadworthySticker: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the roadworthy sticker",
                },
                roadworthyExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-12-15",
                  description: "Roadworthy sticker expiry date",
                },
                insuranceSticker: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the insurance sticker",
                },
                insurance: {
                  type: "string",
                  example: "INS-123456",
                  description: "Insurance policy number",
                },
                ghanaCard: {
                  type: "string",
                  example: "GHA-1234567890",
                  description: "Driver's Ghana Card number",
                },
                ghanaCardPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the Ghana Card",
                },
                stickerNumber: {
                  type: "string",
                  example: "SN123456",
                  description: "Sticker number",
                },
                stickerPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the sticker",
                },
                stickerExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-11-20",
                  description: "Sticker expiry date",
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
                    description: "Updated driver information",
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
                  error: {
                    type: "string",
                    example: "Invalid data",
                  },
                  errors: {
                    type: "object",
                    description: "Validation errors",
                  },
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
                  error: {
                    type: "string",
                    example: "Unauthorized",
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Conflict",
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
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Internal Server Error",
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

export default kycDocs;
