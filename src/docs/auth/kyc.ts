const kycDocs = {
  "/api/v1/kyc": {
    patch: {
      summary: "Driver KYC Update",
      description:
        "Allows authenticated drivers to update their KYC (Know Your Customer) information, including profile picture, car picture, license, number plate, and other required documents.",
      tags: ["KYC"],
      security: [
        {
          BearerAuth: [],
        },
      ],
      requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                profilePicture: {
                  type: "string",
                  format: "binary",
                  description: "Driver's profile picture",
                },
                carPicture: {
                  type: "string",
                  format: "binary",
                  description: "Car picture",
                },
                phoneNumber: {
                  type: "string",
                  description: "Driver's phone number",
                },
                vehicleType: {
                  type: "string",
                  description: "Type of vehicle (e.g., Sedan, SUV)",
                },
                numberPlate: {
                  type: "string",
                  description: "Car number plate",
                },
                numberPlatePicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the car's number plate",
                },
                license: {
                  type: "string",
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
                  description: "Driver's license expiry date (YYYY-MM-DD)",
                },
                roadworthySticker: {
                  type: "string",
                  description: "Roadworthy sticker number",
                },
                roadworthyStickerPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the roadworthy sticker",
                },
                roadworthyExpiry: {
                  type: "string",
                  format: "date",
                  description: "Roadworthy sticker expiry date (YYYY-MM-DD)",
                },
                insuranceSticker: {
                  type: "string",
                  description: "Insurance sticker number",
                },
                insuranceStickerPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the insurance sticker",
                },
                ghanaCard: {
                  type: "string",
                  description: "Ghana card number (optional)",
                },
                ghanaCardPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of Ghana Card (optional)",
                },
              },
              required: [
                "profilePicture",
                "carPicture",
                "phoneNumber",
                "vehicleType",
                "numberPlate",
                "numberPlatePicture",
                "license",
                "licensePicture",
                "licenseExpiry",
                "roadworthySticker",
                "roadworthyExpiry",
                "insuranceSticker",
              ],
            },
          },
        },
      },
      responses: {
        200: {
          description: "KYC updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Driver updated successfully",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid data or image upload failed",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "Invalid profile picture",
                  },
                  errors: {
                    type: "object",
                    example: {
                      profilePicture: { _errors: ["Invalid profile picture"] },
                    },
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
          description: "License or Number Plate already in use",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  error: {
                    type: "string",
                    example: "License already in use",
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
