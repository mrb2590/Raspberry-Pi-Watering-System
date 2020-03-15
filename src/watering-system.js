const Pump = require('./lib/Pump.js');
const WaterSensor = require('./lib/WaterSensor.js');
const Led = require('./lib/Led.js');
const Button = require('./lib/Button.js');
const pump = new Pump;
const waterSensor = new WaterSensor;
const led = new Led;
const button = new Button;
let timerLoop = null;
let checkSensorLoop = null;
let buttonLoop = null;


const kill = () => {
  if (timerLoop) {
    clearTimeout(timerLoop);
    timerLoop = null;
  }

  if (checkSensorLoop) {
    clearInterval(checkSensorLoop);
  }

  if (buttonLoop) {
    clearInterval(buttonLoop);
  }

  pump.kill();
  led.kill();
}

process.on('SIGINT', () => {
  kill();
});

checkSensorLoop = setInterval(() => {
  waterSensor.updateReading();

  if (waterSensor.getReading() < 75) {
    process.stdout.write('Detected low water level!\n');

    if (pump.getState() === 'on') {
      pump.powerOff();
    }

    if (timerLoop) {
      clearInterval(timerLoop);
      timerLoop = null;
      led.powerOff('red');
      led.powerOff('yellow');
      led.powerOff('green');
    }
  }
}, 500);

buttonLoop = setInterval(() => {
  if (button.isPressed()) {
    if (!timerLoop) {
      process.stdout.write('Starting pump timer!\n');
      runForTime(10000);
    }
  }
}, 10);

const runForTime = (endTime) => {
  let time = 0;
  pump.powerOn();

  timerLoop = setInterval(() => {
    const timeSection = Math.floor(endTime / 3);

    if (time >= 0 && time < timeSection) {
      led.powerOn('red');
      led.powerOn('yellow');
      led.powerOn('green');
    } else if (time >= timeSection && time  < timeSection * 2) {
      led.powerOn('red');
      led.powerOn('yellow');
      led.powerOff('green');
    } else {
      led.powerOn('red');
      led.powerOff('yellow');
      led.powerOff('green');
    }

    if (time >= endTime) {
      console.log('sdfdsf')

      if (pump.getState() === 'on') {
        pump.powerOff();
      }

      led.powerOff('red');
      led.powerOff('yellow');
      led.powerOff('green');
      clearInterval(timerLoop);
      timerLoop = null;
    }

    time += 10;
  }, 10);
}

// runForTime(10000);
