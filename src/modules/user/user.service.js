import { prisma } from "../../config/prisma.js";
import bcrypt from "bcrypt";

export const registerUser = async (data) => {
  const { name, email, password , role} = data;
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      stats: {
        create: {
          problemsSolved: 0,
          totalSubmissions: 0
        }   // will use default values (0,0)
      }
    }
  });
};

export const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  return user;
};

export const registerAdmin = async (data) => {
  const { name, email, password , role} = data;
  
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      
    }
    
  });
};
