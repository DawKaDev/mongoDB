const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('POST /api/departments', () => {
  after(async () => {
    await Department.deleteMany();
  });

  it('/ should insert new document to db and return success', async () => {
    const res = await request(server).post('/api/departments').send({name: 'Department #3'});
    const newDep = await Department.findOne({name: 'Department #3'});
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(newDep.name).to.not.be.null;
  });
});