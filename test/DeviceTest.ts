import {expect} from 'chai';
import Device from "../lib/Device";

let dev = new Device("123", "Test", "Dishwasher", "Estimate", true,
    1000, true, "On", "Washer", "1", false,
    false, 1800, 0);

describe("Device", () => {
   describe("Planning", () => {
       it("Should throw when minTime > maxTime", () => {
           expect(() => dev.addPlanningRequest(0, 100, 180, 100)).to.throw();
       });

       describe("Overlaps", () => {
           beforeEach(() => {
              dev.clearPlanningRequests();
           });

           it("Inside, should throw", () => {
               dev.addPlanningRequest(0, 200, 0, 60);
               expect(() => dev.addPlanningRequest(50, 100, 0, 60)).to.throw()
           });

           it("Left, should throw", () => {
               dev.addPlanningRequest(100,230,0,60);
               expect(() => dev.addPlanningRequest(200,300,0,60)).to.throw()
           });

           it("Right, should throw", () => {
               dev.addPlanningRequest(200,300,0,60);
               expect(() => dev.addPlanningRequest(100,230,0,60)).to.throw()
           });

           it("Seperated, shouldnt throw", () => {
               dev.addPlanningRequest(0,100,0,60);
               expect(() => dev.addPlanningRequest(100,200,0,60)).to.not.throw()
           })
       })
   })
});
