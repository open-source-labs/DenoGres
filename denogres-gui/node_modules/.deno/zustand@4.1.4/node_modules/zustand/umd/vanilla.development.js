(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.zustandVanilla = factory());
})(this, (function () { 'use strict';

  var createStoreImpl = function createStoreImpl(createState) {
    var state;
    var listeners = new Set();
    var setState = function setState(partial, replace) {
      var nextState = typeof partial === 'function' ? partial(state) : partial;
      if (!Object.is(nextState, state)) {
        var _previousState = state;
        state = (replace != null ? replace : typeof nextState !== 'object') ? nextState : Object.assign({}, state, nextState);
        listeners.forEach(function (listener) {
          return listener(state, _previousState);
        });
      }
    };
    var getState = function getState() {
      return state;
    };
    var subscribe = function subscribe(listener) {
      listeners.add(listener);
      return function () {
        return listeners.delete(listener);
      };
    };
    var destroy = function destroy() {
      return listeners.clear();
    };
    var api = {
      setState: setState,
      getState: getState,
      subscribe: subscribe,
      destroy: destroy
    };
    state = createState(setState, getState, api);
    return api;
  };
  var createStore = function createStore(createState) {
    return createState ? createStoreImpl(createState) : createStoreImpl;
  };

  return createStore;

}));
