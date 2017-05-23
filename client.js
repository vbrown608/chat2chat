const net = require('net');

const socket = net.connect(8080);

socket.on('connect', () => {
  process.stdin.on('data', (data) => {
    socket.write(data);
  });
});

socket.on('data', (data) => {
  process.stdout.write(data);
});

