import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

socket.emit("message", "Hello Server!");

socket.on("response", (data) => {
console.log(data);
});