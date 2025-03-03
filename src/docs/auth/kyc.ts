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
        required: true,
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
                  description: "Picture of the car",
                },
                phoneNumber: {
                  type: "string",
                  example: "+233123456789",
                  description: "Driver's phone number",
                },
                vehicleType: {
                  type: "string",
                  example: "SUV",
                  description: "Type of vehicle",
                },
                numberPlate: {
                  type: "string",
                  example: "GR-1234-23",
                  description: "Vehicle number plate",
                },
                numberPlatePicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the number plate",
                },
                license: {
                  type: "string",
                  example: "DL123456789",
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
                  example: "2025-12-31",
                  description: "Expiry date of the driver's license",
                },
                roadworthySticker: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the roadworthy sticker",
                },
                roadworthyExpiry: {
                  type: "string",
                  format: "date",
                  example: "2025-06-30",
                  description: "Expiry date of the roadworthy sticker",
                },
                insuranceSticker: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the insurance sticker",
                },
                insurance: {
                  type: "string",
                  example: "Insurance Company Name",
                  description: "Name of the insurance company",
                },
                ghanaCard: {
                  type: "string",
                  example: "GHA123456789",
                  description: "Ghana Card number (optional)",
                },
                ghanaCardPicture: {
                  type: "string",
                  format: "binary",
                  description: "Picture of the Ghana Card (optional)",
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
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
        },
        409: {
          description: "Conflict - License or Number Plate already in use",
        },
        500: {
          description: "Internal Server Error",
        },
      },
    },
  },
};

export default kycDocs;
