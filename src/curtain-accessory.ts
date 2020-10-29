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

export class Curtain implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly bleMac: string;
  private readonly scanDuration: number;

  private currentPosition = 0;
  private targetPosition = 0;
  private positionStatus = 0;

  // This property must be existent!!
  name: string;

  private readonly curtainService: Service;
  private readonly informationService: Service;

  constructor(hap: HAP, log: Logging, name: string, bleMac: string, scanDuration: number) {
    this.log = log;
    this.name = name;
    this.bleMac = bleMac;
    this.scanDuration = scanDuration;

    this.positionStatus = 2;

    this.curtainService = new hap.Service.WindowCovering(name);
    this.curtainService.getCharacteristic(hap.Characteristic.CurrentPosition)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current position of the Curtain was returned: " + this.currentPosition + "%");
        callback(undefined, this.currentPosition);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        log.info("Current position of the Curtain can't be set!");
        callback();
      });

    this.curtainService.getCharacteristic(hap.Characteristic.TargetPosition)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Target position of the Curtain was returned: " + this.targetPosition + "%");
        callback(undefined, this.targetPosition);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        const targetPosition = value as number;
        log.info("Target position of the Curtain setting: " + targetPosition + "%");
        if (targetPosition === this.targetPosition) {
          callback();
        }
        else {
          this.targetPosition = targetPosition;

          const SwitchBot = require('node-switchbot');
          const switchbot = new SwitchBot();
          switchbot.discover({ duration: this.scanDuration, model: 'c', quick: false }).then((device_list: any) => {
            log.info('Scan done.');
            let targetDevice: any = null;
            for (let device of device_list) {
              log.info(device.modelName, device.address);
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
              log.info('The Curtain is moving...');
              return targetDevice.runToPos(this.targetPosition);
            }
          }).then(() => {
            log.info('Done.');
            this.currentPosition = this.targetPosition;
            log.info("Target position of the Curtain has been set to: " + this.targetPosition + "%");
            callback();
          }).catch((error: any) => {
            log.error(error);
            this.targetPosition = this.currentPosition;
            log.info("Target position of the Curtain setting failed!");
            callback();
          });
        }
      });

    this.curtainService.getCharacteristic(hap.Characteristic.PositionState)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("The position state of the Curtain was returned: " + this.positionStatus);
        callback(undefined, this.positionStatus);
      })
      .on(CharacteristicEventTypes.SET, (value: CharacteristicValue, callback: CharacteristicSetCallback) => {
        log.info("The position state of the Curtain can't be set!");
        callback();
      });

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "SwitchBot")
      .setCharacteristic(hap.Characteristic.Model, "SWITCHBOT-CURTAIN-W0701600")
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
      this.curtainService,
    ];
  }

}
