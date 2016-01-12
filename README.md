### StateJS

A JavaScript finite state machine with a more natural fashion. 

#### Installation

##### Browser

~~~html
<script src="path/to/state.js"></script>
var myState = StateJS.create(/* ... */);
~~~

##### Node.JS

~~~js
var State = require('state-js');
var myState = State.create(/* ... */);
~~~

#### .create(config)

Creates and returns a state machine object according to configuration defined in `config`.

+ `config`: A JavaScript object literal defining the state machine.

#### State Machine Config Object

A `config` object should be in the following form:

~~~js
{
  name: [{
    entry: 'Hello world', // `entry` specifies state entry conditions
    onEnter: function (newVal, oldVal) {
      // `onEnter` specifies the callback function to be invoked when entering the state.
      // `newVal`: current value.
      // `oldVal`: previous value.
    },
    onLeave: function (newVal, oldVal) {
      // `onLeave` specifies the callback function to be invoked when leaving the state.
      // `newVal`: current value.
      // `oldVal`: previous value.
    }
  }, {
    entry: 'StateJS', // Here is another state.
    onEnter: function () {/* ... */},
    onLeave: function () {/* ... */}
  }],
  version: {
    value: 1, // By wrapping state in an object literal, you can use `value` to define its default/initial value.
    states: [{ // Then use `states` to define states.
      entry: function (val) { return Math.floor(val) === 100 }, // `entry` can also be a function returning true or false. 
      onEnter: function () {/* ... */},
      onLeave: function () {/* ... */}
    }]
  }
}
~~~

#### Change/get states

After create a state machine, you can change/get by:

~~~js
var state = StateJS(/* ... */);
console.log(state.name); // To get.
state.name = 'StateJS'; // To set/change. May trigger onEnter and onLeave callbacks.
~~~


#### Add/remove states.

You can add states by calling `.add(config)`. To remove states, call `.remove([stateName1, stateName2, ...])`.

#### Current Limitation

In current version, `entry` cannot be either _object_ or _array_. However, you can compare/manipulate such types by defining `entry` as a function and then access object/array through the passed argument.

#### License 

MIT
