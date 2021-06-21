// TODO: write server code here
//ecoute les connection et les non connections

const express = require("express");
const uniqid = require("uniqid");
const app = express();
const socketIO = require("socket.io");

const server = app.listen(3001);

const io = socketIO(server, {
  cors: { origin: ["http://localhost:3002"] },
});

const messages = [
  { id: uniqid(), author: "server", text: "welcome to WildChat" },
];

//ecouter connection a la web sockets : notre serveur web socket, quand client se connecte il execute une fonction
io.on("connect", (socket) => {
  console.log("user connected");
  socket.on("disconnect", () => {
    //recupere l'objet socket, si détecte évt deconnexion
    console.log("user disconnected");
  });
  socket.emit("initialMessageList", messages);

  socket.on("messageFromClient", (newMessage) => {
    const toSend = { id: uniqid(), ...newMessage };
    messages.push(toSend); //push un nouvel objet, id et données provenant du client
    io.emit("messageFromServer", toSend); //Once the new message is added to the list, we have to send it back to (all*) the clients
  });
});
