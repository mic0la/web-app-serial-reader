# web-app-serial-reader
reading data from arduino/esp controllers <br />
AKA digital shadow

## how to deploy (without DB)
copy the repo <br />
change your path in `app.js` to ports (in my case 'COM10') <br />
`npm i` to install dependencies <br />
`npm start` to run the application http://localhost:3000 <br />

## how to deploy (with DB)
copy the repo <br />
change your path in `newapp.js` to ports (in my case `'COM10'`) <br />
type `npm i` to install dependencies <br />
create your influx cloud account https://cloud2.influxdata.com/ <br />
get `api`,`cloud-url` , `bucket-name` and `token` <br />
change this values in `newapp.js` to yours <br />
type `node newapp.js` to run the application http://localhost:3000 <br />
you later can see received data in influx cloud, in data explore tab

## architecture (without DB)
![Screenshot 2024-09-26 193332](https://github.com/user-attachments/assets/ba6e8439-749a-4aa7-942c-208a0dd34f46)
