const net = require('net');

const server = net.createServer(c => {
  console.log('connected');

  c.on('data', data => {
    c.write(data);
  });

  c.on('end', () => {
    console.log('disconnected');
  });

});

server.listen(8080, () => {
  console.log('server listening on port 8080');
});
