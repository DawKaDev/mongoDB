const Department = require('../department.model.js');
const {expect} = require('chai');
const mongoose = require('mongoose');

describe('Department', () => {
  it('should throw an error if no "name" arg', () => {
    const dep = new Department({});
    dep.validate(err => {
      expect(err.errors.name).to.exist;
    });
  });

  it('should throw an error if "name" arg is not a string', () => {
    const cases =[{}, []];
    for(let name of cases) {
      const dep = new Department({name});

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should throw an error if "name" is shorter than 5 and longer than 20', () => {
    const cases = ['Dep', 'VeryLongDeparmentName'];
    for(let name of cases) {
      const dep = new Department({name});

      dep.validate(err => {
        expect(err.errors.name).to.exist;
      });
    }
  });

  it('should not throw an error if "name" is okay', () => {
    const cases = ['Department', 'Department Name Test'];
    for(let name of cases) {
      const dep = new Department({name});

      dep.validate(err => {
        expect(err).to.not.exist;
      });
    }
  });
});
after(() => {
  mongoose.models = {};
});