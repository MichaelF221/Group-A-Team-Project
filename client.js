import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Send a message to the server
socket.emit("message", "Hello Server!");

// Listen for responses from the server
socket.on("response", (data) => {
console.log(data);
});