// @ts-ignore
const nodeSSDP = require('node-ssdp').Server;

class SSDPServer{

    private ssdp: any;

    constructor(descriptionURL: string, uniqueDeviceName: string) {
        if(descriptionURL == null || descriptionURL === ""){
            throw new TypeError("Description url cant be empty!")
        }

        // @ts-ignore
        this.ssdp = new nodeSSDP({
            location: descriptionURL,
            udn: "uuid:" + uniqueDeviceName,
            adInterval: 20000
        });
        // @ts-ignore
        this.ssdp.addUSN("upnp:rootdevice");
        // @ts-ignore
        this.ssdp.addUSN(uniqueDeviceName);
        // @ts-ignore
        this.ssdp.addUSN("urn:schemas-simple-energy-management-protocol:device:Gateway:1")
    }

    start(): void{
        // @ts-ignore
        this.ssdp.start()
    }

    stop(): void{
        // @ts-ignore
        this.ssdp.stop()
    }

}

export default SSDPServer

