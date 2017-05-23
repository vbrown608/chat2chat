const net = require('net');
const jsonStream = require('duplex-json-stream');
require('lookup-multicast-dns/global');

const nickname = process.argv[2];

const socket = net.connect(8080, 'chat2chat.local');
const stream = jsonStream(socket);

socket.on('connect', () => {
  process.stdin.on('data', (data) => {
    stream.write({nickname: nickname, message: data.toString()});
  });
});

stream.on('data', (data) => {
  process.stdout.write(data.nickname);
  process.stdout.write('> ');
  process.stdout.write(data.message);
});

