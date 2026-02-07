import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import path from "path"

import notesRoute from "./Route/notesRoute.js";
import usersRoute from "./Route/usersRoute.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/ratelimiter.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()


//cors
if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials:true
    }))
}
// app.options("*", cors({
//     origin: "http://localhost:5173",
//     credentials:true
// }));

//middlewares
app.use(express.json());
app.use(rateLimiter);
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//routes
app.use("/api/v1/users", usersRoute);
app.use("/api/v1/notes", notesRoute);

if (process.env.NODE_ENV !== "development") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running on port :", PORT)
    });
});
