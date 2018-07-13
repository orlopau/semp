const expect = require('chai').expect;
const axios = require('axios');
const SEMPServer = require('../lib/SEMPServer');

describe('HttpServer', function () {
    describe('Initiation', function () {
        it("Should create a web server", async function () {
            const server = new SEMPServer("uuid", "serialNr", "192.168.188.223", 8884);
            try {
                await server.start(8843);
                server.stop()
            } catch (e) {
                expect(e, "Creating server threw error!").to.be.null
            }
        })
    });

    describe('Routes', function () {
        let server;

        before(async function () {
            server = new SEMPServer("b139a468-8511-11e8-adc0-fa7ae01bbebc", "51-23-2312-12-12","127.0.0.1", 8080);
            await server.start()
        });

        it("Should serve a description.xml", async function () {
            try{
                const resp = await axios.get('http://127.0.0.1:8080/description.xml');
                expect(resp.status).to.equal(200);
            }catch (e) {
                expect(e, "retrieving description.xml failed!").to.be.null
            }
        });

        after(function () {
            server.stop();
        })
    })

});
