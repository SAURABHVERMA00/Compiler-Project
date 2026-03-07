import dotenv from "dotenv";
import {prisma}  from "./src/config/prisma.js";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT;

const startserver = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
   console.error("Failed to connect to the database:", err);
   process.exit(1);
  }
};

startserver();

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
