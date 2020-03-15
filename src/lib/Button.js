class Button {
  constructor () {
    this.init();
  }

  init () {
    process.stdout.write('Initializing button... ');
    this.Gpio = require('onoff').Gpio;
    this.pin = new this.Gpio(26, 'in');
    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing button... ');
    this.pin.unexport();
    process.stdout.write('Done\n');
  }

  isPressed () {
    return this.pin.readSync();
  }
}

module.exports = Button;
