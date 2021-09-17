'use strict';

const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
app.use(express.static(__dirname + '/'));
//when localhost:3000 is called server serves the html file
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, './index.html'))
});
//when /totalmem is accessed 
app.get('/totalmem', (req, res) => {
  //initializing variables and doing calculaions
  const freeMem = parseFloat(os.freemem);
  const totalMem = parseFloat(os.totalmem);
  const usedMem = totalMem - freeMem;
  const percentage = usedMem / (totalMem / 100);
  //setting headertype to json
  res.setHeader('Content-Type', 'application/json');
  //turning our variables into strings being saved to memory and being passed into ajax.js
  res.send(JSON.stringify({
    totalMem,
    freeMem,
    percentage
  }));
});

//set server to listen on port 3000
app.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000');
});