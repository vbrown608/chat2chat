const level = require('level');
const scuttleup = require('scuttleup');

const logs = scuttleup(level('logs.db'));

const stream = logs.createReadStream({valueEncoding: 'utf-8'});
stream.on('data', function(data) {
  console.log(data);
});
