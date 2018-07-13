const SEMPServer = require("./lib/SEMPServer");
const server = new SEMPServer("b139a468-8511-11e8-adc0-fa7ae01bbebc", "51-23-2312-12-12", "192.168.188.20", 9089);

server.start();