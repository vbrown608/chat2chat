const net = require('net');
const streamSet = require('stream-set');

const activeSockets = streamSet();

const server = net.createServer(c => {
  console.log('connected');

  activeSockets.add(c);

  c.on('data', data => {
    activeSockets.forEach( (c2) => {
      if(c2 !== c) {
        c2.write(data);
      };
    });
  });

  c.on('end', () => {
    console.log('disconnected');
  });

});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});
