import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { WebSocketServer } from 'ws';  
import express from 'express';
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';
import dotenv from 'dotenv';

dotenv.config();

// Setup InfluxDB client
const influxClient = new InfluxDBClient({
  host: 'https://eu-central-1-1.aws.cloud2.influxdata.com',
  token: process.env.INFLUXDB_TOKEN,
});

// Function to write data point to InfluxDB
async function writeDataToInflux(humidity, temperature) {
  const point = new Point('environment_data')
    .setTag('location', 'Arduino')
    .setFloatField('humidity', humidity)
    .setFloatField('temperature', temperature);

  try {
    await influxClient.write(point, 'influx-bucket'); // Replace with your bucket name
    console.log('Data written to InfluxDB:', point.toString());
  } catch (error) {
    console.error('Error writing point to InfluxDB:', error);
  }
}

// Setup Express server
const app = express();
const port = 3000;
app.use(express.static('public'));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Setup WebSocket server
const wss = new WebSocketServer({ port: 8080 });  
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
});

// Setup serial communication
const arduinoPort = new SerialPort({ path: 'COM7', baudRate: 9600 }); // Change COM7 to your path
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Read data from Arduino and send to WebSocket clients
parser.on('data', (data) => {
  // Assuming your Arduino sends data in the format: "Humidity: <value> | Temperature: <value>"
  const regex = /Humidity:\s*([\d.]+)%\s*\|\s*Temperature:\s*([\d.]+)°C/;
  const match = data.match(regex);

  if (match) {
    const humidity = parseFloat(match[1]);
    const temperature = parseFloat(match[2]);

    // Send data to WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });

    // Write the data to InfluxDB
    writeDataToInflux(humidity, temperature);
  }
});
