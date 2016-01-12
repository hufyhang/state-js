'use strict';
var State = require('../state.js');
var should = require('should');

describe('StateJS', function () {
  var target = {};
  var state;
  var config = {
    name: [{
      entry: 'StateJS',
      onEnter: function (newVal, oldVal) {
        target.value = 'Hello world';
      },
      onLeave: function (newVal, oldVal) {
        target.value = newVal;
      }
    }],
    version: [{
      entry: 1,
      onEnter: function (val) {
        target.value = val;
      }
    }, {
      entry: 2,
      onEnter: function (val) {
        target.value = val;
      }
    }],
    msg: [{
      entry: function (val) {
        return val.toUpperCase() === 'SUPERB';
      },
      onEnter: function (val) {
        target.value = 'CHECK: ' + val;
      }
    }],
    info: {
      value: 'default information',
      states: [{
        entry: function (val) {
          return val.toUpperCase() === 'SUPERB';
        },
        onEnter: function (val) {
          target.value = 'CHECK: ' + val;
        }
      }]
    }
  };
  it('should be imported by module manager.', function () {
    should.exist(State);
  });

  it('should creates a state machine object.', function () {
    state = State.create(config);
    should.exist(state);
  });

  it('should trigger callbacks on matched entries.', function () {
    state.name = 'Hello';
    should.notEqual(target.value, 'Hello world');
    state.name = 'StateJS';
    should.equal(target.value, 'Hello world');
  });

  it('should trigger onLeave callbacks on state changes.', function () {
    state.name = 'Bingo';
    should.equal(target.value, 'Bingo');
  });

  it('should handles multiple states on a single property.', function () {
    state.version = 1;
    should.equal(target.value, 1);
    state.version = 2;
    should.equal(target.value, 2);
  });

  it('should supports function-type entry.', function () {
    state.msg = 'superb';
    should.equal(target.value, 'CHECK: superb');
  });

  it('should supports default/initial values.', function () {
    should.equal(state.info, 'default information');
  });

  it('should be able to add states.', function () {
    state.add({
      addition: [{
        entry: 10,
        onEnter: function () {
          target.value = 100;
        }
      }]
    });

    state.addition = 0;
    should.notEqual(target.value, 100);
    state.addition = 10;
    should.equal(target.value, 100)
  });

  it('should be able to remove states.', function () {
    state.remove('addition');
    should.equal(state.addition, undefined);

    should.equal(state.version, 2);
  });

});