const ordersPostDocs = {
  "/api/v1/orders": {
    post: {
      summary: "Create a New Order",
      description:
        "Allows a customer or admin to create a new order by providing required details.",
      tags: ["Orders", "Customer", "Admin"],
      security: [{ BearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                pickUp: { type: "string", example: "123 Street, City" },
                dropOff: { type: "string", example: "456 Avenue, City" },
                vehicleType: { type: "string", example: "Bike" },
                parcelType: { type: "string", example: "Documents" },
                pieces: { type: "integer", example: 2 },
                image: { type: "string", format: "binary" },
                recepientName: { type: "string", example: "Jane Doe" },
                recepientNumber: { type: "string", example: "+233123456789" },
                additionalInfo: { type: "string", example: "Handle with care" },
                BaseCharges: { type: "number", example: 5.0 },
                distanceCharges: { type: "number", example: 10.0 },
                timeCharges: { type: "number", example: 2.5 },
                AdditionalCharges: { type: "number", example: 1.5 },
                totalEstimatedFare: { type: "number", example: 19.0 },
                coupon: { type: "string", example: "DISCOUNT10" },
              },
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Order created successfully",
          content: {
            "application/json": {
              example: {
                message: "Order created successfully",
                data: {
                  id: "order123",
                  pickUp: "123 Street, City",
                  dropOff: "456 Avenue, City",
                  status: "PENDING",
                  totalEstimatedFare: 19.0,
                },
              },
            },
          },
        },
        "400": { description: "Invalid request data" },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal Server Error" },
      },
    },
  },
};

export default ordersPostDocs;
