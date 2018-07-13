/**
 * @fileOverview Generates a SSDP Semp description xml file with parameters.
 * @author Paul Orlob
 * @module DescriptionGenerator
 */

class DescriptionGenerator {

    /**
     * Generates an xml description
     * @static
     * @method
     * @public
     * @param {string} uuid - A globally unique uuid
     * @param {string} serialNumber - serial number for gateway
     * @param {string} serverAddress - Server address to write in description
     * @param {string} friendlyName - gateway name
     * @param {string} manufacturer - manufacturer name
     * @param {string} basePath - Base path for semp requests
     * @returns {string} - Description xml
     * @throws {TypeError} if uuid or server address are not specified
     * @example
     * generateDescription("2fac1234-31f8-11b4-a222-08002b34c003",
     *      "http://192.168.188.23:8080",
     *      "gateway", "testManufacturer", "/semp")
     */
    static generateDescription(
        uuid,
        serialNumber,
        serverAddress,
        friendlyName = "Semp Gateway",
        manufacturer = "NodeJS Gateway",
        basePath = '/semp'){

        if(!uuid){
            throw new TypeError("uuid must be specified!")
        }
        if(!serverAddress){
            throw new TypeError("server address must be specified!")
        }

        // noinspection UnnecessaryLocalVariableJS
        let xmlString = "<?xml version=\"1.0\"?>\n" +
            "<root xmlns=\"urn:schemas-upnp-org:device-1-0\">\n" +
                "<specVersion>\n" +
                    "<major>1</major>\n" +
                    "<minor>0</minor>\n" +
                "</specVersion>\n" +
                "<device>\n" +
                    "<deviceType>\n" +
                        "urn:schemas-simple-energy-management-protocol:device:Gateway:1\n" +
                    "</deviceType>\n" +
                    "<friendlyName>" + friendlyName + "</friendlyName>\n" +
                    "<manufacturer>" + manufacturer + "</manufacturer>\n" +
                    "<manufacturerURL>https://github.com/orlopau/semp</manufacturerURL>\n" +
                    "<modelDescription>Semp NodeJS Gateway</modelDescription>\n" +
                    "<modelName>Semp Gateway</modelName>\n" +
                    "<modelNumber>1.0.0</modelNumber>\n" +
                    "<modelURL>https://github.com/orlopau/semp</modelURL>\n" +
                    "<serialNumber>" + serialNumber + "</serialNumber>\n" +
                    "<UDN>uuid:" + uuid + "</UDN>\n" +

                    "<serviceList>\n" +
                        "<service>\n" +
                        "<serviceType>\n" +
                            "urn:schemas-simple-energy-management-protocol:service:NULL:1:service:NULL:1\n" +
                        "</serviceType>\n" +
                        "<serviceId>\n" +
                            "urn:schemas-simple-energy-management-protocol:serviceId:NULL:serviceId:NULL\n" +
                        "</serviceId>\n" +
                        "<SCPDURL>/XD/NULL.xml</SCPDURL>\n" +
                        "<controlURL>/UD/?0</controlURL>\n" +
                        "<eventSubURL></eventSubURL>\n" +
                        "</service>\n" +
                    "</serviceList>\n" +
                    "<presentationURL>index.html</presentationURL>\n" +

                    "<semp:X_SEMPSERVICE\n" +
                        "xmlns:semp=\"urn:schemas-simple-energy-management-protocol:service-1-0\">\n" +
                        " <semp:server>" + serverAddress + "</semp:server>\n" +
                        " <semp:basePath>" + basePath + "</semp:basePath>\n" +
                        " <semp:transport>HTTP/Pull</semp:transport>\n" +
                        " <semp:exchangeFormat>XML</semp:exchangeFormat>\n" +
                        " <semp:wsVersion>1.1.0</semp:wsVersion>\n" +
                    "</semp:X_SEMPSERVICE>\n" +
                "</device>\n" +
            "</root>";

        return xmlString;
    }
}

module.exports = DescriptionGenerator;