module.exports = class LedProgram {
  Gpio = require('onoff').Gpio;
  devices = require('../config/devices.json');
  tickRate = 50;
  mainLoop = null;
  secondaryLoops = [];
  mainInterval = 0;

  constructor () {
    process.on('SIGINT', this.kill);
  }

  initDevices = () => {
    process.stdout.write('Initilizing devices...');
    this.secondaryLoops.push(this.blinkLed('red', 50));

    for (const device in this.devices) {
      for (const pin in this.devices[device].pins) {
        const pinNumber = this.devices[device].pins[pin].pin;
        this.devices[device].pins[pin].gpio = new this.Gpio(pinNumber, 'out');
      }
    }

    const loop = this.secondaryLoops.pop();
    clearInterval(loop);

    this.setLed(0, 0, 0);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Initilizing devices... Done\n');
  }

  run = () => {
    this.initDevices();

    process.stdout.write('Running...\n');
    this.setLed(0, 1, 0);

    // this.devices.waterPump.pins.power.gpio.writeSync(1);

    this.mainLoop = setInterval(() => {

    }, this.tickRate);
  }

  kill = () => {
    process.stdout.write("Cleaning up...");

    this.secondaryLoops.forEach(loop => {
      clearInterval(loop);
    });
    clearInterval(this.mainLoop);

    for (const device in this.devices) {
      for (const pin in this.devices[device].pins) {
        this.devices[device].pins[pin].gpio.writeSync(0);
        this.devices[device].pins[pin].gpio.unexport();
      }
    }

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Cleaning up... Done\n");
  }

  blinkLed = (color, delay) => {
    let interval = 0;

    return setInterval(() => {
      this.devices.rgbLed.pins[color].gpio.writeSync(interval % 2);

      interval++;

      if (interval > 1) {
        interval = 0;
      }
    }, delay);
  }

  setLed = (red, green, blue) => {
    this.devices.rgbLed.pins.red.gpio.writeSync(red);
    this.devices.rgbLed.pins.green.gpio.writeSync(green);
    this.devices.rgbLed.pins.blue.gpio.writeSync(blue);
  }
}
