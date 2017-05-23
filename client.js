const net = require('net');
const jsonStream = require('duplex-json-stream');

const nickname = process.argv[2];

const socket = jsonStream(net.connect(8080));

socket.on('connect', () => {
  process.stdin.on('data', (data) => {
    console.log('Got data: ' + data);
    socket.write({nickname: nickname, message: data});
  });
});

socket.on('data', (data) => {
  process.stdout.write(data.username);
  process.stdout.write('> ');
  process.stdout.write(data.message);
});

