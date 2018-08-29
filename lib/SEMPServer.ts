/**
 * @fileOverview Generates a SSDP Semp description xml file with parameters.
 * @author Paul Orlob
 */

import express from 'express';
import Gateway from "./Gateway";
import {Server} from "http";
import Device2EM, {DeviceInfoType, DeviceStatusType, PlanningRequestType} from "./Device2EM";
import Device from "./Device";
import {js2xml, xml2js} from "xml-js";

class SEMPServer {

    private app: express.Application;
    private server: Server | undefined;

    /**
     * Creates a new SEMP Server instance
     * @param uuid - Globally unique uuid
     * @param ipAddress - ip address of the server
     * @param port - port to run the server on
     * @param descriptionXml Description XML string
     * @param gateway Gateway
     */
    constructor(uuid: string,
                ipAddress: string,
                private port: number,
                private descriptionXml: string,
                private gateway: Gateway) {


        this.app = express();
        this.initRoutes()
    }

    /**
     * Initializes SEMP routes
     */
    private initRoutes(): void {
        this.app.get('/description.xml', (req, res) => {
            res.set('Content-Type', 'text/xml');
            res.send(this.descriptionXml)
        });

        // All devices
        this.app.get('/semp/', (req, res) => {
            console.log("Requested all devices. " + req.url);
            console.log(JSON.stringify(req.query));
            let devices: Device2EM = SEMPServer.convertDevices(this.gateway.getAllDevices());
            res.send(SEMPServer.convertJSToXML(devices))
        });

        this.app.get('*', (req, res) => {
            console.log("GET something...");
            console.log(req.url);
            console.log(JSON.stringify(req.query));
            res.end()
        });

        this.app.post('/semp/', (req, res) => {
            let body: string = "";
            req.on("data", (chunk => {
                body += chunk
            }));
            req.on("end", () => {
                console.log(xml2js(body));
                res.end()
            });
        });
    }

    private static convertJSToXML(js: any): string{
        let rawJs = {
            _declaration: {
                _attributes: {
                    version: "1.0",
                    encoding: "utf-8"
                }
            },
            Device2EM: js
        };
        return js2xml(rawJs, {compact: true, spaces: 4});
    }

    private static convertDevices(devices: Array<Device>): Device2EM {
        let devInfos: Array<DeviceInfoType> = [];
        let devStatuses: Array<DeviceStatusType> = [];
        let devPlanningRequests: Array<PlanningRequestType> = [];

        for (let d of devices) {
            devInfos.push(d.deviceInfo);
            devStatuses.push(d.deviceStatus);
            if (d.planningRequest.Timeframe.length != 0) {
                devPlanningRequests.push(d.planningRequest)
            }
        }

        return {
            _attributes: {
                xmlns: "http://www.sma.de/communication/schema/SEMP/v1"
            },
            DeviceInfo: devInfos,
            DeviceStatus: devStatuses,
            PlanningRequest: devPlanningRequests
        }

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
            if (this.server != null) {
                this.server.close(() => {
                    resolve()
                })
            } else {
                reject()
            }
        })
    }

}

export default SEMPServer;