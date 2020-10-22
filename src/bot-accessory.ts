import {
  AccessoryPlugin,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service,
  CharacteristicEventTypes
} from "homebridge";
import { rejects } from "assert";

const SwitchBot = require('node-switchbot');
const switchbot = new SwitchBot();

export class Bot implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly bleMac: string;
  private readonly scanDuration: number;

  private switchOn = false;

  // This property must be existent!!
  name: string;

  private readonly switchService: Service;
  private readonly informationService: Service;

  constructor(hap: HAP, log: Logging, name: string, bleMac: string, scanDuration: number) {
    this.log = log;
    this.name = name;
    this.bleMac = bleMac;
    this.scanDuration = scanDuration;

    this.switchService = new hap.Service.Switch(name);
    this.switchService.getCharacteristic(hap.Characteristic.On)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current state of the switch was returned: " + (this.switchOn ? "ON" : "OFF"));
        callback(undefined, this.switchOn);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        const targetState = value as boolean;
        switchbot.discover({ duration: this.scanDuration, model: 'H', quick: false }).then((device_list: any) => {
          log.info('Scan done.');
          let targetDevice: any = null;
          for (let device of device_list) {
            // log.info(device.modelName, device.address);
            if (device.address == this.bleMac) {
              targetDevice = device;
              break;
            }
          }
          if (!targetDevice) {
            log.info('No device was found.');
            return new Promise((resolve, reject) => {
              reject(new Error('No device was found.'));
            });
          }
          else {
            log.info(targetDevice.modelName + ' (' + targetDevice.address + ') was found.');
            // Set event handers
            targetDevice.onconnect = () => {
              // log.info('Connected.');
            };
            targetDevice.ondisconnect = () => {
              // log.info('Disconnected.');
            };
            log.info('Pressing the switch...');
            return targetDevice.press();
          }
        }).then(() => {
          log.info('Done.');
          this.switchOn = value as boolean;
          log.info("Switch state has been set to: " + (this.switchOn ? "ON" : "OFF"));
          callback();
        }).catch((error: any) => {
          log.info("Switch state setting failed: " + (value ? "ON" : "OFF"));
          log.error(error);
          callback();
        });
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "SwitchBot")
      .setCharacteristic(hap.Characteristic.Model, "SWITCHBOT-S1")
      .setCharacteristic(hap.Characteristic.SerialNumber, this.bleMac);

    log.info("Example switch '%s' created!", name);
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log.info("Identify!");
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.switchService,
    ];
  }

}
