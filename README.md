<span align="center">

# @switchbot/homebridge-switchbot-ble

[![npm version](https://badgen.net/npm/v/@switchbot/homebridge-switchbot-ble)](https://www.npmjs.com/package/@switchbot/homebridge-switchbot-ble)
[![npm downloads](https://badgen.net/npm/dt/@switchbot/homebridge-switchbot-ble)](https://www.npmjs.com/package/@switchbot/homebridge-switchbot-ble)

</span>


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
            }
        ]
    }
]
```

**Requird Settings**
* `devices` - SwitchBot devices list.
* `type` - Device type. Currently only `bot` is supported.
* `name` - Device name.
* `bleMac` - Device mac address. You can find it in App settings.

**Optional Settings**
* `scanDuration` - Scan timeout. BLE Central must first scan the advertising. Default is `1000`(unit: ms). Longer time to ensure device discovery but slower response.
