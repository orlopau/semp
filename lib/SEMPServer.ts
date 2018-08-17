/**
 * @fileOverview Generates a SSDP Semp description xml file with parameters.
 * @author Paul Orlob
 */

import express from 'express';
import DescriptionGenerator from './DescriptionGenerator';
import SSDPServer from './SSDPServer';
import * as http from "http";

class SEMPServer {

    private readonly descriptionXml: string;
    private app: express.Application;
    private server: http.Server | undefined;
    private ssdpServer: SSDPServer;

    /**
     * Creates a new SEMP Server instance
     * @param uuid - Globally unique uuid
     * @param ipAddress - ip address of the server
     * @param port - port to run the server on
     * @param friendlyName - friendly name for ssdp description, defaults to "Semp Gateway"
     * @param manufacturer - manufacturer for ssdp description, defaults to "NodeJS Gateway"
     */
    constructor(uuid: string,
                ipAddress: string,
                public port: number,
                friendlyName: string = "Semp Gateway",
                manufacturer: string = "NodeJS Gateway") {

        this.descriptionXml = DescriptionGenerator.generateDescription(uuid, "http://" + ipAddress + ":" + port, friendlyName, manufacturer);

        this.app = express();

        this.ssdpServer = new SSDPServer("http://" + ipAddress + ":" + port + "/description.xml", uuid);
        this.ssdpServer.start();

        this.initRoutes()
    }

    /**
     * Initializes REST routes
     */
    private initRoutes(): void {
        this.app.get('/description.xml', (req, res) => {
            console.log("Requested description!");
            res.set('Content-Type', 'text/xml');
            res.send(this.descriptionXml)
        });

        this.app.get('*', (req, res) => {
           console.log(req.url);
           console.log("Requested something...");
           res.end()
        });

        this.app.post('*', (req, res) => {
            console.log(req.body);
            console.log("Requested something...");
            res.end()
        });
    }

    /**
     * Start the server.
     * @returns promise that resolves when server has started.
     */
    start(): Promise<void> {
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
     * @returns promise that resolves when the server is stopped.
     */
    stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(this.server != null){
                this.server.close(() => {
                    resolve()
                })
            }else{
                reject()
            }
        })
    }

}

export default SEMPServer;