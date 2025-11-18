import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import pageRoutes from "./routes/pageRoutes"
import userRouter from "./routes/userRouter"
import session  from "express-session";
import passport from "./config/passport";
import wishlistRoutes from "./routes/wishListRoutes";
import messageRoutes from './routes/messageRoutes';
import dotenv from "dotenv";
dotenv.config()


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


// auth Routes
app.use("/api/auth", authRoutes);

//user router
app.use("/api/user",userRouter)

// Prouduct Routes
app.use("/api/product", productRoutes);


//wishlist pages
app.use("/api/wishlist",wishlistRoutes)

// page Router
app.use("/api/page", pageRoutes);


// messageRoutes
app.use("/message",messageRoutes);

 


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
  