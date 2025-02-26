import loginDocs from "@/docs/auth/login";
import registerDocs from "@/docs/auth/register";
import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "./src/app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "VansNTrucks API",
        description: "VansNTrucks API",
        version: "1.0",
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [],
      paths: {
        ...loginDocs,
        ...registerDocs,
      },
    },
  });
  return spec;
};
