import { PrismaClient } from "../generated/prisma/index.js";


const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR 💥:", err);

  // Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(400).json({
        status: "fail",
        message: "Duplicate field value violates unique constraint",
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        status: "fail",
        message: "Record not found",
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        status: "fail",
        message: "Foreign key constraint failed",
      });
    }
  }

  // Custom Operational Error
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unknown Error (Production Safe)
  return res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};

export default errorMiddleware;
