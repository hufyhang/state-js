'use strict';
(function (definition) {
  if (typeof module !== 'undefined'
      && typeof module.exports !== 'undefined') {
    module.exports = definition();
}
else {
  window.StateJS = definition();
}
})(
function () {
  var hasOwn = Object.prototype.hasOwnProperty;

  var mixin = function mixin() {
    var args = Array.prototype.slice.call(arguments);
    var o = args[0];
    var temp;
    for (var i = 1, l = args.length; i !== l; ++i) {
      temp = args[i];
      for (var k in temp) {
        if (hasOwn.call(temp, k)) {
          o[k] = temp[k];
        }
      }
    }
    return o;
  };

  var isArray = function isArray(o) {
    return Object.prototype.toString.call(o) === '[object Array]';
  };

  var bindState = function (conf, old, val) {
    if (typeof conf.onEnter === 'function') {
      conf.onEnter(val, old);
    }
    return conf.onLeave;
  };

  var _addState = function (context, state) {
    context.__values[state] = context.__states[state].value;
    Object.defineProperty(context, state, {
      get: function () {
        return context.__values[state];
      },
      set: function (val) {
        var old = context.__values[state];

        if (typeof context.__leave === 'function') {
          context.__leave(val, old);
          context.__leave = null;
        }

        context.__values[state] = val;
        var config = context.__states[state];
        config = isArray(config) === true
          ? config
          : config.states;
        config.forEach(function (conf) {
          switch (typeof conf.entry) {
            case 'string':
            case 'number':
            case 'boolean':
            if (conf.entry === val) {
              context.__leave = bindState(conf, old, val);
            }
            break;

            case 'function':
            if (conf.entry(val, old) === true) {
              context.__leave = bindState(conf, old, val);
            }
            break;
          }
        });
      }
    });


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
    this.__states = configs;
    this.__values = {};
    this.__leave = null;
    for (var state in this.__states) {
      if (hasOwn.call(this.__states, state)) {
        _addState(this, state);
      }
    }
  }

  State.prototype = {
    add: function add(config){
      if (typeof config !== 'object') {
        throw TypeError(config + ' is not an object');
      }
      this.__states = mixin(this.__states, config);
      for (var state in config) {
        if (hasOwn.call(this.__states, state)) {
          _addState(this, state);
        }
      }
    },

    remove: function remove(states) {
      if (typeof states !== 'string' && !isArray(states)) {
        throw TypeError(states + ' is neither an array or a string');
      }
      states = isArray(states) ? states : [states];
      var that = this;
      states.forEach(function (state) {
        delete that.__states[state];
        delete that.__values[state];
      });
    }

  };

  return {
    create: function create (config) {
      if (typeof config !== 'object') {
        throw TypeError(config + ' is not an object');
      }
      return new State(config);
    }
  };
}
);