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
        // All devices
        this.router.get("/devices", (req, res) => {
            let devices = this.gateway.getAllDevices();
            res.json(util.createResponse(200, "OK", devices.map(d => util.device2RESTDevice(d))));
        });

        // Single device
        this.router.route("/devices/:id").get((req, res) => {
            let device = this.gateway.getDevice(req.params.id);
            if(device){
                res.json(util.createResponse(200, "OK", util.device2RESTDevice(device)))
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"));
            }
        }).delete((req, res) => {
            if(this.gateway.deleteDevice(req.params.id)){
                res.json(util.createResponse(200, "OK"))
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
        }).post((req, res) => {
            let d: Device;

            try{
                let b = req.body.device;
                d = new Device(b.deviceId, b.name, b.type, b.measurementMethod, b.interruptionsAllowed, b.maxPower,
                    b.emSignalsAccepted, b.status, b.vendor, b.serialNr, b.absoluteTimestamps, b.optionalEnergy, b.minOnTime,
                    b.minOffTime, b.url);
                this.gateway.setDevice(b.deviceId, d);
                res.json(util.createResponse(200, "OK"))
            }catch(e){
                res.status(400);
                res.json(util.createResponse(400, "Device couldnt be created. " + e))
            }
        });


        // All planning requests
        this.router.route("/devices/:id/planningRequests").get((req, res) => {
            let d = this.gateway.getDevice(req.params.id);
            if(d){
                res.json(util.createResponse(200, "OK", d.getPlanningRequests()))
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
        }).delete((req, res) => {
            let d = this.gateway.getDevice(req.params.id);
            if(d){
                d.clearPlanningRequests();
                res.json(util.createResponse(200, "OK"))
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
        }).post((req, res) => {
            let b = req.body.planning;
            if(b.EarliestStart != null && b.LatestEnd != null && b.MinRunningTime != null && b.MaxRunningTime != null){
                let d = this.gateway.getDevice(req.params.id);
                if(d){
                    d.addPlanningRequest(b.EarliestStart, b.LatestEnd, b.MinRunningTime, b.MaxRunningTime);
                    res.status(200);
                    res.json(util.createResponse(200, "OK"))
                }else{
                    res.status(404);
                    res.json(util.createResponse(404, "Device not found"))
                }
            }else{
                res.status(400);
                res.json(util.createResponse(400, "Wrong parameters"))
            }
        });

        // Hooks
        this.router.route("/devices/:id/hook").post((req, res) => {
            let d = this.gateway.getDevice(req.params.id);
            console.log(req.params.id);
            if(d){
                if(req.body.hookURL) {
                    d.hookURL = req.body.hookURL;
                    res.json(util.createResponse(200, "OK"))
                } else {
                    res.status(400);
                    res.json(util.createResponse(400, "HookURL not specified"))
                }
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
        }).delete((req, res) => {
            let d = this.gateway.getDevice(req.params.id);
            if(d){
                d.hookURL = undefined;
                res.json(util.createResponse(200, "OK"))
            }else{
                res.status(404);
                res.json(util.createResponse(404, "Device not found"))
            }
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