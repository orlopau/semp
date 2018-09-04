interface DeviceControlType {
    DeviceId: string,
    On: boolean,
    RecommendedPowerConsumption: number,
    Timestamp: number
}

interface EM2Device{
    DeviceControl: DeviceControlType
}

export default EM2Device