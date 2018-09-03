import express from 'express'
import Gateway from "../Gateway";
import {Server} from "http";
import Device from "../Device";
import util from './Util'

class Api {
    public app: express.Application;
    private server: Server | undefined;
    private readonly router: express.Router;

    constructor(private port: number, private gateway: Gateway) {
        this.app = express();
        this.app.use(express.json());
        this.router = express.Router();
        this.app.use("/api", this.router);
        this.initRoutes()
    }

    private initRoutes(): void {
        this.router.param('id', (req, res, next, id) => {
            let d = this.gateway.getDevice(id);
            if (d || req.method == "PUT") {
                req.params.device = d;
                return next()
            } else {
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
        });

        // All devices
        this.router.get("/devices", (req, res) => {
            let devices = this.gateway.getAllDevices();
            res.json(util.createResponse(200, "OK", devices.map(d => util.device2RESTDevice(d))));
        });

        // Single device
        this.router.route("/devices/:id").get((req, res) => {
            res.json(util.createResponse(200, "OK", util.device2RESTDevice(req.params.device)))
        }).delete((req, res) => {
            this.gateway.deleteDevice(req.params.id);
            res.json(util.createResponse(200, "OK"))
        }).put((req, res) => {
            let d: Device;

            try {
                let b = req.body.device;
                d = new Device(b.deviceId, b.name, b.type, b.measurementMethod, b.interruptionsAllowed, b.maxPower,
                    b.emSignalsAccepted, b.status, b.vendor, b.serialNr, b.absoluteTimestamps, b.optionalEnergy, b.minOnTime,
                    b.minOffTime, b.url);
                this.gateway.setDevice(b.deviceId, d);
                res.json(util.createResponse(200, "OK"))
            } catch (e) {
                res.status(400);
                res.json(util.createResponse(400, "Device couldnt be created. " + e))
            }
        });


        // All planning requests
        this.router.route("/devices/:id/planningRequests").get((req, res) => {
            res.json(util.createResponse(200, "OK", req.params.device.getPlanningRequests()))
        }).delete((req, res) => {
            req.params.device.clearPlanningRequests();
            res.json(util.createResponse(200, "OK"))
        }).post((req, res) => {
            let b = req.body.planning;
            if (b.EarliestStart != null && b.LatestEnd != null && b.MinRunningTime != null && b.MaxRunningTime != null) {
                req.params.device.addPlanningRequest(b.EarliestStart, b.LatestEnd, b.MinRunningTime, b.MaxRunningTime);
                res.status(200);
                res.json(util.createResponse(200, "OK"))
            } else {
                res.status(400);
                res.json(util.createResponse(400, "Wrong parameters"))
            }
        });

        // Hooks
        this.router.route("/devices/:id/hook").post((req, res) => {
            if (req.body.hookURL) {
                req.params.device.hookURL = req.body.hookURL;
                res.json(util.createResponse(200, "OK"))
            } else {
                res.status(400);
                res.json(util.createResponse(400, "HookURL not specified"))
            }
        }).delete((req, res) => {
            req.params.device.hookURL = undefined;
            res.json(util.createResponse(200, "OK"))
        });

        this.router.route("*").all((req, res) => {
            res.status(404);
            res.json(util.createResponse(404, "Route not found"))
        })
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
                console.log("REST API server listening on " + this.port);
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

export default Api