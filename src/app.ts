import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import pageRoutes from "./routes/pageRoutes"
import session  from "express-session";
import passport from "./config/passport";
import wishlistRoutes from "./routes/wishListRoutes";
import dotenv from "dotenv";
dotenv.config()


const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser()); //reading cookie
app.use(
    session({
        secret:process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
)


app.use(passport.initialize());
// app.use(passport.session());


// User Routes
app.use("/api/user", userRoutes);

// Prouduct Routes
app.use("/api/product", productRoutes);

// page Router
app.use("/page", pageRoutes);
app.use("/wishlist",wishlistRoutes)


app.get("/success", (req, res) => {
  res.send("Login success ✅");
});

app.get("/login", (req, res) => {
  res.send("Login failed ❌");
});

//error handling middleware
app.use(errorHandler);

 
export default app;
