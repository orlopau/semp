import SSDPServer from "./SSDPServer";
import SEMPServer from "./SEMPServer";
import DescriptionGenerator from "./DescriptionGenerator";
import Device from "./Device";

class Gateway {
    private ssdpServer: SSDPServer;
    private sempServer: SEMPServer;

    private devices: Map<string, Device> = new Map<string, Device>();

    constructor(deviceName: string, uuid: string, ipAddress: string, port: number, friendlyName: string = "SEMP Gateway", manufacturer: string = "OpenSource Gateway") {
        this.ssdpServer = new SSDPServer("http://" + ipAddress + ":" + port + "/description.xml", uuid);

        let descriptionXml: string = DescriptionGenerator.generateDescription(uuid, "http://" + ipAddress + ":" + port, friendlyName, manufacturer);
        this.sempServer = new SEMPServer(uuid, ipAddress, port, descriptionXml, this);

    }

    start(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.sempServer.start().then(() => {
                console.log("SEMP Server started! Starting SSDP Server...");
                this.ssdpServer.start();
                resolve();
            }).catch((err) => {
                console.log("Error while starting SEMP Server! " + err);
                reject(err);
            });
        })
    }

    /**
     * Adds/Replaces device
     * @param id ID of device
     * @param device Device
     */
    setDevice(id: string, device: Device): void {
        this.devices.set(id, device)
    }

    /**
     * Retrieves device
     * @param id ID of device
     */
    getDevice(id: string): Device | undefined {
        return this.devices.get(id);
    }

    /**
     * Retrieves all devices
     */
    getAllDevices(): Array<Device>{
        let ds: Array<Device> = [];
        for (let d of this.devices.values()){
            ds.push(d)
        }
        return ds
    }
}

export default Gateway