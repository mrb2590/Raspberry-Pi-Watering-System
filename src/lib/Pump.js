const Gpio = require('onoff').Gpio;

class Pump {
  constructor () {
    this.state = 'off';
    this.init();
  }

  init () {
    process.stdout.write('Initializing pump... ');

    this.pin = new Gpio(26, 'out');

    process.stdout.write('Done\n');
  }

  kill () {
    process.stdout.write('Killing pump... ');

    this.pin.writeSync(0);
    this.pin.unexport();
    this.state = 'off';

    process.stdout.write('Done\n');
  }

  powerOn () {
    process.stdout.write('Powering on pump... ');

    this.pin.writeSync(1);
    this.state = 'on';

    process.stdout.write('Done\n');
  }

  powerOff () {
    process.stdout.write('Powering off pump... ');

    this.pin.writeSync(0);
    this.state = 'off';

    process.stdout.write('Done\n');
  }

  getState () {
    return this.state;
  }
}

module.exports = Pump;
