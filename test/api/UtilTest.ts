import {expect} from 'chai'
import util from '../../lib/api/Util'

describe("Api Util", () => {
    it("should be valid response", () => {
        let valid = {
            status: 200,
            msg: "OK",
            data: {
                test: 1
            }
        };

        let result = util.createResponse(200, "OK", {test: 1})

        expect(result).to.deep.equal(valid)
    });

    it("should be valid response without data", () => {
        let valid = {
            status: 200,
            msg: "OK"
        };

        let result = util.createResponse(200, "OK");
        expect(result).to.deep.equal(valid)
    })
});