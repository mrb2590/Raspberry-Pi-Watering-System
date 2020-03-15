class Led {
  constructor () {
    this.init();
  }

  init () {
    process.stdout.write('Initializing LEDs... ');
    this.Gpio = require('onoff').Gpio;
    this.pins = {
      red: new this.Gpio(13, 'out'),
      yellow: new this.Gpio(6, 'out'),
      green: new this.Gpio(5, 'out')
    };
    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing LEDs... ');
    this.pins.red.writeSync(0);
    this.pins.red.unexport();
    this.pins.yellow.writeSync(0);
    this.pins.yellow.unexport();
    this.pins.green.writeSync(0);
    this.pins.green.unexport();
    process.stdout.write('Done\n');
  }

  powerOn (color) {
    // process.stdout.write(`Powering on ${color} LED... `);
    this.pins[color].writeSync(1);
    // process.stdout.write('Done\n');
  }

  powerOff (color) {
    // process.stdout.write(`Powering off ${color} LED... `);
    this.pins[color].writeSync(0);
    // process.stdout.write('Done\n');
  }
}

module.exports = Led;
