const Pump = require('./lib/Pump.js');
const WaterSensor = require('./lib/WaterSensor.js');
const pump = new Pump;
const waterSensor = new WaterSensor;
let timeout = null;
let checkSensorLoop = null;


const kill = () => {
  pump.kill();

  if (timeout) {
    clearTimeout(timeout);
  }

  if (checkSensorLoop) {
    clearInterval(checkSensorLoop);
  }
}

process.on('SIGINT', () => {
  kill();
});

pump.powerOn();

checkSensorLoop = setInterval(() => {
  waterSensor.updateReading();

  if (waterSensor.getReading() < 75) {
    process.stdout.write('Detected low water level!\n');

    if (pump.state === 'on') {
      pump.powerOff();
    }
  } else {
    if (pump.state === 'off') {
      pump.powerOn();
    }
  }
}, 500);


// timeout = setTimeout(() => {
//   kill();
// }, 10000);
