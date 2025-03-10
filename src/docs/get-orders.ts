const ordersGetDocs = {
  "/api/v1/orders": {
    get: {
      summary: "Retrieve Paginated Orders",
      description:
        "Fetch a list of orders with pagination. This endpoint requires admin authentication.",
      tags: ["Orders", "Admin"],
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
};

export default ordersGetDocs;
