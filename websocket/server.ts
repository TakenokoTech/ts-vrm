import { Server } from "ws";
const server = new Server({ port: 5001 });

server.on("connection", websocket => {
    let time = new Date();
    websocket.on("message", message => {
        console.log("Received: " + (new Date().getMilliseconds() - time.getMilliseconds()) + "ms" + message);
        time = new Date();
        server.clients.forEach(client => {
            client.send(message);
        });
    });

    websocket.on("close", () => {
        console.log("I lost a client");
    });
});
console.log("start websocket server. port=5001");
