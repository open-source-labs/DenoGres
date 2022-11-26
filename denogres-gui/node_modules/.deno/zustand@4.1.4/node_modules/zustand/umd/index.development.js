(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('zustand/vanilla'), require('react'), require('use-sync-external-store/shim/with-selector')) :
  typeof define === 'function' && define.amd ? define(['exports', 'zustand/vanilla', 'react', 'use-sync-external-store/shim/with-selector'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.zustand = {}, global.zustandVanilla, global.React, global.useSyncExternalStoreShimWithSelector));
})(this, (function (exports, createStore, react, useSyncExternalStoreExports) { 'use strict';

  var useSyncExternalStoreWithSelector = useSyncExternalStoreExports.useSyncExternalStoreWithSelector;
  function useStore(api, selector, equalityFn) {
    if (selector === void 0) {
      selector = api.getState;
    }
    var slice = useSyncExternalStoreWithSelector(api.subscribe, api.getState, api.getServerState || api.getState, selector, equalityFn);
    react.useDebugValue(slice);
    return slice;
  }
  var createImpl = function createImpl(createState) {
    var api = typeof createState === 'function' ? createStore(createState) : createState;
    var useBoundStore = function useBoundStore(selector, equalityFn) {
      return useStore(api, selector, equalityFn);
    };
    Object.assign(useBoundStore, api);
    return useBoundStore;
  };
  var create = function create(createState) {
    return createState ? createImpl(createState) : createImpl;
  };
  var create$1 = create;

  exports.createStore = createStore;
  exports.default = create$1;
  exports.useStore = useStore;
  Object.keys(createStore).forEach(function (k) {
    if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () { return createStore[k]; }
    });
  });

  Object.defineProperty(exports, '__esModule', { value: true });

}));
