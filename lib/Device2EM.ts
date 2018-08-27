/**
 * For documentation, download the SEMP docs from SMA.
 */
interface Device2EM {
    DeviceInfo: Array<DeviceInfoType>,
    DeviceStatus: Array<DeviceStatusType>,
    PlanningRequest: Array<PlanningRequestType>
}

interface DeviceInfoType {
    Identification: IdentificationType,
    Characteristics: CharacteristicsType,
    Capabilities: CapabilitiesType
}

interface IdentificationType {
    DeviceId: string,
    DeviceName: string,
    DeviceType: string,
    DeviceSerial: string,
    DeviceVendor: string,
    DeviceURL?: string
}

interface CharacteristicsType {
    MaxPowerConsumption: number,
    MinOnTime?: number,
    MinOffTime?: number
}

interface CapabilitiesType {
    CurrentPower: CapPowerMeasurementType,
    Timestamps?: CapTimestampType,
    Interruptions?: CapInterruptionsType,
    Requests?: CapRequestsType
}

interface CapPowerMeasurementType {
    Method: string
}

interface CapTimestampType {
    AbsoluteTimestamps: boolean
}

interface CapInterruptionsType {
    InterruptionsAllowed: boolean
}

interface CapRequestsType {
    OptionalEnergy: boolean
}

interface DeviceStatusType {
    DeviceId: string,
    EMSignalsAccepted: boolean,
    Status: string,
    ErrorCode?: number,
    PowerConsumption?: PowerConsumptionType
}

interface PowerConsumptionType {
    PowerInfo: Array<PowerInfoType>
}

interface PowerInfoType {
    AveragePower: number,
    MinPower?: number,
    MaxPower?: number,
    Timestamp: number,
    AveragingInterval: number
}

interface PlanningRequestType {
    Timeframe: Array<TimeframeType>
}

interface TimeframeType {
    DeviceId: string,
    EarliestStart: number,
    LatestEnd: number,
    MaxRunningTime: number
}

export default Device2EM;
export {DeviceInfoType, DeviceStatusType, PlanningRequestType}