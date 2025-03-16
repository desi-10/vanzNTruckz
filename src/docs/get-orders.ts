const ordersGetDocs = {
  "/api/v1/orders": {
    get: {
      summary: "Retrieve Paginated Orders",
      description:
        "Fetch a list of orders with pagination. This endpoint requires admin authentication.",
      tags: ["Orders"],
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          description: "Page number for pagination",
          required: false,
          schema: { type: "integer", default: 1 },
        },
        {
          name: "limit",
          in: "query",
          description: "Number of items per page",
          required: false,
          schema: { type: "integer", default: 50 },
        },
      ],
      responses: {
        "200": {
          description: "Orders retrieved successfully",
          content: {
            "application/json": {
              example: {
                message: "Orders retrieved successfully",
                data: [
                  {
                    id: "order123",
                    customer: { name: "John Doe", email: "john@example.com" },
                    driver: { name: "Driver Name" },
                    status: "PENDING",
                    totalEstimatedFare: 25.0,
                  },
                ],
                pagination: {
                  page: 1,
                  limit: 50,
                  totalOrders: 100,
                  totalPages: 2,
                  hasNextPage: true,
                  hasPrevPage: false,
                },
              },
            },
          },
        },
        "401": { description: "Unauthorized" },
        "500": { description: "Internal Server Error" },
      },
    },
  },
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
};

export default ordersGetDocs;
