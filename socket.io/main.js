import express from 'express';
import http from 'http';
import { Server as Io } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io =  new Io(server);


let connections = [];

io.on('connection', (socket) => {
  console.log(socket.id);
  connections.push(socket.id);

  io.emit('updateConnections', connections);

  socket.on('privateMessage', (data) => {
    // Отправляем приватное сообщение по указанному id
    io.to(data.recipient).emit('privateMessage', {
      sender: socket.id,
      message: data.message,
    });
  });

  socket.on('disconnect', () => {
    let index = connections.indexOf(socket.id);
    if (index !== -1) {
      connections.splice(index, 1);
    }

    io.emit('updateConnections', connections);
  });
});

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
