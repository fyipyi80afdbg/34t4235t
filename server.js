const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const screenshot = require("screenshot-desktop");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev; restrict later if needed
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("getScreenshot", async () => {
    try {
      const imgBuffer = await screenshot({ format: "png" });
      const imgBase64 = imgBuffer.toString("base64");
      socket.emit("screenshot", imgBase64);
    } catch (err) {
      console.error(err);
      socket.emit("error", "Screenshot failed");
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Screenshot backend is running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
