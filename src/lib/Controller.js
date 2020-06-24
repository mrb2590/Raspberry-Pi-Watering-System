const Pump = require('./Pump.js');
const WaterSensor = require('./WaterSensor.js');
const Led = require('./Led.js');
const Button = require('./Button.js');
const Log = require('./Log.js');

class Controller {
  constructor (hideOutput) {
    this.hideOutput = hideOutput;
    this.status = 'Initializing';
    this.pump = new Pump;
    this.waterSensor = new WaterSensor;
    this.led = new Led;
    this.button = new Button;
    this.log = new Log;
    this.timerLoop = null;
    this.displayLoop = null;
    this.timeLeft = 0;
    this.timeToRun = 10000;
    this.tickRate = 250;
    this.status = 'Ok';
  }

  listen () {
    // process.on('SIGINT', () => {
      // this.kill();
    // });
    ['SIGINT', 'SIGTERM', 'SIGQUIT']
      .forEach(signal => process.on(signal, () => {
          this.kill();
      }));

    this.button.onPressed(() => {
      if (!this.timerLoop) {
        this.runForTime(this.timeToRun);
        this.timeLeft = this.timeToRun;
      }
    });

    this.waterSensor.onCheckWaterLevel((hasLowWaterLevel) => {
      if (hasLowWaterLevel) {
        this.status = 'Waiting for more water';
        this.timeLeft = 0;
        this.led.powerOff('green');

        if (this.pump.getState() === 'On') {
          this.pump.powerOff();
        }

        if (this.timerLoop) {
          clearInterval(this.timerLoop);

          this.timerLoop = null;

          this.led.powerOff('red');
          this.led.powerOff('yellow');
          this.led.powerOff('green');
        }

        if (!this.led.getBlinkInterval('red')) {
          this.led.blink('red', 250);
        }
      } else {
        if (this.status !== 'Running timer') {
          this.status = 'Ok';
        }

        this.led.stopBlink('red');

        if (!this.timerLoop) {
          this.led.powerOff('red');
          this.led.powerOn('green');
        }
      }
    });

    if (!this.hideOutput) {
      this.displayLoop = setInterval(() => {
        this.log.writeStdOut([
          {
            key: 'System Status',
            value: this.status
          },
          {
            key: 'Pump',
            value: this.pump.getState()
          },
          {
            key: 'Tank Status',
            value: this.waterSensor.hasLowWaterLevel() ? 'Empty' : 'Has Water'
          },
          {
            key: 'Red LED',
            value: this.led.getState('red')
          },
          {
            key: 'Yellow LED',
            value: this.led.getState('yellow')
          },
          {
            key: 'Green LED',
            value: this.led.getState('green')
          },
          {
            key: 'Timer',
            value: this.milConvert(this.timeLeft)
          }
        ]);

        if (this.timeLeft !== 0) {
          this.timeLeft -= this.tickRate;
        }
      }, this.tickRate);
    }
  }

  kill () {
    this.status = 'Killing';

    if (this.timerLoop) {
      clearTimeout(this.timerLoop);
      this.timerLoop = null;
    }

    if (this.displayLoop) {
      clearTimeout(this.displayLoop);
      this.displayLoop = null;
    }

    this.button.kill();
    this.pump.kill();
    this.waterSensor.kill();
    this.led.kill();
  }

  runForTime (endTime) {
    this.status = 'Running timer';
    let time = 0;

    if (this.waterSensor.hasLowWaterLevel()) {
      return;
    }

    this.pump.powerOn();

    this.timerLoop = setInterval(() => {
      const timeSection = Math.floor(endTime / 3);

      if (time >= 0 && time < timeSection) {
        this.led.powerOn('red');
        this.led.powerOn('yellow');
        this.led.powerOn('green');
      } else if (time >= timeSection && time  < timeSection * 2) {
        this.led.powerOn('red');
        this.led.powerOn('yellow');
        this.led.powerOff('green');
      } else {
        this.led.powerOn('red');
        this.led.powerOff('yellow');
        this.led.powerOff('green');
      }

      if (time >= endTime) {
        if (this.pump.getState() === 'On') {
          this.pump.powerOff();
        }

        this.led.powerOff('red');
        this.led.powerOff('yellow');
        this.led.powerOff('green');

        clearInterval(this.timerLoop);
        this.timerLoop = null;
        this.status = 'Ok';
      }

      time += 10;
    }, 10);
  }

  milConvert (mil) {
    if (mil === 0) {
      return '0:00';
    }

    let minutes = Math.floor(mil / 60000);
    let seconds = ((mil % 60000) / 1000).toFixed(0);

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
}

module.exports = Controller;
