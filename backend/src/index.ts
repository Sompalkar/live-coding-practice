import Express, { type Request, type Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import todoRoutes from "./routes/todo.routes.js";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.routes.js";
import connectDB from './database/mongo.js';
import userRoutes from "./routes/user.routes.js"
import http from "http";
import { initializeSocket } from "./socket/socketManager.js";

const app = Express();
const server = http.createServer(app);

// Initialize Socket.io through the socket manager
initializeSocket(server);

dotenv.config();

connectDB();
    
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// Add cookie parser middleware
app.use(cookieParser());

app.use(Express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("hello world");
});

app.get("/health", (req: Request, res: Response) => {
    res.send({
        status: "ok",
        message: "Server is running"                        
    });
});

// REST API routes
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/chat", chatRoutes);

app.use("/api/v1/auth", userRoutes)

// Use server.listen instead of app.listen for Socket.io compatibility
server.listen(8000, () => {
    console.log("Server is running on port 8000");
});



