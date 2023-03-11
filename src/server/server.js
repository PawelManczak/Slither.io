const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
  res.send('sreusz is here');
  res.send('kasia is here');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
