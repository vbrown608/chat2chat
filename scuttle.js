const level = require('level');
const nickname = process.argv[2];

function encodeKey(peer, seq) {
  return peer*1000 + seq;
}

function decodeKey(key) {
  return {
    peer: key/1000,
    seq: key%1000
  }
}

function peerMaxKey(peer) {
  return (peer + 1) * 1000;
}

// Get the highest seq for each peer
function getSeqs() {

}

// Take a list of (peer, seq) pairs and return any required updates
function getUpdates(seqs) {
}

function getPeerUpdates(peer, seq) {
  var min = encodeKey(peer, seq);
  var max = peerMaxKey(peer);
  db.createReadStream({
    gt: min,
    lt: max
  }).on('data', data => {
    console.log(data)
  });
}

// Take a list of (peer, seq) pairs and return a list of keys(?)
function getUpdateRequest(seqs) {

}

db.put(encodeKey(0, 1), 'foo');
db.put(encodeKey(0, 2), 'bar');
db.put(encodeKey(0, 3), 'baz');
db.put(encodeKey(1, 1), 'garlic');
db.put(encodeKey(2, 1), 'onion');
db.put(encodeKey(2, 2), 'noodles');
db.put(encodeKey(2, 3), 'fusilli');

getPeerUpdates(2, 0);
// getAllUpdates([
    // { peer: 0, -1
