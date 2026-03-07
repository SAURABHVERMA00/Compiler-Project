import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import problemRoutes from "./modules/problem/problem.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import submissionRoutes from "./modules/submission/submission.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

// import routes
app.get("/",(req, res) => {
    res.send("Welcome to the API Service!");
});

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);

// Global error handler
app.use(errorMiddleware);

export default app;
