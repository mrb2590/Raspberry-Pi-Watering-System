const Gpio = require('onoff').Gpio;

class Button {
  constructor () {
    this.interval = null;
    this.init();
  }

  init () {
    process.stdout.write('Initializing button... ');

    this.pin = new Gpio(16, 'in');

    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing button... ');

    this.pin.unexport();

    if (this.interval) {
      clearInterval(this.interval);
    }

    process.stdout.write('Done\n');
  }

  isPressed () {
    return this.pin.readSync();
  }

  onPressed (callback) {
    this.interval = setInterval(() => {
      if (this.isPressed()) {
        // process.stdout.write('Detected button press\n');

        callback();
      }
    }, 34);
  }
}

module.exports = Button;
