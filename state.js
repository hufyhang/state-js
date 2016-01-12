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

  // `configs` should be an array of object literals.
  // For example:
  // [{
  //   entry: 'name',
  //   onEnter: function () {...},
  //   onLeave: function () {...}
  // }, {
  //   entry: 'version',
  //   onEnter: function () {...},
  //   onLeave: function () {...}
  // }]
  function State (configs) {
    if (!isArray(configs)) {
      throw TypeError(configs + ' is not an array');
    }
    var states = {};
    var current;
    configs.forEach(function (config) {

    });
  };


  return State;
}
);