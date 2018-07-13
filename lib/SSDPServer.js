const Ssdp = require('node-ssdp').Server;

class SSDPServer{

    constructor(descriptionURL, uniqueDeviceName = "f40c2981-7329-40b7-8b04-27f187aecfb5") {
        if(descriptionURL == null || descriptionURL === ""){
            throw new TypeError("Description url cant be empty!")
        }

        this.ssdp = new Ssdp({
            location: descriptionURL,
            udn: "uuid:" + uniqueDeviceName,
            adInterval: 20000
        });
        this.ssdp.addUSN('upnp:rootdevice');
        this.ssdp.addUSN(uniqueDeviceName);
        this.ssdp.addUSN('urn:schemas-simple-energymanagement-protocol:device:Gateway:1')
    }

    start(){
        this.ssdp.start()
    }

    stop(){
        this.ssdp.stop()
    }
}

/**
 * @type {SSDPServer}
 */
module.exports = SSDPServer;

