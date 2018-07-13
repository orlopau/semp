const expect = require('chai').expect;

const SSDPServer = require('../lib/SSDPServer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("SSDP Server", function(){
    describe("Constructor", function(){
        it("should throw an error if descriptionURL is null", function(){
            let cons = function(){new SSDPServer()};
            expect(cons).to.throw(TypeError)
        });
        it("should throw an error if description url is empty", function(){
            let cons = function(){new SSDPServer("")};
            expect(cons).to.throw(TypeError)
        })
    });
    describe("Functionality", function(){
        it("should be discoverable by ssdp", async function(){
            const Client = require('node-ssdp').Client;
            const client = new Client();
            client.on('response', function(headers, statusCode, info){
                expect(statusCode).to.equal(200);
            });
            const server = new SSDPServer("localhost:8080/semp/description.xml");
            server.start();

            await sleep(300);
            client.search('urn:schemas-simple-energymanagement-protocol:device:Gateway:1');
            client.search('uuid:f40c2981-7329-40b7-8b04-27f187aecfb5');
            client.search('upnp:rootdevice');
            await sleep(200);
            server.stop();
        })
    })
});