'use strict';

const topology = require('fully-connected-topology');
const jsonStream = require('duplex-json-stream');
const streamSet = require('stream-set');

const nickname = process.argv[2];
const myaddr = process.argv[3];
const peerAddrs = process.argv.slice(4);
const peers = streamSet();

const mytop = topology(myaddr, peerAddrs);

function writeAll(data) {
  for (let stream of peers.streams) {
    stream.write(data);
  }
}

process.stdin.on('data', (data) => {
  writeAll({nickname: nickname, message: data.toString()});
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
