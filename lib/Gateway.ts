import SSDPServer from "./SSDPServer";
import SEMPServer from "./SEMPServer";
import DescriptionGenerator from "./DescriptionGenerator";
import Device from "./Device";
import Api from "./api/Api";

class Gateway {
    private ssdpServer: SSDPServer;
    private sempServer: SEMPServer;
    private api: Api;

    private devices: Map<string, Device> = new Map<string, Device>();

    constructor(deviceName: string, uuid: string, ipAddress: string, sempPort: number, restPort: number, friendlyName: string = "SEMP Gateway", manufacturer: string = "OpenSource Gateway") {
        this.ssdpServer = new SSDPServer("http://" + ipAddress + ":" + sempPort + "/description.xml", uuid);

        let descriptionXml: string = DescriptionGenerator.generateDescription(uuid, "http://" + ipAddress + ":" + sempPort, friendlyName, manufacturer);
        this.sempServer = new SEMPServer(uuid, ipAddress, sempPort, descriptionXml, this);

        this.api = new Api(restPort, this);
    }

    async start(){
        try{
            await this.sempServer.start();
            await this.ssdpServer.start();
            await this.api.start();
        }catch (e) {
            console.log("Error while starting gateway! " + e)
        }
    }

    async stop() {
        try{
            await this.sempServer.stop();
            await this.ssdpServer.stop();
            await this.api.stop();
        } catch (e) {
            console.log("Couldnt stop gateway! " + e)
        }
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
    getAllDevices(): Array<Device> {
        let ds: Array<Device> = [];
        for (let d of this.devices.values()) {
            ds.push(d)
        }
        return ds
    }

    /**
     * Deletes device
     * @param id ID of device
     */
    deleteDevice(id: string): boolean {
        return this.devices.delete(id)
    }

    /**
     * Deletes all devices
     */
    deleteAllDevices(): void {
        this.devices.clear()
    }

}

export default Gateway