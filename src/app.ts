import express  from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import pageRoutes from "./routes/pageRoutes"


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser()); //reading cookie

// User Routes
app.use("/api/user", userRoutes);

// Prouduct Routes
app.use("/api/product", productRoutes);

// page Router
app.use("/page",pageRoutes);

//error handling middleware
app.use(errorHandler);


export default app;
