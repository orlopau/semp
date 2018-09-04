import Gateway from './index'

let uuid = process.env.UUID || "290B3891-0311-4854-4333-7C70BC802C2D";
let ip = process.env.IP;
let sempPort = Number(process.env.SEMP_PORT) || 8080;
let apiPort = Number(process.env.API_PORT) || 8081;
let name = process.env.NAME || "Open Source Gateway";
let manufacturer = process.env.MANUFACTURER || "OpenGateway";

if(!ip){
    throw new Error("IP not specified!")
}

let gw = new Gateway(uuid, ip, sempPort, apiPort, name, manufacturer);
gw.start().then(() => {
    console.log("Started all!");
}).catch(() => {
    console.log("Error while starting!");
});