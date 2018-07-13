/**
 * @fileOverview Generates a SSDP Semp description xml file with parameters.
 * @author Paul Orlob
 * @module SEMPServer
 */


const express = require('express');
const DescriptionGenerator = require('./DescriptionGenerator');
const SSDPServer = require('./SSDPServer');

class SEMPServer {

    /**
     * Creates a new SEMP Server instance
     * @constructor
     * @alias SEMPServer.constructor
     * @param {string} uuid - Globally unique uuid
     * @param {string }serialNumber - serialNumber for gateway
     * @param {(string|number)} ipAddress - ip address of the server
     * @param {string} port - port to run the server on
     * @param {string} friendlyName - friendly name for ssdp description, defaults to "Semp Gateway"
     * @param {string} manufacturer - manufacturer for ssdp description, defaults to "NodeJS Gateway"
     */
    constructor(uuid,
                serialNumber,
                ipAddress,
                port,
                friendlyName = "Semp Gateway",
                manufacturer = "NodeJS Gateway") {

        this.descriptionXml = DescriptionGenerator.generateDescription(uuid, serialNumber, "http://" + ipAddress + ":" + port, friendlyName, manufacturer);
        this.port = port;

        this.app = express();

        this.ssdpServer = new SSDPServer("http://" + ipAddress + ":" + port + "/description.xml", uuid);
        this.ssdpServer.start();

        this._initRoutes()
    }

    /**
     * Initializes REST routes
     * @private
     */
    _initRoutes() {
        this.app.get('/description.xml', (req, res) => {
            console.log("Requested description!");
            res.set('Content-Type', 'text/xml');
            res.send(this.descriptionXml)
        })
    }

    /**
     * Start the server.
     * @public
     * @async
     * @method
     * @returns {Promise} promise that resolves when server has started.
     */
    start() {
        if (!this.port) {
            throw TypeError("Port must be specified!")
        }
        if (this.port < 0) {
            throw TypeError("Port has to be greater than 0!")
        }

        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, () => {
                console.log("SEMP server listening on " + this.port);
                resolve()
            })
        });
    }

    /**
     * Stops the server.
     * @public
     * @async
     * @method
     * @returns {Promise} promise that resolves when the server is stopped.
     */
    stop() {
        return new Promise((resolve, reject) => {
            this.server.close(() => {
                resolve()
            })
        })
    }

}

/**
 * @see SEMPServer.constructor
 * @type {SEMPServer.constructor}
 */
module.exports = SEMPServer;