import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Resetting and seeding database...");

  // Clear existing data
  await prisma.$transaction([
    prisma.dispatch.deleteMany(),
    prisma.transaction.deleteMany(),
    prisma.order.deleteMany(),
    prisma.pricing.deleteMany(),
    prisma.driver.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Hash password
  const hashedPassword = await bcrypt.hash("password123", 10);

  // Create Users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        phone: "1234567890",
        password: hashedPassword,
        role: "ADMIN",
      },
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

  const customers = await prisma.user.findMany({ where: { role: "CUSTOMER" } });
  const drivers = await prisma.user.findMany({ where: { role: "DRIVER" } });

  // Create Driver Profiles
  await prisma.driver.createMany({
    data: drivers.map((driver, index) => ({
      userId: driver.id,
      license: `DRIVER00${index + 1}`,
      vehicleType: index % 2 === 0 ? "Motorbike" : "Car",
    })),
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
  });

  const pricing = await prisma.pricing.findMany();

  // Create Orders & Related Data
  for (let i = 0; i < customers.length; i++) {
    const order = await prisma.order.create({
      data: {
        customerId: customers[i].id,
        driverId: drivers[i % drivers.length].id,
        priceId: pricing[i % pricing.length].id,
        finalPrice: 10 + i * 5,
        status: i % 2 === 0 ? "PENDING" : "COMPLETED",
      },
    });

    await prisma.transaction.create({
      data: {
        orderId: order.id,
        customerId: order.customerId,
        amount: 10 + i * 5,
        paymentMethod: i % 2 === 0 ? "MOBILE_MONEY" : "CARD",
        status: "PENDING",
      },
    });

    await prisma.dispatch.create({
      data: {
        orderId: order.id,
        driverId: order.driverId!,
        status: "ASSIGNED",
      },
    });
  }

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
