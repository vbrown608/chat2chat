'use strict';

const topology = require('fully-connected-topology');
const jsonStream = require('duplex-json-stream');
const streamSet = require('stream-set');

const myaddr = process.argv[2];
const peerAddrs = process.argv.slice(3);
const peers = streamSet();

const mytop = topology(myaddr, peerAddrs);

function writeAll(data) {
  for (let stream of peers.streams) {
    stream.write(data);
  }
}

process.stdin.on('data', (data) => {
  writeAll({nickname: myaddr, message: data.toString()});
});

mytop.on('connection', (conn, peerAddr) => {
  console.log('mytop is connected to', peerAddr);
  const peerJsonStream = jsonStream(conn);
  peers.add(peerJsonStream);
  peerJsonStream.on('data', (data) => {
    process.stdout.write(data.nickname);
    process.stdout.write('> ');
    process.stdout.write(data.message);
  });
});
