const level = require('level');
const scuttleup = require('scuttleup');

const logs = scuttleup(level('logs.db'));
logs.append('hello world');
