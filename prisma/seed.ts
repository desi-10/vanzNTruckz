import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Admin
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      phone: "1234567890",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // Create Customers
  await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "customer@example.com",
        phone: "0987654321",
        password: hashedPassword,
        role: "CUSTOMER",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "0987654322",
        password: hashedPassword,
        role: "CUSTOMER",
      },
      {
        name: "Alice Smith",
        email: "alice@example.com",
        phone: "0987654323",
        password: hashedPassword,
        role: "CUSTOMER",
      },
    ],
    skipDuplicates: true,
  });

  // Fetch customers
  const allCustomers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
  });

  // Create Drivers
  await prisma.user.createMany({
    data: [
      {
        name: "Delivery Driver",
        email: "driver@example.com",
        phone: "1122334455",
        password: hashedPassword,
        role: "DRIVER",
      },
      {
        name: "James Bond",
        email: "james@example.com",
        phone: "1122334466",
        password: hashedPassword,
        role: "DRIVER",
      },
      {
        name: "Mike Ross",
        email: "mike@example.com",
        phone: "1122334477",
        password: hashedPassword,
        role: "DRIVER",
      },
    ],
    skipDuplicates: true,
  });

  // Fetch drivers
  const allDrivers = await prisma.user.findMany({ where: { role: "DRIVER" } });

  // Create Driver Profiles
  await prisma.driver.createMany({
    data: allDrivers.map((driver, index) => ({
      userId: driver.id,
      license: `DRIVER00${index + 1}`,
      vehicleType: index % 2 === 0 ? "Motorbike" : "Car",
      status: true,
    })),
    skipDuplicates: true,
  });

  // Create Pricing Models
  await prisma.pricing.createMany({
    data: [
      {
        serviceType: "Standard Delivery",
        baseFare: 5.0,
        perKmRate: 1.2,
        perMinRate: 0.5,
      },
      {
        serviceType: "Express Delivery",
        baseFare: 8.0,
        perKmRate: 1.5,
        perMinRate: 0.8,
      },
      {
        serviceType: "Economy Delivery",
        baseFare: 3.0,
        perKmRate: 1.0,
        perMinRate: 0.4,
      },
    ],
    skipDuplicates: true,
  });

  // Fetch Pricing
  const allPricing = await prisma.pricing.findMany();

  // Create Orders
  const orders = await Promise.all(
    allCustomers.map(async (customer, index) => {
      return await prisma.order.create({
        data: {
          customerId: customer.id,
          driverId: allDrivers[index % allDrivers.length].id, // Assign different drivers
          priceId: allPricing[index % allPricing.length].id,
          finalPrice: 10 + index * 5, // Vary the price slightly
          status: index % 2 === 0 ? "PENDING" : "COMPLETED",
        },
      });
    })
  );

  // Create Transactions
  await Promise.all(
    orders.map(async (order, index) => {
      return await prisma.transaction.create({
        data: {
          orderId: order.id,
          customerId: order.customerId,
          amount: order.finalPrice || 100 * index, // Convert to cents
          paymentMethod: index % 2 === 0 ? "MOBILE_MONEY" : "CARD",
          status: "PENDING",
        },
      });
    })
  );

  // Create Dispatches
  await Promise.all(
    orders.map(async (order) => {
      return await prisma.dispatch.create({
        data: {
          orderId: order.id,
          driverId: order.driverId!,
          status: "ASSIGNED",
        },
      });
    })
  );

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
