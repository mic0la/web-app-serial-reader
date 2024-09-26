const {SerialPort} = require('serialport');
const {ReadlineParser} = require('@serialport/parser-readline');
const WebSocket = require('ws');
const express = require('express');

// Setup Express server
const app = express();
const port = 3000;
app.use(express.static('public'));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Setup WebSocket server
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});

// Setup serial communication
const arduinoPort = new SerialPort({ path: 'COM10',baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Read data from Arduino and send to WebSocket clients
parser.on('data', (data) => {
  console.log(`Data from Arduino: ${data}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});
