class Pump {
  constructor () {
    this.init();
  }

  init () {
    process.stdout.write('Initializing pump... ');
    this.Gpio = require('onoff').Gpio;
    this.pin = new this.Gpio(17, 'out');
    this.state = 'off';
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
}

module.exports = Pump;
