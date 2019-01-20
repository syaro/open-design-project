import express from "express";
import bodyParser from "body-parser";
import { nextUser } from "./utils/util";

const midi = require("midi");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = require("http").createServer(app);
let io = require("socket.io")(server);

const output = new midi.output();
output.openVirtualPort("node-midi");

let userId = 1;
let createMidiCanBeCalled = true;

function createMidi(id: number) {
  if (!createMidiCanBeCalled) return;

  if (userId === 1 && id <= 25) {
    output.sendMessage([176, id, 1]);
  }
  if (userId === 2 && id > 25 && id < 80) {
    output.sendMessage([176, id, 1]);
  }
  createMidiCanBeCalled = false;
  setTimeout(() => {
    createMidiCanBeCalled = true;
  }, 300);
}

io.on("connection", (socket: any) => {
  socket.on("position", (message: string) => {
    const positionId = JSON.parse(message);
    createMidi(positionId);
  });
  socket.on("user", (message: string) => {
    userId = JSON.parse(message);
    if (userId === 2) nextUser();
  });
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
