import Device from "../Device";
import {RESTDeviceType} from "./Types";

function device2RESTDevice(device: Device): RESTDeviceType {
    let absoluteTimestamps: boolean = false;
    if (device.deviceInfo.Capabilities.Timestamps != undefined) {
        absoluteTimestamps = device.deviceInfo.Capabilities.Timestamps.AbsoluteTimestamps
    }

    let interruptionsAllowed: boolean = false;
    if (device.deviceInfo.Capabilities.Interruptions != undefined) {
        interruptionsAllowed = device.deviceInfo.Capabilities.Interruptions.InterruptionsAllowed
    }

    let optionalEnergy: boolean = false;
    if (device.deviceInfo.Capabilities.Requests != undefined) {
        optionalEnergy = device.deviceInfo.Capabilities.Requests.OptionalEnergy
    }

    let dt: RESTDeviceType = {
        absoluteTimestamps: absoluteTimestamps,
        deviceId: device.deviceInfo.Identification.DeviceId,
        emSignalsAccepted: device.deviceStatus.EMSignalsAccepted,
        interruptionsAllowed: interruptionsAllowed,
        maxPower: device.deviceInfo.Characteristics.MaxPowerConsumption,
        measurementMethod: device.deviceInfo.Capabilities.CurrentPower.Method,
        name: device.deviceInfo.Identification.DeviceName,
        serialNr: device.deviceInfo.Identification.DeviceSerial,
        status: device.deviceStatus.Status,
        type: device.deviceInfo.Identification.DeviceType,
        vendor: device.deviceInfo.Identification.DeviceVendor,
        optionalEnergy: optionalEnergy,
    };

    if(device.deviceInfo.Characteristics.MinOnTime){
        dt.minOnTime = device.deviceInfo.Characteristics.MinOnTime
    }
    if(device.deviceInfo.Characteristics.MinOffTime){
        dt.minOffTime = device.deviceInfo.Characteristics.MinOffTime
    }
    if(device.deviceInfo.Identification.DeviceURL){
        dt.url = device.deviceInfo.Identification.DeviceURL
    }

    return dt
}

interface returnData{
    status: number,
    msg: string,
    data?: object
}

function createResponse(code: number, msg: string, data?: object){

    let x: returnData = {
        status: code,
        msg: msg,
    };

    if(data){
        x.data = data
    }

    return x;
}

export default {createResponse, device2RESTDevice}