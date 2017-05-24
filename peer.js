'use strict';

const register = require('register-multicast-dns');
const hashToPort = require('hash-to-port');
const topology = require('fully-connected-topology');
const jsonStream = require('duplex-json-stream');
const streamSet = require('stream-set');
require('lookup-multicast-dns/global');

const nickname = process.argv[2];
const peerNames = process.argv.slice(3);
const peers = streamSet();

const mytop = topology(toAddress(nickname), peerNames.map(toAddress));

register(nickname);

var seq = 0;
const id = Math.random();
const peerSeqs = {};

function writeAll(data) {
  for (let stream of peers.streams) {
    stream.write(data);
  }
}

function toAddress(username){
    return username + '.local:' + hashToPort(username);
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
