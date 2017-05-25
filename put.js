const level = require('level');

const db = level('./test.db');

db.put('hello', 'world', console.log);
