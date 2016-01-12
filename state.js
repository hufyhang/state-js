'use strict';
(function (definition) {
  if (typeof module !== 'undefined'
      && typeof module.exports !== 'undefined') {
    module.exports = definition;
  }
  else {
    window.StateJS = definition;
  }
})(
function () {
  var isArray = function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  };

  var hasOwn = Object.prototype.hasOwnProperty;

  var bindState = function (conf, old, val) {
    var enterFn = typeof conf.onEnter === 'function'
    ? conf.onEnter
    : function () {};
    enterFn(val, old);
    return conf.onLeave || function () {};
  };

  // `configs` should be an object literal.
  // For example:
  // {
  //   name: [{
  //     entry: 'StateJS',
  //     onEnter: function (newVal, oldVal) {...},
  //     onLeave: function (newVal, oldVal) {...}
  //   }, {
  //     entry: 123,
  //     onEnter: function (newVal, oldVal) {...},
  //     onLeave: function (newVal, oldVal) {...}
  //   }]
  // }
  function State (configs) {
    if (typeof configs !== 'object') {
      throw TypeError(configs + ' is not an object literal');
    }
    // Keep a reference of state configs.
    this.states = configs;
    this.values = {};
    this.currentLeave = function () {};
    for (var state in this.states) {
      if (hasOwn.call(this.states, state)) {
        this.values[state] = undefined;
        Object.defineProperty(this, state, {
          get: function () {
            return this.values[state];
          },
          set: function (val) {
            var old = this.values[state];

            this.currentLeave(val, old);
            this.currentLeave = function () {};

            this.values[state] = val;
            var config = this.states[state];
            config.forEach(function (conf) {
              switch (typeof conf.entry) {
                case 'string':
                case 'number':
                case 'boolean':
                if (conf.entry === val) {
                  this.currentLeave = bindState(conf, old, val);
                }
                break;

                case 'function':
                if (val() === true) {
                  this.currentLeave = bindState(conf, old, val);
                }
                break;
              }
            });
          }
        });
      }
    }
  }




  // TODO: change `state`
  return State;
}
);