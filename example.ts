import Gateway from "./lib/Gateway";
import Device from "./lib/Device";
import Api from "./lib/api/Api";

const gateway = new Gateway("Gateway", "290B3891-0311-4854-4333-7C70BC802C2D", "192.168.188.101", 9089, 9090);

let dev1 = new Device("F-11223344-112235889566-00", "Test", "DishWasher", "None", true,
    1000, true, "Off", "Washer", "1", false,
    false);

let dev2 = new Device("F-12356344-112233445566-00", "Test2", "Heater", "Estimate", true,
    1000, true, "Off", "Baumler", "1", false,
    true);

gateway.setDevice("F-11223344-112235889566-00", dev1);
//gateway.setDevice("F-12356344-112233445566-00", dev2);

dev1.addPlanningRequest(0, 190, 65, 180);
//dev2.addPlanningRequest(0, 3000, 1000, 2000);
//dev2.setLastPower(50);

gateway.start();