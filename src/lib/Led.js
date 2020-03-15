const Gpio = require('onoff').Gpio;

class Led {
  constructor () {
    this.blinkIntervals = {
      red: null,
      yellow: null,
      green: null
    };
    this.init();
  }

  init () {
    process.stdout.write('Initializing LEDs... ');

    this.pins = {
      red: new Gpio(13, 'out'),
      yellow: new Gpio(6, 'out'),
      green: new Gpio(5, 'out')
    };

    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing LEDs... ');

    this.stopBlink('red');
    this.stopBlink('yellow');
    this.stopBlink('green');

    this.pins.red.writeSync(0);
    this.pins.red.unexport();
    this.pins.yellow.writeSync(0);
    this.pins.yellow.unexport();
    this.pins.green.writeSync(0);
    this.pins.green.unexport();

    process.stdout.write('Done\n');
  }

  powerOn (color) {
    if (!this.pins[color].readSync()) {
      process.stdout.write(`Powering on ${color} LED... `);

      if (this.blinkIntervals[color]) {
        clearInterval(this.blinkIntervals[color]);
        this.blinkIntervals[color] = null;
      }

      this.pins[color].writeSync(1);

      process.stdout.write('Done\n');
    }
  }

  powerOff (color) {
    if (this.pins[color].readSync()) {
      process.stdout.write(`Powering off ${color} LED... `);

      if (this.blinkIntervals[color]) {
        clearInterval(this.blinkIntervals[color]);
        this.blinkIntervals[color] = null;
      }

      this.pins[color].writeSync(0);

      process.stdout.write('Done\n');
    }
  }

  getBlinkInterval (color) {
    return this.blinkIntervals[color];
  }

  blink (color, delay) {
    let interval = 0;

    this.blinkIntervals[color] = setInterval(() => {
      if (interval % 2) {
        this.powerOn(color);
      } else {
        this.powerOff(color);
      }

      interval++;

      if (interval > 1) interval = 0;
    }, delay);
  }

  stopBlink (color) {
    if (this.blinkIntervals[color]) {
      clearInterval(this.blinkIntervals.red);
      this.blinkIntervals.red = null;
    }
  }
}

module.exports = Led;
