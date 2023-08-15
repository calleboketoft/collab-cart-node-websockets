const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, "public")));

const cartItems = [];

wss.on("connection", (ws) => {
  console.log("WebSocket connection established");

  // Send the current cart items to the newly connected client
  ws.send(JSON.stringify(cartItems));

  ws.on("message", (message) => {
    const item = JSON.parse(message);
    cartItems.push(item);

    // Broadcast the updated cart to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(cartItems));
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
