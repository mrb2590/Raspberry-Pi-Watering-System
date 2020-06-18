const Gpio = require('onoff').Gpio;

class WaterSensor {
  constructor () {
    this.init();
  }

  init () {
    process.stdout.write('Initializing water sensor... ');

    this.pin = new Gpio(23, 'in');

    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing water sensor... ');

    this.pin.unexport();

    if (this.interval) {
      clearInterval(this.interval);
    }

    process.stdout.write('Done\n');
  }


  hasLowWaterLevel () {
    return this.pin.readSync();
  }

  onCheckWaterLevel (callback) {
    this.interval = setInterval(() => {
      if (this.hasLowWaterLevel()) {
        // process.stdout.write('Detected low water level!\n');
      }

      callback(this.hasLowWaterLevel());
    }, 250);
  }
}

module.exports = WaterSensor;
