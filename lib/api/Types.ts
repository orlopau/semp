interface RESTDeviceType {
    deviceId: string,
    name: string,
    type: string,
    measurementMethod: string,
    interruptionsAllowed: boolean,
    maxPower: number,
    emSignalsAccepted: boolean,
    status: string,
    vendor: string,
    serialNr: string,
    absoluteTimestamps: boolean,
    optionalEnergy: boolean,
    minOnTime?: number,
    minOffTime?: number,
    url?: string
}

export {RESTDeviceType}