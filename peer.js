const topology = require('fully-connected-topology');

const myaddr = process.argv[2];
const peers = process.argv.slice(3);

const mytop = topology(myaddr, peers);

mytop.on('connection', (conn, peer) => {
    console.log('mytop is connected to', peer);
});

