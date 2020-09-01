const expect = require('chai').expect;
const {
    ERROR_TYPES,
    MESSAGES
} = require('../app/utils/constants');
let { cashWithdraw } = require('../app/controllers/userController');

describe('#cashWithDraw()', function () {
    it('Cash withdraw without prefrence.', async function () {
        let response = await cashWithdraw([2000, 500, 200, 100, 50, 20, 10], 900, 2000);
        expect(response).to.have.property('isError').to.equal(false);
        expect(response).to.have.property('responseType').to.equal('SUCCESS');
        expect(response).to.have.property('msg').to.equal(MESSAGES.TRASACTION_SUCCESSFULL);
        expect(response).to.have.property('balance').to.equal(1100);
        expect(response).to.have.property('notes').to.be.an.instanceof(Object);
        expect((response.notes || {})['500']).to.equal(1);
        expect((response.notes || {})['200']).to.equal(2);
    });

    it('Cash withdraw with prefrence.', async function () {
        let response = await cashWithdraw([2000, 500, 200, 100, 50, 20, 10], 900, 2000,200);
        expect(response).to.have.property('isError').to.equal(false);
        expect(response).to.have.property('responseType').to.equal('SUCCESS');
        expect(response).to.have.property('msg').to.equal(MESSAGES.TRASACTION_SUCCESSFULL);
        expect(response).to.have.property('balance').to.equal(1100);
        expect(response).to.have.property('notes').to.be.an.instanceof(Object);
        expect((response.notes || {})['100']).to.equal(1);
        expect((response.notes || {})['200']).to.equal(4);
    });

    it('Amount is more than balance.', async function () {
        let response = await cashWithdraw([2000, 500, 200, 100, 50, 20, 10], 2100, 2000);
        expect(response).to.have.property('isError').to.equal(true);
        expect(response).to.have.property('responseType').to.equal(ERROR_TYPES.BAD_REQUEST);
        expect(response).to.have.property('msg').to.equal(MESSAGES.INSUFIICIENT_BALANCE);
    });

    it('Amount is more than max limit.', async function () {
        let response = await cashWithdraw([2000, 500, 200, 100, 50, 20, 10], 50000, 100000);
        expect(response).to.have.property('isError').to.equal(true);
        expect(response).to.have.property('responseType').to.equal(ERROR_TYPES.BAD_REQUEST);
        expect(response).to.have.property('msg').to.equal(MESSAGES.ENTER_AMOUNT_LESS_THAN_MAX_LIMIT);
    });

    it('Enter amount multiple of minimum denomination.', async function () {
        let response = await cashWithdraw([2000, 500, 200, 100, 50, 20, 10], 125, 100000);
        expect(response).to.have.property('isError').to.equal(true);
        expect(response).to.have.property('responseType').to.equal(ERROR_TYPES.BAD_REQUEST);
        expect(response).to.have.property('msg').to.equal(MESSAGES.ENTER_THE_AMOUNT_MULTIPLE_OF_MINIMUM_DENOMINATION);
    });
});
