const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

describe('Department', () => {
  
  before( async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();

      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
    }
    catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    before( async () => {
      const testDepOne = new Department({name: 'Department 1'});
      await testDepOne.save();

      const testDepTwo = new Department({name: 'Department 2'});
      await testDepTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      const expectedLength = 2;
      expect(departments.length).to.be.equal(expectedLength);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const depName = 'Department 1';
      const department = await Department.findOne({name: depName});
      expect(department.name).to.be.equal(depName);
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const department = new Department({name: 'Department 1'});
      await department.save();
      expect(department.isNew).to.be.false;
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe('Updating data', () => {

    beforeEach( async () => {
      const testDepOne = new Department({name: 'Department 1'});
      await testDepOne.save();

      const testDepTwo = new Department({name: 'Department 2'});
      await testDepTwo.save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne({name: 'Department 1'}, {$set: {name: '=Department 1='}});
      const updatedDep = await Department.findOne({name: '=Department 1='});
      expect(updatedDep).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({name: 'Department 1'});
      department.name = '=Department 1=';
      await department.save();

      const updatedDep = await Department.findOne({name: '=Department 1='});
      expect(updatedDep).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({},{$set: {name: 'Department 3'}});
      const updatedDep = await Department.find({name: 'Department 3'});
      expect(updatedDep.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {

    beforeEach(async () => {
      const testDepOne = new Department({ name: 'Department 1' });
      await testDepOne.save();
    
      const testDepTwo = new Department({ name: 'Department 2' });
      await testDepTwo.save();
    });
    
    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({name: 'Department 1'});
      const deletedDep = await Department.findOne({name: 'Department 1'});
      expect(deletedDep).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const dep = await Department.findOne({ name: 'Department 1' });
      await dep.remove();
      const removedDep = await Department.findOne({ name: 'Department 1' });
      expect(removedDep).to.be.null;
    });

    it('should properly remove multiple documents with "delateMany" method', async () => {
      await Department.deleteMany({});
      const departments = await Department.find();
      expect(departments.length).to.be.equal(0);
    })
  })
})