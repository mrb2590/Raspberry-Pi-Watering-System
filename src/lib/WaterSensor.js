class WaterSensor {
  constructor () {
    this.init();
  }

  init = () => {
    process.stdout.write('Initializing water sensor... ');
    this.Mcpadc = require('mcp-spi-adc');
    this.sensor = this.Mcpadc.open(0, {speedHz: 20000}, err => {
      if (err) throw err;
      this.updateReading();
    });
    process.stdout.write('Done\n');
  }

  updateReading = () => {
    this.sensor.read((err, reading) => {
      if (err) throw err;

      const value = Math.floor((reading.rawValue >= 700 ? 700 : reading.rawValue) / 700 * 100);

      process.stdout.write(`Water: ${value}\n`);

      this.reading = value;
      this.isEmpty = value <= 75
    });
  }
}

module.exports = WaterSensor;
