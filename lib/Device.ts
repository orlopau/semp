import {DeviceInfoType, DeviceStatusType, PlanningRequestType, PowerInfoType, TimeframeType} from "./Device2EM";
import EM2Device from "./EM2Device";
import axios from 'axios'

class Device {
    public deviceInfo: DeviceInfoType;
    public deviceStatus: DeviceStatusType;
    public planningRequest: PlanningRequestType = {
        Timeframe: []
    };
    public hookURL?: string;
    public lastRecommendation?: EM2Device;

    /**
     * Creates new device
     * @param deviceId Device ID. Formatting is explained in SEMP docs
     * @param name Name
     * @param type Type of device: See SEMP docs
     * @param measurementMethod Enum: {Measurement, Estimation, None}
     * @param interruptionsAllowed If device can be interrupted while running
     * @param maxPower Maximum power draw
     * @param emSignalsAccepted If signals of the EM are currently being considered
     * @param status On, Off, Offline
     * @param vendor Vendor
     * @param serialNr Serial Nr of device
     * @param absoluteTimestamps True if device uses absoulte Timestamps since 1970
     * @param optionalEnergy If device can consume more energy than needed (ex. battery)
     * @param minOnTime Minimum time that the device has to stay on
     * @param minOffTime
     * @param url Url to config page or similar
     */
    constructor(deviceId: string, name: string, type: string, measurementMethod: string, interruptionsAllowed: boolean,
                maxPower: number, emSignalsAccepted: boolean, status: string, vendor: string, serialNr: string, absoluteTimestamps: boolean,
                optionalEnergy: boolean = false, minOnTime?: number, minOffTime?: number, url?: string) {

        this.deviceInfo = {
            Identification: {
                DeviceId: deviceId,
                DeviceName: name,
                DeviceType: type,
                DeviceSerial: serialNr,
                DeviceVendor: vendor
            },
            Characteristics: {
                MaxPowerConsumption: maxPower
            },
            Capabilities: {
                CurrentPower: {Method: measurementMethod},
                Timestamps: {AbsoluteTimestamps: absoluteTimestamps},
                Interruptions: {InterruptionsAllowed: interruptionsAllowed},
                Requests: {OptionalEnergy: optionalEnergy},
            }
        };

        if (url) {
            this.deviceInfo.Identification.DeviceURL = url
        }
        if (minOnTime) {
            this.deviceInfo.Characteristics.MinOnTime = minOnTime
        }
        if (minOffTime) {
            this.deviceInfo.Characteristics.MinOffTime = minOffTime
        }


        this.deviceStatus = {
            DeviceId: deviceId,
            EMSignalsAccepted: emSignalsAccepted,
            Status: status,
        };
    }

    /**
     * Schedules a run
     * @param earliestStart relative time from now that the operation should min start in seconds
     * @param latestEnd relative time from now that the operation has to be finished in seconds
     * @param minRunTime minimum runtime in seconds
     * @param maxRunTime maximum runtime in seconds
     */
    addPlanningRequest(earliestStart: number, latestEnd: number, minRunTime: number, maxRunTime: number): void {
        if (minRunTime > maxRunTime) {
            throw Error("Min run time cant be greater than max run time!");
        }

        for (let frame of this.planningRequest.Timeframe) {
            if (latestEnd < frame.LatestEnd && latestEnd > frame.EarliestStart || earliestStart < frame.LatestEnd && earliestStart > frame.EarliestStart) {
                throw Error("Overlapping timefres arent valid!")
            }
        }

        let timeframe: TimeframeType = {
            DeviceId: this.deviceInfo.Identification.DeviceId,
            EarliestStart: earliestStart,
            LatestEnd: latestEnd,
            MinRunningTime: minRunTime,
            MaxRunningTime: maxRunTime
        };

        this.planningRequest.Timeframe.push(timeframe);
    }

    /**
     * Clears all planning requests
     */
    clearPlanningRequests(): void {
        this.planningRequest.Timeframe = []
    }

    getPlanningRequests(): TimeframeType[] {
        return this.planningRequest.Timeframe
    }

    /**
     * Sets average power of last 60s interval
     * @param watts Power in W
     * @param minPower minimum power in interval
     * @param maxPower maximum power in interval
     */
    setLastPower(watts: number, minPower?: number, maxPower?: number) {
        let powerInfo: PowerInfoType = {
            AveragePower: watts,
            Timestamp: 0,
            AveragingInterval: 60
        };

        if (maxPower) {
            powerInfo.MaxPower = maxPower
        }
        if (minPower) {
            powerInfo.MinPower = minPower;
        }

        this.deviceStatus.PowerConsumption = {
            PowerInfo: [powerInfo]
        };

        if (watts > 0) {
            this.deviceStatus.Status = "On"
        } else {
            this.deviceStatus.Status = "Off"
        }
    }

    sendEMRecommendation(em2dev: EM2Device): void {
        console.log("Send recommendation " + JSON.stringify(em2dev));
        this.lastRecommendation = em2dev;
        if(this.hookURL){
            axios.post(this.hookURL, em2dev).catch((err) => {
                console.log("Error while sending to hookURL " + err)
            })
        }
    }

    private static timeSecs(): number {
        return Math.round(new Date().getTime() / 1000)
    }
}

export default Device