import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import pageRoutes from "./routes/pageRoutes"
import userRouter from "./routes/userRouter"
import session from "express-session";
import passport from "./config/passport";
import wishlistRoutes from "./routes/wishListRoutes";
import messageRoutes from './routes/messageRoutes';
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import myListRoutes from "./routes/myListRoutes";

dotenv.config();  

// cloudinary configuration
import "./config/cloudinary"; 



const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL as string, 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //reading cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)


app.use(passport.initialize());
// app.use(passport.session());


app.get("/", (req, res) => {
  res.send("Hello World!");
})

//upload configuration 
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// auth Routes
app.use("/api/auth", authRoutes);

//user router
app.use("/api/user", userRouter)

// Prouduct Routes
app.use("/api/product", productRoutes);


//wishlist pages
app.use("/api/wishlist", wishlistRoutes)

// page Router
app.use("/api/page", pageRoutes);


// messageRoutes
app.use("/api/message", messageRoutes);

//myListRoutes
app.use("/api/my-listings", myListRoutes);




// test rotues
app.get("/success", (req, res) => {
  res.send("Login success ✅");
});

app.get("/login", (req, res) => {
  res.send("Login failed ❌");
});


//error handling middleware
app.use(errorHandler);


export default app;
