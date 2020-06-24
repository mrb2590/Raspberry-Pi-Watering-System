# Raspberry Pi Watering System

This program uses the GPIO pins on a Raspberry Pi to control a water pump connected to a water drip irrigation system. There is a button to manually run the timer for the pump along with four LEDs which are used for the current status of the system. There is also a float sensor that will automatically turn off the pump when the water level is low.

## Installation

1. Connect all the sensors and the pump. I will eventually have screenshots and detail that process...

2. Clone the git repo

```bash
git clone https://github.com/mrb2590/Raspberry-Pi-Watering-System.git
```

3. Give execute permissions to watering-system.js

```bash
chmod a+x src/watering-system.js
```

## Installing as a deamon

1. Copy the `watering-system.service` file to `/etc/systemd/system`

```bash
sudo cp watering-system.service /etc/systemd/system/water-system.service
```

2. Enable the service to start at boot

```bash
sudo systemctl enable watering-system
```

## Usage

To run the program manually with the table output

```bash
./src/watering-system.js
```

Use `--quiet` to not use the table output

```bash
./src/watering-system.js --quiet
```

## Todo

I want to eventually have this connect to an API so it can be controlled from the web and smart speakers like Google Home.
