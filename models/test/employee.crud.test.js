const Employee = require('../employees.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const initData = {
  departments: ['Marketing', 'Consulting'],
  employees: [
    {firstName: 'John', lastName: 'Doe'},
    {firstName: 'Diana', lastName: 'Brown'}
  ]
}

describe('Employee', () => {
  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();

      await mongoose.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true});
    }
    catch(err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {
    const { departments, employees } = initData;
    before(async () => {
      for(let department of departments){
        const dep = new Department({_id: ObjectId(), name: department});
        await dep.save();
      }

      for(let employee of employees){
        const dep = await Department.findOne({name: departments[employees.indexOf(employee)]});
        const emp = new Employee({firstName: employee.firstName, lastName: employee.lastName, department: dep});
        await emp.save();
      }
    });

    after(async() => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });

    it('sholud return all data with "find" method', async () => {
      const employees = await Employee.find().populate('department');
      expect(employees.length).to.be.equal(2);
      expect(employees[0].department).to.be.an('object');
      expect(employees[0].department.name).to.be.equal('Marketing');
    });

    it('should return proper document by various params with "findOne" method', async () => {
      const cases = [{firstName: employees[0].firstName}, {lastName: employees[1].lastName}];
      for(let data of cases) {
        const employee = await Employee.findOne(data);
        expect(employee).to.not.be.null;
      }
      const employee = await Employee.findOne().populate({path:'department', match: { name: 'Marketing'}});
      expect(employee).to.not.be.null;
      expect(employee.firstName).to.be.equal('John');
    });
  });

  describe('Creating data', () => {
    after(async () => {
      await Employee.deleteMany();
    });

    it('should insert new document with "insertOne" method', async () => {
      const emp = new Employee({firstName: 'Mike', lastName: 'White', department: 'UX'});
      await emp.save();
      expect(emp.isNew).to.be.false;
    });
  });

  describe('Updating data', () => {
    const { employees } = initData;
    beforeEach(async () => {
      for(let employee of employees){
        const emp = new Employee({firstName: employee.firstName, lastName: employee.lastName, department: 'IT'});
        await emp.save();
      }
    });

    afterEach(async() => {
      await Employee.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({firstName: employees[0].firstName}, {$set: {lastName: 'White'}});
      const udpatedEmp = await Employee.findOne({lastName: 'White'});
      expect(udpatedEmp.firstName).to.be.equal(employees[0].firstName);
      expect(udpatedEmp.lastName).to.be.equal('White');
      expect(udpatedEmp.department).to.be.equal('IT');
    });

    it('should properly update one document with "save" method', async () => {
      const emp = await Employee.findOne({firstName: 'John'});
      emp.lastName = 'White';
      await emp.save();
      const udpatedEmp = await Employee.findOne({lastName: 'White'});
      expect(udpatedEmp.firstName).to.be.equal('John');
      expect(udpatedEmp.lastName).to.be.equal('White');
      expect(udpatedEmp.department).to.be.equal('IT');
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, {$set: {lastName: 'White'}});
      const employees = await Employee.find({lastName: 'White'});
      expect(employees.length).to.be.equal(2);
    });
  });

  describe('Removing data', () => {
    const { employees } = initData;
    beforeEach(async () => {
      for(let employee of employees){
        const emp = new Employee({firstName: employee.firstName, lastName: employee.lastName, department: 'IT'});
        await emp.save();
      }
    });

    afterEach(async() => {
      await Employee.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({firstName: employees[0].firstName});
      const deletedEmp = await Employee.findOne({firstName: employees[0].firstName});
      expect(deletedEmp).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const emp = await Employee.findOne({firstName: employees[0].firstName});
      await emp.remove();
      const deletedEmp = await Employee.findOne({firstName: employees[0].firstName});
      expect(deletedEmp).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany({});
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
  });
})