const Mcpadc = require('mcp-spi-adc');

class WaterSensor {
  constructor () {
    this.interval = null;
    this.lastFiveReadings = [];
    this.init();
  }

  init () {
    process.stdout.write('Initializing water sensor... ');

    this.sensor = Mcpadc.open(0, {speedHz: 20000}, err => {
      if (err) throw err;
      this.updateReading();
    });

    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing water sensor... ');

    if (this.interval) {
      clearInterval(this.interval);

      this.interval = null;
    }

    process.stdout.write('Done\n');
  }

  updateReading () {
    this.sensor.read((err, reading) => {
      if (err) throw err;

      this.reading = Math.floor(reading.value * 100);

      this.lastFiveReadings.push(this.reading);

      if (this.lastFiveReadings.length > 5) {
        this.lastFiveReadings.shift();
      }
    });
  }

  getReading () {
    return this.reading;
  }

  isEmpty () {
    let average = this.lastFiveReadings.reduce((a, b) => a + b) / this.lastFiveReadings.length;
    return average < 78;
  }

  onCheckWaterLevel (callback) {
    this.interval = setInterval(() => {
      this.updateReading();

      if (this.isEmpty()) {
        // process.stdout.write('Detected low water level!\n');
      }

      callback(this.isEmpty());
    }, 100);
  }
}

module.exports = WaterSensor;
