import io from "socket.io-client";

const socket = io("ws://localhost:9092", {
    autoConnect: true,
    reconnectionAttempts: 5,
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log("✅ Conectado ao backend Socket.IO!", socket.id);
});

socket.on("connect_error", (error: any) => {
    console.error("❌ Erro ao conectar ao Socket.IO:", error);
});

socket.on("welcome", (msg: any) => {
    console.log("📩 Mensagem recebida do backend:", msg);
});


export default socket;
