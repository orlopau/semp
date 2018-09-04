import {expect} from 'chai';
import SSDPServer from '../lib/SSDPServer';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("SSDP Server", function(){
    describe("Constructor", function(){
        it("should throw an error if descriptionURL is null", function(){
            let cons = function(){
                // @ts-ignore
                new SSDPServer();
            };
            expect(cons).to.throw(TypeError)
        });
        it("should throw an error if description url is empty", function(){
            let cons = function(){
                // @ts-ignore
                new SSDPServer("")};
            expect(cons).to.throw(TypeError)
        })
    });
    describe("Functionality", function(){
        it("should be discoverable by ssdp", async function(){
            const Client = require('node-ssdp').Client;
            const client = new Client();
            client.on('response', function(headers: any, statusCode: number, info: string){
                expect(statusCode).to.equal(200);
            });
            const server = new SSDPServer("http://192.168.188test:8080/semp/description.xml", "f40c2981-7329-40b7-8b04-27f187aecfb5");
            server.start();

            client.search('urn:schemas-simple-energy-management-protocol:device:Gateway:1');
            //client.search('upnp:rootdevice');
            //client.search('uuid:f40c2981-7329-40b7-8b04-27f187aecfb5');
            await sleep(1800);
            server.stop();
        })
    })
});