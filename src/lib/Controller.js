const Pump = require('./Pump.js');
const WaterSensor = require('./WaterSensor.js');
const Led = require('./Led.js');
const Button = require('./Button.js');
const Log = require('./Log.js');

class Controller {
  constructor () {
    this.status = 'Initializing';
    this.pump = new Pump;
    this.waterSensor = new WaterSensor;
    this.led = new Led;
    this.button = new Button;
    this.log = new Log;
    this.timerLoop = null;
    this.displayLoop = null;
  }

  listen () {
    process.on('SIGINT', () => {
      this.kill();
    });
    
    this.button.onPressed(() => {
      if (!this.timerLoop) {
        this.runForTime(10000);
      }
    });
    
    this.waterSensor.onCheckWaterLevel((isEmpty) => {
      if (isEmpty) {
        this.status = 'Low water level - waiting for refill';
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
        if (this.status === 'Low water level - waiting for refill') {
          this.status = 'Standby';
        }

        this.led.stopBlink('red');

        if (!this.timerLoop) {
          this.led.powerOff('red');
          this.led.powerOn('green');
        }
      }
    });

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
          key: 'Water Level',
          value: this.waterSensor.getReading()
        },
        {
          key: 'Tank Status',
          value: this.waterSensor.isEmpty() ? 'Empty' : 'Full'
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
        }
      ]);
    }, 500);
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

    if (this.waterSensor.isEmpty()) {
      return;
    }

    // process.stdout.write('Starting pump timer\n');

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
      }
  
      time += 10;
    }, 10);
  }
}

module.exports = Controller;
