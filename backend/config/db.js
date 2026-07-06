const mongoose = require("mongoose");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const productsData = require("../data/products");

async function seedDatabase() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("No products found in DB. Seeding initial products...");
      const seededProducts = await Product.insertMany(
        productsData.map((p) => ({
          name: p.name,
          category: p.category,
          price: p.price,
          stock: p.stock,
          description: p.description,
          image: "/images/placeholder.jpg",
        }))
      );
      console.log(`${seededProducts.length} products seeded successfully!`);

      const customerCount = await Customer.countDocuments();
      if (customerCount === 0) {
        console.log("No customers found in DB. Seeding initial customers...");
        const seededCustomers = await Customer.insertMany([
          { name: "Maria Santos", email: "maria@example.com", phone: "+1234567890", address: "123 Herbs Lane" },
          { name: "James Okafor", email: "james@example.com", phone: "+1987654321", address: "456 Spice Road" },
          { name: "Priya Mehta", email: "priya@example.com", phone: "+1122334455", address: "789 Tulsi Blvd" },
          { name: "Lena Novak", email: "lena@example.com", phone: "+1556677889", address: "101 Lavender Way" },
          { name: "Tom Fischer", email: "tom@example.com", phone: "+1998877665", address: "202 Mint Street" },
        ]);
        console.log(`${seededCustomers.length} customers seeded successfully!`);

        const orderCount = await Order.countDocuments();
        if (orderCount === 0) {
          console.log("No orders found in DB. Seeding initial orders...");
          const ordersToSeed = [
            {
              customer: seededCustomers[0]._id,
              products: [{ product: seededProducts[0]._id, quantity: 4 }],
              totalAmount: seededProducts[0].price * 4,
              status: "Fulfilled",
              createdAt: new Date("2026-06-19T10:00:00Z"),
            },
            {
              customer: seededCustomers[1]._id,
              products: [{ product: seededProducts[1]._id, quantity: 4 }],
              totalAmount: seededProducts[1].price * 4,
              status: "Processing",
              createdAt: new Date("2026-06-19T11:00:00Z"),
            },
            {
              customer: seededCustomers[2]._id,
              products: [{ product: seededProducts[2]._id, quantity: 3 }],
              totalAmount: seededProducts[2].price * 3,
              status: "Fulfilled",
              createdAt: new Date("2026-06-18T09:00:00Z"),
            },
            {
              customer: seededCustomers[3]._id,
              products: [{ product: seededProducts[3]._id, quantity: 3 }],
              totalAmount: seededProducts[3].price * 3,
              status: "Pending",
              createdAt: new Date("2026-06-18T14:00:00Z"),
            },
            {
              customer: seededCustomers[4]._id,
              products: [{ product: seededProducts[4]._id, quantity: 3 }],
              totalAmount: seededProducts[4].price * 3,
              status: "Fulfilled",
              createdAt: new Date("2026-06-17T15:00:00Z"),
            },
          ];
          const seededOrders = await Order.insertMany(ordersToSeed);
          console.log(`${seededOrders.length} orders seeded successfully!`);
        }
      }
    }
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
  }
}

async function connectDB() {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI environment variable is not defined!");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Call database seeding function
    await seedDatabase();

    // Set up connection event listeners
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected! Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("MongoDB reconnected!");
    });
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
