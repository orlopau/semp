/**
 * @fileOverview Generates a SSDP Semp description xml file with parameters.
 * @author Paul Orlob
 * @module DescriptionGenerator
 */

class DescriptionGenerator {

    /**
     * Generates an xml description
     * @param {string} uuid - A globally unique uuid
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
        uuid: string,
        serverAddress: string,
        friendlyName: string = "Semp Gateway",
        manufacturer: string = "NodeJS Gateway",
        basePath: string = '/semp'): string{

        if(!uuid){
            throw new TypeError("uuid must be specified!")
        }
        if(!serverAddress){
            throw new TypeError("server address must be specified!")
        }

        // noinspection UnnecessaryLocalVariableJS
        let xmlString: string = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n" +
            "<root xmlns=\"urn:schemas-upnp-org:device-1-0\">\n" +
                "<specVersion>\n" +
                    "<major>1</major>\n" +
                    "<minor>0</minor>\n" +
                "</specVersion>\n" +
                "<device>\n" +
                    "<deviceType>urn:schemas-upnp-org:device:Basic:1</deviceType>\n" +
                    "<friendlyName>" + friendlyName + "</friendlyName>\n" +
                    "<manufacturer>" + manufacturer + "</manufacturer>\n" +
                    "<modelName>Semp Gateway</modelName>\n" +
                    "<UDN>uuid:" + uuid + "</UDN>\n" +
                    "<serviceList/>\n" +
                    "<semp:X_SEMPSERVICE xmlns:semp=\"urn:schemas-simple-energy-management-protocol:service-1-0\">\n" +
                        "<semp:server>" + serverAddress + "</semp:server>\n" +
                        "<semp:basePath>" + basePath + "</semp:basePath>\n" +
                        "<semp:transport>HTTP/Pull</semp:transport>\n" +
                        "<semp:exchangeFormat>XML</semp:exchangeFormat>\n" +
                        "<semp:wsVersion>1.1.5</semp:wsVersion>\n" +
                    "</semp:X_SEMPSERVICE>\n" +
                "</device>\n" +
            "</root>";

        return xmlString;
    }
}

export default DescriptionGenerator;