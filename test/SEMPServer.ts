import {expect} from 'chai';
import axios from 'axios'
import SEMPServer from '../lib/SEMPServer'
import Gateway from "../lib/Gateway";

const gateway = new Gateway("Gateway", "290B3891-0311-4854-4333-7C70BC802C2D", "192.168.188.101", 9089);

describe('HttpServer', function () {
    describe('Initiation', function () {
        it("Should create a web server", async function () {
            const server = new SEMPServer("uuid", "192.168.188.223", 8884, "", gateway);
            const con = async function(){
                await server.start();
                server.stop()
            };
            expect(await con, "Creating server threw error!").to.not.throw()
        })
    });

    describe('Routes', function () {
        let server: SEMPServer;

        before(async function () {
            server = new SEMPServer("b139a468-8511-11e8-adc0-fa7ae01bbebc", "192.168.188.223", 8080, "", gateway);
            await server.start()
        });

        it("Should serve a description.xml", async function () {
            const con = async function(){
                const resp = await axios.get('http://127.0.0.1:8080/description.xml');
                expect(resp.status).to.equal(200);
            };
            expect(await con , "retrieving description.xml failed!").to.not.throw()
        });

        after(function () {
            server.stop();
        })
    })

});
