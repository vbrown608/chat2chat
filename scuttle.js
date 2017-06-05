'use strict';
const level = require('level');
const nickname = process.argv[2];

const db = level(nickname + '.db');

function pad(n, l, p) {
  n = n + "";
  return n.length >= l ? n : new Array(l - n.length + 1).join(p) + n;
}

function encodeKey(peer, seq) {
  return pad(peer, 4, '0') + pad(seq, 4, '0');
}

function decodeKey(key) {
  return {
    peer: parseInt(key.slice(0, 4)),
    seq: parseInt(key.slice(4))
  }
}

function peerUpperBound(peer) {
  return pad(peer + 1, 4, '0');
}

function getPeers(cb) {
  return db.get('peers', (err, value) => {
    if (err) {
      return {};
    } else {
      cb(value);
    }
  });
}

function maxPeer(peers) {
  return Math.max.apply(null, Object.keys(peers));
}

function addPeer() {
  return getPeers(peers => {
    let next = maxPeer(peers) + 1;
    peers[next] = true;
  });
}

// Get the highest seq for each peer
function getSeqs(cb) {
  getPeers(peers => {
    Object.keys(peers).map((key, value) => {
      let peer = parseInt(key, 10);
      getPeerSeq(peer, cb);
    });
  });
}

// Get the highest seq for a single peer
function getPeerSeq(peer, cb) {
  db.createReadStream({
    gte: encodeKey(peer, 0),
    lt: encodeKey(peer+1, 0),
    reverse: true,
    limit: 1
  }).on('data', data => {
    let seq = decodeKey(data.key).seq;
    cb({
      peer: peer,
      seq: seq
    });
  });
}

// Take a list of (peer, seq) pairs and return any required updates
function getUpdates(seqs, cb) {
  seqs.map(data => {
    getPeerUpdates(data.peer, data.seq, cb);
  });
}

function getPeerUpdates(peer, cb) {
  db.createReadStream({
    gt: encodeKey(peer, seq),
    lt: peerUpperBound(peer)
  }).on('data', data => {
    cb(data)
  });
}

// Take a list of (peer, seq) pairs and return a list of keys(?)
function getUpdateRequest(seqs) {

}

db.put('peers', {
  0: true,
  1: true,
  2: true
});
db.put(encodeKey(0, 1), 'foo');
db.put(encodeKey(0, 2), 'bar');
db.put(encodeKey(0, 3), 'baz');
db.put(encodeKey(1, 1), 'garlic');
db.put(encodeKey(2, 1), 'onion');
db.put(encodeKey(2, 2), 'noodles');
db.put(encodeKey(2, 3), 'fusilli');

getUpdates(getSeqs(console.log), console.log);
