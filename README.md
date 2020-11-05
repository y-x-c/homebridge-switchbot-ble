<span align="center">

# @switchbot/homebridge-switchbot-ble

[![npm version](https://badgen.net/npm/v/@switchbot/homebridge-switchbot-ble)](https://www.npmjs.com/package/@switchbot/homebridge-switchbot-ble)
[![npm downloads](https://badgen.net/npm/dt/@switchbot/homebridge-switchbot-ble)](https://www.npmjs.com/package/@switchbot/homebridge-switchbot-ble)

</span>

The @switchbot/homebridge-switchbot-bleswitchbot is a nodejs module , and also a homebridge plug-in that directly controls SwitchBot products via BLE.

Now supports:
 * [SwitchBot (Bot)](https://www.switch-bot.com/products/switchbot-bot)
 * [SwitchBot Curtain(Curtain)](https://www.switch-bot.com/products/switchbot-curtain)


## Installation
### Installing bluetooth libraries
##### Ubuntu, Debian, Raspbian
```sh
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```
See the document of the [@abandonware/noble](https://github.com/abandonware/noble#readme) for other operating systems details.

### Installing package
```sh
sudo npm install -g @switchbot/homebridge-switchbot-ble
```
You can also install it on the homebridge plugins page.
![homebridge-plugins-search](image/homebridge-plugins-search.png)

## Configuration
Add this to your homebridge `config.json` file
```json
"platforms": [
    {
        "platform": "SwitchBotPlatform",
        "name": "SwitchBotPlatform"
    }
]
```
If it work, add devices.
```json
"platforms": [
    {
        "platform": "SwitchBotPlatform",
        "name": "SwitchBotPlatform",
        "devices": [
            {
                "type": "bot",
                "name": "Bot 2c",
                "bleMac": "d4:cc:43:97:ae:2c"
            },
            {
                "type": "bot",
                "name": "Bot 51",
                "bleMac": "e7:4d:36:cf:9e:51",
                "scanDuration": 2000
            },
            {
                "type": "curtain",
                "name": "Curtain 11",
                "bleMac": "ec:58:c5:d0:01:11",
                "scanDuration": 2000,
                "reverseDir": false
            }
        ]
    }
]
```

**Requird Settings**
* `devices` - SwitchBot devices list.
* `type` - Device type. Currently only supports `bot` and `curtain`.
* `name` - Device name.
* `bleMac` - Device mac address. You can find it in App settings.

**Optional Settings**
* `scanDuration` - Scan timeout. BLE Central must first scan the advertising. Default is `1000`(unit: ms). Longer time to ensure device discovery but slower response.
* `reverseDir` - Set to `true` to exchange the "opened" and "closed" directions of Curtain after calibration. Default is `false`. So you can swap the directions without recalibration.

## Release-Note
* v1.1.0 (2020-10-29)
  * Add support for Curtain.
* v1.0.1 (2020-10-22)
  * First public release, supports Bot.

## Community

* [SwitchBot (Official website)](https://www.switch-bot.com/)
* [Facebook @SwitchBotRobot](https://www.facebook.com/SwitchBotRobot/) 
* [Twitter @SwitchBot](https://twitter.com/switchbot) 
