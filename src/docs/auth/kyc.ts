const kycDocs = {
  "/api/v1/kyc": {
    patch: {
      summary: "Driver KYC Update",
      description:
        "Allows authenticated drivers to update their KYC (Know Your Customer) information, including profile picture, car picture, license, and other required documents.",
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
                numberPlate: {
                  type: "string",
                  description: "Car number plate",
                },
                license: {
                  type: "string",
                  description: "Driver's license number",
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
                roadworthyExpiry: {
                  type: "string",
                  format: "date",
                  description: "Roadworthy sticker expiry date (YYYY-MM-DD)",
                },
                insuranceSticker: {
                  type: "string",
                  description: "Insurance sticker number",
                },
                ghanaCard: {
                  type: "string",
                  description: "Ghana card number (optional)",
                },
              },
              required: [
                "profilePicture",
                "carPicture",
                "numberPlate",
                "license",
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
                    example: "KYC updated successfully",
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
