const Employee = require('../employees.model');
const {expect} = require('chai');
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no "firstName", "lastName" or "department" arg', () => {
    const cases = [
      {},
      {firstName: 'John', lastName: 'Doe'},
      {firstName: 'John', department: 'Dep'},
      {lastName: 'Doe', department: 'Dep'}
    ]

    for(let data of cases) {
      const emp = new Employee(data);

      emp.validate(err => {
        expect(err).to.exist;
      });
    }
  });

  it('should throw an error if "firstName", "lastName" or "department" is not a string', () => {
    const cases = [
      {firstName: [], lastName: [], department: []},
      {firstName: {}, lastName: {}, department: {}},
      {firstName: 'John', lastName: 'Doe', department: []},
      {firstNAme: 'John', lastNAme: [], department: 'IT'},
      {firstName: [], lastName: 'Doe', department: 'IT'}
    ]

    for(let data of cases) {
      const emp = new Employee(data);

      emp.validate(err => {
        expect(err).to.exist;
      });
    }
  });

  it('shold not thow an error if "firstName", "lastName" and "department" is correct', () => {
    const emp = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: 'IT'
    })

    emp.validate(err => {
      expect(err).to.not.exist;
    });
  });
});