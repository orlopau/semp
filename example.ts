import Gateway from "./lib/Gateway";
import Device from "./lib/Device";

const gateway = new Gateway("Gateway", "290B3891-0311-4854-4333-7C70BC802C2D", "192.168.188.101", 9089);

let dev1 = new Device("F-11223344-112235889566-00", "Test", "Dishwasher", "Estimate", true,
    1000, true, "On", "Washer", "1", false,
    false, 1800, 0);
let dev2 = new Device("F-12356344-112233445566-00", "Test2", "Heater", "Estimate", true,
    1000, true, "On", "Baumler", "1", true,
    true);

gateway.setDevice("F-11223344-112233445566-00", dev1);
gateway.setDevice("F-12356344-112233445566-00", dev2);

gateway.start();