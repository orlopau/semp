import chai from 'chai';
import chaiHttp from 'chai-http';
import Api from "../../lib/api/Api";
import Gateway from "../../lib/Gateway";
import Device from "../../lib/Device";
import util from "../../lib/api/Util";

const expect = chai.use(chaiHttp).expect;
const url: string = "http://localhost:8082/api";
const gateway: Gateway = new Gateway("1234UID", "127.0.0.1", 0, 0);
const api: Api = new Api(8082, gateway);

const device1 = new Device("1234", "Test1", "Dishwasher", "Estimate",
    true, 1000, true, "Off", "Tendor", "1Serial", false);
const device2 = new Device("12345", "Test2", "Dishwasher", "Estimate",
    true, 1000, true, "Off", "Tendor", "1Serial", false,
    false, 600, 3600);

describe("API", () => {
    before(async () => {
        await api.start()
    });
    after(async () => {
        await api.stop()
    });
    beforeEach(() => {
        gateway.deleteAllDevices();
        device1.clearPlanningRequests();
        device2.clearPlanningRequests();
    });

    describe("GET /devices", () => {
        it("Contain 0 devices", async () => {
            let res = await chai.request(url).get("/devices");
            expect(res.body.data).to.have.length(0)
        });
        it("Should have a device", async () => {
            gateway.setDevice(device1.deviceInfo.Identification.DeviceId, device1);
            let res = await chai.request(url).get("/devices");
            expect(res.body.data).to.have.length(1);
            expect(res.body.data[0]).to.have.all.keys([
                "absoluteTimestamps",
                "deviceId",
                "emSignalsAccepted",
                "interruptionsAllowed",
                "maxPower",
                "measurementMethod",
                "name",
                "optionalEnergy",
                "serialNr",
                "status",
                "type",
                "vendor"
            ]);
        });
        it("Should have extra params", async () => {
            gateway.setDevice(device2.deviceInfo.Identification.DeviceId, device2);
            let res = await chai.request(url).get("/devices");
            expect(res.body.data[0]).to.have.any.keys("optionalEnergy", "minOnTime", "minOffTime")
        });
        it("Should have multiple devices", async () => {
            gateway.setDevice(device2.deviceInfo.Identification.DeviceId, device2);
            gateway.setDevice(device1.deviceInfo.Identification.DeviceId, device1);
            let res = await chai.request(url).get("/devices");
            expect(res.body.data).to.have.length(2);
        })
    });

    describe("POST /devices", () => {
        it("Should create a new device and not create another one with same id", async () => {
            let params = {
                deviceId: "1234",
                name: "Test1",
                type: "Dishwasher",
                measurementMethod: "Estimate",
                interruptionsAllowed: true,
                maxPower: 1000,
                emSignalsAccepted: true,
                status: "Off",
                vendor: "Tendor",
                serialNr: "1Serial",
                absoluteTimestamps: false
            };

            let res = await chai.request(url).post("/devices").send({device: params});
            expect(res.status).to.equal(200);

            expect(gateway.getAllDevices().length).to.equal(1);
            // @ts-ignore
            expect(util.device2RESTDevice(gateway.getDevice("1234"))).to.have.any.keys(Object.keys(params));

            let res1 = await chai.request(url).post("/devices").send({device: params});
            expect(res1.status).to.equal(405);
            // @ts-ignore
            expect(util.device2RESTDevice(gateway.getDevice("1234"))).to.have.any.keys(Object.keys(params));
        })
    });

    describe("PUT /devices/:id", () => {
        it("Should update device", async () => {
            gateway.setDevice("1234", device1);

            let res = await chai.request(url).put("/devices/1234").send({device: {status: "On"}});
            expect(res.status).to.equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.Status).to.equal("On");
        })
    });

    describe("GET /devices/:id", () => {
        it("Should return 404", async () => {
            let res = await chai.request(url).get("/devices/215415141");
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal(404);
        });
        it("Should return a device", async () => {
            gateway.setDevice(device1.deviceInfo.Identification.DeviceId, device1);
            let res = await chai.request(url).get("/devices/1234");
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.any.keys([
                "absoluteTimestamps",
                "deviceId",
                "emSignalsAccepted",
                "interruptionsAllowed",
                "maxPower",
                "measurementMethod",
                "name",
                "optionalEnergy",
                "serialNr",
                "status",
                "type",
                "vendor"
            ])
        });
    });

    describe("DELETE /devices/:id", () => {
        it("Should return 404", async () => {
            let res = await chai.request(url).del("/devices/215415141");
            expect(res.status).to.equal(404);
            expect(res.body.status).to.equal(404);
        });
        it("Should delete device", async () => {
            gateway.setDevice(device1.deviceInfo.Identification.DeviceId, device1);
            let res = await chai.request(url).del("/devices/1234");
            expect(res.status).to.equal(200);
            expect(gateway.getAllDevices().length).to.equal(0)
        });
        it("Should not delete device", async () => {
            gateway.setDevice(device1.deviceInfo.Identification.DeviceId, device1);
            let res = await chai.request(url).del("/devices/123234");
            expect(res.status).to.equal(404);
            expect(gateway.getAllDevices().length).to.equal(1)
        });
    });

    describe("GET /devices/:id/planningRequests", () => {
        it("Should return no device found", async () => {
            let res = await chai.request(url).get("/devices/1214313244/planningRequests");
            expect(res.status).to.equal(404)
        });

        it("Should return empty array", async () => {
            gateway.setDevice("1234", device1);
            let res = await chai.request(url).get("/devices/1234/planningRequests");
            expect(res.status).to.equal(200);
            expect(res.body.data.length).to.equal(0)
        });

        it("Should return plannings", async () => {
            gateway.setDevice("1234", device1);
            // @ts-ignore
            gateway.getDevice("1234").addPlanningRequest(0, 600, 10, 60);
            let res = await chai.request(url).get("/devices/1234/planningRequests");
            expect(res.body.data.length).equal(1);
        });

        it("Should return multiple plannings", async () => {
            gateway.setDevice("1234", device1);
            // @ts-ignore
            gateway.getDevice("1234").addPlanningRequest(0, 600, 10, 60);
            // @ts-ignore
            gateway.getDevice("1234").addPlanningRequest(600, 1200, 10, 60);
            let res = await chai.request(url).get("/devices/1234/planningRequests");
            expect(res.body.data.length).equal(2);
        })
    });

    describe("DELETE /devices/:id/planningRequests", () => {
        it("Should delete all requests", async () => {
            gateway.setDevice("1234", device1);
            // @ts-ignore
            gateway.getDevice("1234").addPlanningRequest(0, 600, 10, 60);
            let res = await chai.request(url).del("/devices/1234/planningRequests");
            expect(res.status).equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").getPlanningRequests().length).equal(0)
        });

        it("Should return 404", async () => {
            let res = await chai.request(url).del("/devices/1214212434/planningRequests");
            expect(res.status).equal(404);
        });
    });

    describe("GET /devices/:id/planningRequests", () => {
        it("Should get all plannings", async () => {
            gateway.setDevice("1234", device1);
            // @ts-ignore
            gateway.getDevice("1234").addPlanningRequest(0, 600, 10, 60);
            let res = await chai.request(url).get("/devices/1234/planningRequests");
            expect(res.body.data).to.deep.equal(device1.getPlanningRequests())
        });

        it("Should return empty list", async () => {
            gateway.setDevice("1234", device1);
            let res = await chai.request(url).get("/devices/1234/planningRequests");
            expect(res.body.data).to.have.length(0)
        })
    });

    describe("POST /devices/:id/planningRequests", () => {
       it("Should add a planning", async () => {
           gateway.setDevice("1234", device1);

           let params = {
               planning: {
                   EarliestStart: 0,
                   LatestEnd: 600,
                   MinRunningTime: 10,
                   MaxRunningTime: 60
               }
           };
           let res = await chai.request(url).post("/devices/1234/planningRequests").send(params);
           expect(res.status).equal(200);
           // @ts-ignore
           expect(gateway.getDevice("1234").getPlanningRequests()).to.have.length(1);
           // @ts-ignore
           let probe = gateway.getDevice("1234").getPlanningRequests()[0];
           delete probe.DeviceId;
           expect(probe).to.deep.equal(params.planning);
       })
    });

    describe("POST /devices/:id/hook", () => {
        it("Should register a hook", async () => {
            gateway.setDevice("1234", device1);
            let hookURL = "192.158.148.120/test";
            let res = await chai.request(url).post("/devices/1234/hook").send({hookURL: hookURL});
            expect(res.status).to.equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").hookURL).to.equal(hookURL);
        })
    });

    describe("DELETE /devices/:id/hook", () => {
        it("Should delete the hook", async () => {
            gateway.setDevice("1234", device1);
            // @ts-ignore
            gateway.getDevice("1234").hookURL = "something";
            let res = await chai.request(url).del("/devices/1234/hook");
            expect(res.status).to.equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").hookURL).to.equal(undefined);
        })
    });

    describe("POST /devices/:id/lastPower", () => {
        it("Should set last power without min, max", async () => {
            gateway.setDevice("1234", device1);

            let res = await chai.request(url).put("/devices/1234/lastPower").send({power: {Watts: 500}});
            expect(res.status).to.equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo.length).to.equal(1);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo[0].AveragePower).to.equal(500);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo[0].MaxPower).to.equal(undefined);
        });

        it("Should set last power with min, max", async () => {
            gateway.setDevice("1234", device1);

            let res = await chai.request(url).put("/devices/1234/lastPower").send({power: {Watts: 500, MinPower: 100, MaxPower: 300}});
            expect(res.status).to.equal(200);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo.length).to.equal(1);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo[0].AveragePower).to.equal(500);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo[0].MaxPower).to.equal(300);
            // @ts-ignore
            expect(gateway.getDevice("1234").deviceStatus.PowerConsumption.PowerInfo[0].MinPower).to.equal(100);
        });
    })
});

