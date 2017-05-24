'use strict';

const topology = require('fully-connected-topology');
const jsonStream = require('duplex-json-stream');
const streamSet = require('stream-set');

const nickname = process.argv[2];
const myaddr = process.argv[3];
const peerAddrs = process.argv.slice(4);
const peers = streamSet();

const mytop = topology(myaddr, peerAddrs);

var seq = 0;
const id = Math.random();
const peerSeqs = {};

function writeAll(data) {
  for (let stream of peers.streams) {
    stream.write(data);
  }
}

function notSeen(data) {
  let peerSeq = peerSeqs[data.id];
  if (peerSeq !== undefined) {
    return data.seq > peerSeq;
  }
  return true;
}

function updatePeerSeq(data) {
  peerSeqs[data.id] = data.seq;
}

process.stdin.on('data', (data) => {
  writeAll({
    nickname: nickname,
    message: data.toString(),
    seq: seq,
    id: id
  });

  seq += 1;
});

mytop.on('connection', (conn, peerAddr) => {
  console.log('mytop is connected to', peerAddr);
  const peerJsonStream = jsonStream(conn);
  peers.add(peerJsonStream);
  peerJsonStream.on('data', (data) => {
    if (notSeen(data)) {
      printMessage(data);
      writeAll(data);
      updatePeerSeq(data);
    }
  });
});

function printMessage(data) {
  process.stdout.write(data.nickname);
  process.stdout.write('> ');
  process.stdout.write(data.message);
}
