import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

let io: SocketIOServer | null = null;

export const initializeSocket = (server: HTTPServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    return io;
};

export const getSocketIO = (): SocketIOServer => {
    if (!io) {
        throw new Error("Socket.io not initialized. Call initializeSocket first.");
    }
    return io;
};
