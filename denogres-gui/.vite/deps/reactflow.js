import {
  require_jsx_runtime
} from "./chunk-WKVYYAQV.js";
import {
  require_react_dom
} from "./chunk-DRANYMSX.js";
import {
  __commonJS,
  __toESM,
  require_react
} from "./chunk-BJFMU22U.js";

// node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js
var require_use_sync_external_store_shim_development = __commonJS({
  "node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
        function error(format) {
          {
            {
              for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
                args[_key2 - 1] = arguments[_key2];
              }
              printWarning("error", format, args);
            }
          }
        }
        function printWarning(level, format, args) {
          {
            var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
            var stack = ReactDebugCurrentFrame.getStackAddendum();
            if (stack !== "") {
              format += "%s";
              args = args.concat([stack]);
            }
            var argsWithFormat = args.map(function(item) {
              return String(item);
            });
            argsWithFormat.unshift("Warning: " + format);
            Function.prototype.apply.call(console[level], console, argsWithFormat);
          }
        }
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useState3 = React.useState, useEffect4 = React.useEffect, useLayoutEffect = React.useLayoutEffect, useDebugValue2 = React.useDebugValue;
        var didWarnOld18Alpha = false;
        var didWarnUncachedGetSnapshot = false;
        function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
          {
            if (!didWarnOld18Alpha) {
              if (React.startTransition !== void 0) {
                didWarnOld18Alpha = true;
                error("You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release.");
              }
            }
          }
          var value = getSnapshot();
          {
            if (!didWarnUncachedGetSnapshot) {
              var cachedValue = getSnapshot();
              if (!objectIs(value, cachedValue)) {
                error("The result of getSnapshot should be cached to avoid an infinite loop");
                didWarnUncachedGetSnapshot = true;
              }
            }
          }
          var _useState = useState3({
            inst: {
              value,
              getSnapshot
            }
          }), inst = _useState[0].inst, forceUpdate = _useState[1];
          useLayoutEffect(function() {
            inst.value = value;
            inst.getSnapshot = getSnapshot;
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
          }, [subscribe, value, getSnapshot]);
          useEffect4(function() {
            if (checkIfSnapshotChanged(inst)) {
              forceUpdate({
                inst
              });
            }
            var handleStoreChange = function() {
              if (checkIfSnapshotChanged(inst)) {
                forceUpdate({
                  inst
                });
              }
            };
            return subscribe(handleStoreChange);
          }, [subscribe]);
          useDebugValue2(value);
          return value;
        }
        function checkIfSnapshotChanged(inst) {
          var latestGetSnapshot = inst.getSnapshot;
          var prevValue = inst.value;
          try {
            var nextValue = latestGetSnapshot();
            return !objectIs(prevValue, nextValue);
          } catch (error2) {
            return true;
          }
        }
        function useSyncExternalStore$1(subscribe, getSnapshot, getServerSnapshot) {
          return getSnapshot();
        }
        var canUseDOM = !!(typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined");
        var isServerEnvironment = !canUseDOM;
        var shim = isServerEnvironment ? useSyncExternalStore$1 : useSyncExternalStore;
        var useSyncExternalStore$2 = React.useSyncExternalStore !== void 0 ? React.useSyncExternalStore : shim;
        exports.useSyncExternalStore = useSyncExternalStore$2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/shim/index.js
var require_shim = __commonJS({
  "node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/shim/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_use_sync_external_store_shim_development();
    }
  }
});

// node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js
var require_with_selector_development = __commonJS({
  "node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js"(exports) {
    "use strict";
    if (true) {
      (function() {
        "use strict";
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
        }
        var React = require_react();
        var shim = require_shim();
        function is(x, y) {
          return x === y && (x !== 0 || 1 / x === 1 / y) || x !== x && y !== y;
        }
        var objectIs = typeof Object.is === "function" ? Object.is : is;
        var useSyncExternalStore = shim.useSyncExternalStore;
        var useRef4 = React.useRef, useEffect4 = React.useEffect, useMemo2 = React.useMemo, useDebugValue2 = React.useDebugValue;
        function useSyncExternalStoreWithSelector2(subscribe, getSnapshot, getServerSnapshot, selector5, isEqual) {
          var instRef = useRef4(null);
          var inst;
          if (instRef.current === null) {
            inst = {
              hasValue: false,
              value: null
            };
            instRef.current = inst;
          } else {
            inst = instRef.current;
          }
          var _useMemo = useMemo2(function() {
            var hasMemo = false;
            var memoizedSnapshot;
            var memoizedSelection;
            var memoizedSelector = function(nextSnapshot) {
              if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                var _nextSelection = selector5(nextSnapshot);
                if (isEqual !== void 0) {
                  if (inst.hasValue) {
                    var currentSelection = inst.value;
                    if (isEqual(currentSelection, _nextSelection)) {
                      memoizedSelection = currentSelection;
                      return currentSelection;
                    }
                  }
                }
                memoizedSelection = _nextSelection;
                return _nextSelection;
              }
              var prevSnapshot = memoizedSnapshot;
              var prevSelection = memoizedSelection;
              if (objectIs(prevSnapshot, nextSnapshot)) {
                return prevSelection;
              }
              var nextSelection = selector5(nextSnapshot);
              if (isEqual !== void 0 && isEqual(prevSelection, nextSelection)) {
                return prevSelection;
              }
              memoizedSnapshot = nextSnapshot;
              memoizedSelection = nextSelection;
              return nextSelection;
            };
            var maybeGetServerSnapshot = getServerSnapshot === void 0 ? null : getServerSnapshot;
            var getSnapshotWithSelector = function() {
              return memoizedSelector(getSnapshot());
            };
            var getServerSnapshotWithSelector = maybeGetServerSnapshot === null ? void 0 : function() {
              return memoizedSelector(maybeGetServerSnapshot());
            };
            return [getSnapshotWithSelector, getServerSnapshotWithSelector];
          }, [getSnapshot, getServerSnapshot, selector5, isEqual]), getSelection = _useMemo[0], getServerSelection = _useMemo[1];
          var value = useSyncExternalStore(subscribe, getSelection, getServerSelection);
          useEffect4(function() {
            inst.hasValue = true;
            inst.value = value;
          }, [value]);
          useDebugValue2(value);
          return value;
        }
        exports.useSyncExternalStoreWithSelector = useSyncExternalStoreWithSelector2;
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
          __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
        }
      })();
    }
  }
});

// node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/shim/with-selector.js
var require_with_selector = __commonJS({
  "node_modules/.deno/use-sync-external-store@1.2.0/node_modules/use-sync-external-store/shim/with-selector.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_with_selector_development();
    }
  }
});

// node_modules/.deno/@reactflow+core@11.3.0/node_modules/@reactflow/core/dist/esm/index.js
var import_jsx_runtime = __toESM(require_jsx_runtime());
var import_react2 = __toESM(require_react());

// node_modules/.deno/classcat@5.0.4/node_modules/classcat/index.js
function cc(names) {
  if (typeof names === "string" || typeof names === "number")
    return "" + names;
  let out = "";
  if (Array.isArray(names)) {
    for (let i = 0, tmp; i < names.length; i++) {
      if ((tmp = cc(names[i])) !== "") {
        out += (out && " ") + tmp;
      }
    }
  } else {
    for (let k in names) {
      if (names[k])
        out += (out && " ") + k;
    }
  }
  return out;
}

// node_modules/.deno/zustand@4.1.4/node_modules/zustand/esm/vanilla.mjs
var createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object") ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const destroy = () => listeners.clear();
  const api = { setState, getState, subscribe, destroy };
  state = createState(setState, getState, api);
  return api;
};
var createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

// node_modules/.deno/zustand@4.1.4/node_modules/zustand/esm/index.mjs
var import_react = __toESM(require_react(), 1);
var import_with_selector = __toESM(require_with_selector(), 1);
var { useSyncExternalStoreWithSelector } = import_with_selector.default;
function useStore(api, selector5 = api.getState, equalityFn) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector5,
    equalityFn
  );
  (0, import_react.useDebugValue)(slice);
  return slice;
}

// node_modules/.deno/zustand@4.1.4/node_modules/zustand/esm/shallow.mjs
function shallow(objA, objB) {
  if (Object.is(objA, objB)) {
    return true;
  }
  if (typeof objA !== "object" || objA === null || typeof objB !== "object" || objB === null) {
    return false;
  }
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) {
    return false;
  }
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }
  return true;
}

// node_modules/.deno/d3-dispatch@3.0.1/node_modules/d3-dispatch/src/dispatch.js
var noop = { value: () => {
} };
function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _ || /[\s.]/.test(t))
      throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}
function Dispatch(_) {
  this._ = _;
}
function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t))
      throw new Error("unknown type: " + t);
    return { type: t, name };
  });
}
Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._, T = parseTypenames(typename + "", _), t, i = -1, n = T.length;
    if (arguments.length < 2) {
      while (++i < n)
        if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name)))
          return t;
      return;
    }
    if (callback != null && typeof callback !== "function")
      throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type)
        _[t] = set(_[t], typename.name, callback);
      else if (callback == null)
        for (t in _)
          _[t] = set(_[t], typename.name, null);
    }
    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _)
      copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0)
      for (var args = new Array(n), i = 0, n, t; i < n; ++i)
        args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type))
      throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i)
      t[i].value.apply(that, args);
  }
};
function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}
function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null)
    type.push({ name, value: callback });
  return type;
}
var dispatch_default = dispatch;

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/namespaces.js
var xhtml = "http://www.w3.org/1999/xhtml";
var namespaces_default = {
  svg: "http://www.w3.org/2000/svg",
  xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/namespace.js
function namespace_default(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
    name = name.slice(i + 1);
  return namespaces_default.hasOwnProperty(prefix) ? { space: namespaces_default[prefix], local: name } : name;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/creator.js
function creatorInherit(name) {
  return function() {
    var document2 = this.ownerDocument, uri = this.namespaceURI;
    return uri === xhtml && document2.documentElement.namespaceURI === xhtml ? document2.createElement(name) : document2.createElementNS(uri, name);
  };
}
function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}
function creator_default(name) {
  var fullname = namespace_default(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selector.js
function none() {
}
function selector_default(selector5) {
  return selector5 == null ? none : function() {
    return this.querySelector(selector5);
  };
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/select.js
function select_default(select) {
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/array.js
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selectorAll.js
function empty() {
  return [];
}
function selectorAll_default(selector5) {
  return selector5 == null ? empty : function() {
    return this.querySelectorAll(selector5);
  };
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectAll.js
function arrayAll(select) {
  return function() {
    return array(select.apply(this, arguments));
  };
}
function selectAll_default(select) {
  if (typeof select === "function")
    select = arrayAll(select);
  else
    select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }
  return new Selection(subgroups, parents);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/matcher.js
function matcher_default(selector5) {
  return function() {
    return this.matches(selector5);
  };
}
function childMatcher(selector5) {
  return function(node) {
    return node.matches(selector5);
  };
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChild.js
var find = Array.prototype.find;
function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}
function childFirst() {
  return this.firstElementChild;
}
function selectChild_default(match) {
  return this.select(match == null ? childFirst : childFind(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/selectChildren.js
var filter = Array.prototype.filter;
function children() {
  return Array.from(this.children);
}
function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}
function selectChildren_default(match) {
  return this.selectAll(match == null ? children : childrenFilter(typeof match === "function" ? match : childMatcher(match)));
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/filter.js
function filter_default(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Selection(subgroups, this._parents);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sparse.js
function sparse_default(update) {
  return new Array(update.length);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/enter.js
function enter_default() {
  return new Selection(this._enter || this._groups.map(sparse_default), this._parents);
}
function EnterNode(parent, datum2) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum2;
}
EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function(selector5) {
    return this._parent.querySelector(selector5);
  },
  querySelectorAll: function(selector5) {
    return this._parent.querySelectorAll(selector5);
  }
};

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/constant.js
function constant_default(x) {
  return function() {
    return x;
  };
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/data.js
function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0, node, groupLength = group.length, dataLength = data.length;
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}
function bindKey(parent, group, enter, update, exit, data, key) {
  var i, node, nodeByKeyValue = /* @__PURE__ */ new Map(), groupLength = group.length, dataLength = data.length, keyValues = new Array(groupLength), keyValue;
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue.get(keyValues[i]) === node) {
      exit[i] = node;
    }
  }
}
function datum(node) {
  return node.__data__;
}
function data_default(value, key) {
  if (!arguments.length)
    return Array.from(this, datum);
  var bind = key ? bindKey : bindIndex, parents = this._parents, groups = this._groups;
  if (typeof value !== "function")
    value = constant_default(value);
  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j], group = groups[j], groupLength = group.length, data = arraylike(value.call(parent, parent && parent.__data__, j, parents)), dataLength = data.length, enterGroup = enter[j] = new Array(dataLength), updateGroup = update[j] = new Array(dataLength), exitGroup = exit[j] = new Array(groupLength);
    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1)
          i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength)
          ;
        previous._next = next || null;
      }
    }
  }
  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}
function arraylike(data) {
  return typeof data === "object" && "length" in data ? data : Array.from(data);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/exit.js
function exit_default() {
  return new Selection(this._exit || this._groups.map(sparse_default), this._parents);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/join.js
function join_default(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter)
      enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update)
      update = update.selection();
  }
  if (onexit == null)
    exit.remove();
  else
    onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/merge.js
function merge_default(context) {
  var selection2 = context.selection ? context.selection() : context;
  for (var groups0 = this._groups, groups1 = selection2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Selection(merges, this._parents);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/order.js
function order_default() {
  for (var groups = this._groups, j = -1, m = groups.length; ++j < m; ) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4)
          next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }
  return this;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/sort.js
function sort_default(compare) {
  if (!compare)
    compare = ascending;
  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }
  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }
  return new Selection(sortgroups, this._parents).order();
}
function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/call.js
function call_default() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/nodes.js
function nodes_default() {
  return Array.from(this);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/node.js
function node_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node)
        return node;
    }
  }
  return null;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/size.js
function size_default() {
  let size = 0;
  for (const node of this)
    ++size;
  return size;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/empty.js
function empty_default() {
  return !this.node();
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/each.js
function each_default(callback) {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        callback.call(node, node.__data__, i, group);
    }
  }
  return this;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/attr.js
function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}
function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}
function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttribute(name);
    else
      this.setAttribute(name, v);
  };
}
function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.removeAttributeNS(fullname.space, fullname.local);
    else
      this.setAttributeNS(fullname.space, fullname.local, v);
  };
}
function attr_default(name, value) {
  var fullname = namespace_default(name);
  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }
  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/window.js
function window_default(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/style.js
function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}
function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      this.style.removeProperty(name);
    else
      this.style.setProperty(name, v, priority);
  };
}
function style_default(name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
}
function styleValue(node, name) {
  return node.style.getPropertyValue(name) || window_default(node).getComputedStyle(node, null).getPropertyValue(name);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/property.js
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}
function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}
function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null)
      delete this[name];
    else
      this[name] = v;
  };
}
function property_default(name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/classed.js
function classArray(string) {
  return string.trim().split(/^|\s+/);
}
function classList(node) {
  return node.classList || new ClassList(node);
}
function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}
ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};
function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.add(names[i]);
}
function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n)
    list.remove(names[i]);
}
function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}
function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}
function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}
function classed_default(name, value) {
  var names = classArray(name + "");
  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n)
      if (!list.contains(names[i]))
        return false;
    return true;
  }
  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/text.js
function textRemove() {
  this.textContent = "";
}
function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}
function text_default(value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/html.js
function htmlRemove() {
  this.innerHTML = "";
}
function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}
function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}
function html_default(value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/raise.js
function raise() {
  if (this.nextSibling)
    this.parentNode.appendChild(this);
}
function raise_default() {
  return this.each(raise);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/lower.js
function lower() {
  if (this.previousSibling)
    this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function lower_default() {
  return this.each(lower);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/append.js
function append_default(name) {
  var create2 = typeof name === "function" ? name : creator_default(name);
  return this.select(function() {
    return this.appendChild(create2.apply(this, arguments));
  });
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/insert.js
function constantNull() {
  return null;
}
function insert_default(name, before) {
  var create2 = typeof name === "function" ? name : creator_default(name), select = before == null ? constantNull : typeof before === "function" ? before : selector_default(before);
  return this.select(function() {
    return this.insertBefore(create2.apply(this, arguments), select.apply(this, arguments) || null);
  });
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/remove.js
function remove() {
  var parent = this.parentNode;
  if (parent)
    parent.removeChild(this);
}
function remove_default() {
  return this.each(remove);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/clone.js
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}
function clone_default(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/datum.js
function datum_default(value) {
  return arguments.length ? this.property("__data__", value) : this.node().__data__;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/on.js
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}
function parseTypenames2(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0)
      name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name };
  });
}
function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on)
      return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i)
      on.length = i;
    else
      delete this.__on;
  };
}
function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on)
      for (var j = 0, m = on.length; j < m; ++j) {
        if ((o = on[j]).type === typename.type && o.name === typename.name) {
          this.removeEventListener(o.type, o.listener, o.options);
          this.addEventListener(o.type, o.listener = listener, o.options = options);
          o.value = value;
          return;
        }
      }
    this.addEventListener(typename.type, listener, options);
    o = { type: typename.type, name: typename.name, value, listener, options };
    if (!on)
      this.__on = [o];
    else
      on.push(o);
  };
}
function on_default(typename, value, options) {
  var typenames = parseTypenames2(typename + ""), i, n = typenames.length, t;
  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on)
      for (var j = 0, m = on.length, o; j < m; ++j) {
        for (i = 0, o = on[j]; i < n; ++i) {
          if ((t = typenames[i]).type === o.type && t.name === o.name) {
            return o.value;
          }
        }
      }
    return;
  }
  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i)
    this.each(on(typenames[i], value, options));
  return this;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/dispatch.js
function dispatchEvent(node, type, params) {
  var window2 = window_default(node), event = window2.CustomEvent;
  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window2.document.createEvent("Event");
    if (params)
      event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else
      event.initEvent(type, false, false);
  }
  node.dispatchEvent(event);
}
function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}
function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}
function dispatch_default2(type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/iterator.js
function* iterator_default() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i])
        yield node;
    }
  }
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/selection/index.js
var root = [null];
function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}
function selection() {
  return new Selection([[document.documentElement]], root);
}
function selection_selection() {
  return this;
}
Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: select_default,
  selectAll: selectAll_default,
  selectChild: selectChild_default,
  selectChildren: selectChildren_default,
  filter: filter_default,
  data: data_default,
  enter: enter_default,
  exit: exit_default,
  join: join_default,
  merge: merge_default,
  selection: selection_selection,
  order: order_default,
  sort: sort_default,
  call: call_default,
  nodes: nodes_default,
  node: node_default,
  size: size_default,
  empty: empty_default,
  each: each_default,
  attr: attr_default,
  style: style_default,
  property: property_default,
  classed: classed_default,
  text: text_default,
  html: html_default,
  raise: raise_default,
  lower: lower_default,
  append: append_default,
  insert: insert_default,
  remove: remove_default,
  clone: clone_default,
  datum: datum_default,
  on: on_default,
  dispatch: dispatch_default2,
  [Symbol.iterator]: iterator_default
};
var selection_default = selection;

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/select.js
function select_default2(selector5) {
  return typeof selector5 === "string" ? new Selection([[document.querySelector(selector5)]], [document.documentElement]) : new Selection([[selector5]], root);
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/local.js
var nextId = 0;
function local() {
  return new Local();
}
function Local() {
  this._ = "@" + (++nextId).toString(36);
}
Local.prototype = local.prototype = {
  constructor: Local,
  get: function(node) {
    var id2 = this._;
    while (!(id2 in node))
      if (!(node = node.parentNode))
        return;
    return node[id2];
  },
  set: function(node, value) {
    return node[this._] = value;
  },
  remove: function(node) {
    return this._ in node && delete node[this._];
  },
  toString: function() {
    return this._;
  }
};

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/sourceEvent.js
function sourceEvent_default(event) {
  let sourceEvent;
  while (sourceEvent = event.sourceEvent)
    event = sourceEvent;
  return event;
}

// node_modules/.deno/d3-selection@3.0.0/node_modules/d3-selection/src/pointer.js
function pointer_default(event, node) {
  event = sourceEvent_default(event);
  if (node === void 0)
    node = event.currentTarget;
  if (node) {
    var svg = node.ownerSVGElement || node;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      point.x = event.clientX, point.y = event.clientY;
      point = point.matrixTransform(node.getScreenCTM().inverse());
      return [point.x, point.y];
    }
    if (node.getBoundingClientRect) {
      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }
  }
  return [event.pageX, event.pageY];
}

// node_modules/.deno/d3-drag@3.0.0/node_modules/d3-drag/src/noevent.js
var nonpassive = { passive: false };
var nonpassivecapture = { capture: true, passive: false };
function nopropagation(event) {
  event.stopImmediatePropagation();
}
function noevent_default(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/.deno/d3-drag@3.0.0/node_modules/d3-drag/src/nodrag.js
function nodrag_default(view) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", noevent_default, nonpassivecapture);
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", noevent_default, nonpassivecapture);
  } else {
    root2.__noselect = root2.style.MozUserSelect;
    root2.style.MozUserSelect = "none";
  }
}
function yesdrag(view, noclick) {
  var root2 = view.document.documentElement, selection2 = select_default2(view).on("dragstart.drag", null);
  if (noclick) {
    selection2.on("click.drag", noevent_default, nonpassivecapture);
    setTimeout(function() {
      selection2.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root2) {
    selection2.on("selectstart.drag", null);
  } else {
    root2.style.MozUserSelect = root2.__noselect;
    delete root2.__noselect;
  }
}

// node_modules/.deno/d3-drag@3.0.0/node_modules/d3-drag/src/constant.js
var constant_default2 = (x) => () => x;

// node_modules/.deno/d3-drag@3.0.0/node_modules/d3-drag/src/event.js
function DragEvent(type, {
  sourceEvent,
  subject,
  target,
  identifier,
  active,
  x,
  y,
  dx,
  dy,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    subject: { value: subject, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    identifier: { value: identifier, enumerable: true, configurable: true },
    active: { value: active, enumerable: true, configurable: true },
    x: { value: x, enumerable: true, configurable: true },
    y: { value: y, enumerable: true, configurable: true },
    dx: { value: dx, enumerable: true, configurable: true },
    dy: { value: dy, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}
DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// node_modules/.deno/d3-drag@3.0.0/node_modules/d3-drag/src/drag.js
function defaultFilter(event) {
  return !event.ctrlKey && !event.button;
}
function defaultContainer() {
  return this.parentNode;
}
function defaultSubject(event, d) {
  return d == null ? { x: event.x, y: event.y } : d;
}
function defaultTouchable() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function drag_default() {
  var filter2 = defaultFilter, container = defaultContainer, subject = defaultSubject, touchable = defaultTouchable, gestures = {}, listeners = dispatch_default("start", "drag", "end"), active = 0, mousedownx, mousedowny, mousemoving, touchending, clickDistance2 = 0;
  function drag(selection2) {
    selection2.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved, nonpassive).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function mousedowned(event, d) {
    if (touchending || !filter2.call(this, event, d))
      return;
    var gesture = beforestart(this, container.call(this, event, d), event, d, "mouse");
    if (!gesture)
      return;
    select_default2(event.view).on("mousemove.drag", mousemoved, nonpassivecapture).on("mouseup.drag", mouseupped, nonpassivecapture);
    nodrag_default(event.view);
    nopropagation(event);
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start", event);
  }
  function mousemoved(event) {
    noevent_default(event);
    if (!mousemoving) {
      var dx = event.clientX - mousedownx, dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag", event);
  }
  function mouseupped(event) {
    select_default2(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent_default(event);
    gestures.mouse("end", event);
  }
  function touchstarted(event, d) {
    if (!filter2.call(this, event, d))
      return;
    var touches = event.changedTouches, c = container.call(this, event, d), n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(this, c, event, d, touches[i].identifier, touches[i])) {
        nopropagation(event);
        gesture("start", event, touches[i]);
      }
    }
  }
  function touchmoved(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent_default(event);
        gesture("drag", event, touches[i]);
      }
    }
  }
  function touchended(event) {
    var touches = event.changedTouches, n = touches.length, i, gesture;
    if (touchending)
      clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, 500);
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation(event);
        gesture("end", event, touches[i]);
      }
    }
  }
  function beforestart(that, container2, event, d, identifier, touch) {
    var dispatch2 = listeners.copy(), p = pointer_default(touch || event, container2), dx, dy, s;
    if ((s = subject.call(that, new DragEvent("beforestart", {
      sourceEvent: event,
      target: drag,
      identifier,
      active,
      x: p[0],
      y: p[1],
      dx: 0,
      dy: 0,
      dispatch: dispatch2
    }), d)) == null)
      return;
    dx = s.x - p[0] || 0;
    dy = s.y - p[1] || 0;
    return function gesture(type, event2, touch2) {
      var p0 = p, n;
      switch (type) {
        case "start":
          gestures[identifier] = gesture, n = active++;
          break;
        case "end":
          delete gestures[identifier], --active;
        case "drag":
          p = pointer_default(touch2 || event2, container2), n = active;
          break;
      }
      dispatch2.call(
        type,
        that,
        new DragEvent(type, {
          sourceEvent: event2,
          subject: s,
          target: drag,
          identifier,
          active: n,
          x: p[0] + dx,
          y: p[1] + dy,
          dx: p[0] - p0[0],
          dy: p[1] - p0[1],
          dispatch: dispatch2
        }),
        d
      );
    };
  }
  drag.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default2(!!_), drag) : filter2;
  };
  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant_default2(_), drag) : container;
  };
  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant_default2(_), drag) : subject;
  };
  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default2(!!_), drag) : touchable;
  };
  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };
  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };
  return drag;
}

// node_modules/.deno/d3-color@3.1.0/node_modules/d3-color/src/define.js
function define_default(constructor, factory, prototype) {
  constructor.prototype = factory.prototype = prototype;
  prototype.constructor = constructor;
}
function extend(parent, definition) {
  var prototype = Object.create(parent.prototype);
  for (var key in definition)
    prototype[key] = definition[key];
  return prototype;
}

// node_modules/.deno/d3-color@3.1.0/node_modules/d3-color/src/color.js
function Color() {
}
var darker = 0.7;
var brighter = 1 / darker;
var reI = "\\s*([+-]?\\d+)\\s*";
var reN = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*";
var reP = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*";
var reHex = /^#([0-9a-f]{3,8})$/;
var reRgbInteger = new RegExp(`^rgb\\(${reI},${reI},${reI}\\)$`);
var reRgbPercent = new RegExp(`^rgb\\(${reP},${reP},${reP}\\)$`);
var reRgbaInteger = new RegExp(`^rgba\\(${reI},${reI},${reI},${reN}\\)$`);
var reRgbaPercent = new RegExp(`^rgba\\(${reP},${reP},${reP},${reN}\\)$`);
var reHslPercent = new RegExp(`^hsl\\(${reN},${reP},${reP}\\)$`);
var reHslaPercent = new RegExp(`^hsla\\(${reN},${reP},${reP},${reN}\\)$`);
var named = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
define_default(Color, color, {
  copy(channels) {
    return Object.assign(new this.constructor(), this, channels);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: color_formatHex,
  formatHex: color_formatHex,
  formatHex8: color_formatHex8,
  formatHsl: color_formatHsl,
  formatRgb: color_formatRgb,
  toString: color_formatRgb
});
function color_formatHex() {
  return this.rgb().formatHex();
}
function color_formatHex8() {
  return this.rgb().formatHex8();
}
function color_formatHsl() {
  return hslConvert(this).formatHsl();
}
function color_formatRgb() {
  return this.rgb().formatRgb();
}
function color(format) {
  var m, l;
  format = (format + "").trim().toLowerCase();
  return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) : l === 3 ? new Rgb(m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, (m & 15) << 4 | m & 15, 1) : l === 8 ? rgba(m >> 24 & 255, m >> 16 & 255, m >> 8 & 255, (m & 255) / 255) : l === 4 ? rgba(m >> 12 & 15 | m >> 8 & 240, m >> 8 & 15 | m >> 4 & 240, m >> 4 & 15 | m & 240, ((m & 15) << 4 | m & 15) / 255) : null) : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) : named.hasOwnProperty(format) ? rgbn(named[format]) : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0) : null;
}
function rgbn(n) {
  return new Rgb(n >> 16 & 255, n >> 8 & 255, n & 255, 1);
}
function rgba(r, g, b, a) {
  if (a <= 0)
    r = g = b = NaN;
  return new Rgb(r, g, b, a);
}
function rgbConvert(o) {
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Rgb();
  o = o.rgb();
  return new Rgb(o.r, o.g, o.b, o.opacity);
}
function rgb(r, g, b, opacity) {
  return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
}
function Rgb(r, g, b, opacity) {
  this.r = +r;
  this.g = +g;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Rgb, rgb, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Rgb(clampi(this.r), clampi(this.g), clampi(this.b), clampa(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && (-0.5 <= this.g && this.g < 255.5) && (-0.5 <= this.b && this.b < 255.5) && (0 <= this.opacity && this.opacity <= 1);
  },
  hex: rgb_formatHex,
  formatHex: rgb_formatHex,
  formatHex8: rgb_formatHex8,
  formatRgb: rgb_formatRgb,
  toString: rgb_formatRgb
}));
function rgb_formatHex() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}`;
}
function rgb_formatHex8() {
  return `#${hex(this.r)}${hex(this.g)}${hex(this.b)}${hex((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function rgb_formatRgb() {
  const a = clampa(this.opacity);
  return `${a === 1 ? "rgb(" : "rgba("}${clampi(this.r)}, ${clampi(this.g)}, ${clampi(this.b)}${a === 1 ? ")" : `, ${a})`}`;
}
function clampa(opacity) {
  return isNaN(opacity) ? 1 : Math.max(0, Math.min(1, opacity));
}
function clampi(value) {
  return Math.max(0, Math.min(255, Math.round(value) || 0));
}
function hex(value) {
  value = clampi(value);
  return (value < 16 ? "0" : "") + value.toString(16);
}
function hsla(h, s, l, a) {
  if (a <= 0)
    h = s = l = NaN;
  else if (l <= 0 || l >= 1)
    h = s = NaN;
  else if (s <= 0)
    h = NaN;
  return new Hsl(h, s, l, a);
}
function hslConvert(o) {
  if (o instanceof Hsl)
    return new Hsl(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Color))
    o = color(o);
  if (!o)
    return new Hsl();
  if (o instanceof Hsl)
    return o;
  o = o.rgb();
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, min = Math.min(r, g, b), max = Math.max(r, g, b), h = NaN, s = max - min, l = (max + min) / 2;
  if (s) {
    if (r === max)
      h = (g - b) / s + (g < b) * 6;
    else if (g === max)
      h = (b - r) / s + 2;
    else
      h = (r - g) / s + 4;
    s /= l < 0.5 ? max + min : 2 - max - min;
    h *= 60;
  } else {
    s = l > 0 && l < 1 ? 0 : h;
  }
  return new Hsl(h, s, l, o.opacity);
}
function hsl(h, s, l, opacity) {
  return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
}
function Hsl(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Hsl, hsl, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = this.h % 360 + (this.h < 0) * 360, s = isNaN(h) || isNaN(this.s) ? 0 : this.s, l = this.l, m2 = l + (l < 0.5 ? l : 1 - l) * s, m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
      this.opacity
    );
  },
  clamp() {
    return new Hsl(clamph(this.h), clampt(this.s), clampt(this.l), clampa(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && (0 <= this.l && this.l <= 1) && (0 <= this.opacity && this.opacity <= 1);
  },
  formatHsl() {
    const a = clampa(this.opacity);
    return `${a === 1 ? "hsl(" : "hsla("}${clamph(this.h)}, ${clampt(this.s) * 100}%, ${clampt(this.l) * 100}%${a === 1 ? ")" : `, ${a})`}`;
  }
}));
function clamph(value) {
  value = (value || 0) % 360;
  return value < 0 ? value + 360 : value;
}
function clampt(value) {
  return Math.max(0, Math.min(1, value || 0));
}
function hsl2rgb(h, m1, m2) {
  return (h < 60 ? m1 + (m2 - m1) * h / 60 : h < 180 ? m2 : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60 : m1) * 255;
}

// node_modules/.deno/d3-color@3.1.0/node_modules/d3-color/src/math.js
var radians = Math.PI / 180;
var degrees = 180 / Math.PI;

// node_modules/.deno/d3-color@3.1.0/node_modules/d3-color/src/lab.js
var K = 18;
var Xn = 0.96422;
var Yn = 1;
var Zn = 0.82521;
var t0 = 4 / 29;
var t1 = 6 / 29;
var t2 = 3 * t1 * t1;
var t3 = t1 * t1 * t1;
function labConvert(o) {
  if (o instanceof Lab)
    return new Lab(o.l, o.a, o.b, o.opacity);
  if (o instanceof Hcl)
    return hcl2lab(o);
  if (!(o instanceof Rgb))
    o = rgbConvert(o);
  var r = rgb2lrgb(o.r), g = rgb2lrgb(o.g), b = rgb2lrgb(o.b), y = xyz2lab((0.2225045 * r + 0.7168786 * g + 0.0606169 * b) / Yn), x, z;
  if (r === g && g === b)
    x = z = y;
  else {
    x = xyz2lab((0.4360747 * r + 0.3850649 * g + 0.1430804 * b) / Xn);
    z = xyz2lab((0.0139322 * r + 0.0971045 * g + 0.7141733 * b) / Zn);
  }
  return new Lab(116 * y - 16, 500 * (x - y), 200 * (y - z), o.opacity);
}
function lab(l, a, b, opacity) {
  return arguments.length === 1 ? labConvert(l) : new Lab(l, a, b, opacity == null ? 1 : opacity);
}
function Lab(l, a, b, opacity) {
  this.l = +l;
  this.a = +a;
  this.b = +b;
  this.opacity = +opacity;
}
define_default(Lab, lab, extend(Color, {
  brighter(k) {
    return new Lab(this.l + K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  darker(k) {
    return new Lab(this.l - K * (k == null ? 1 : k), this.a, this.b, this.opacity);
  },
  rgb() {
    var y = (this.l + 16) / 116, x = isNaN(this.a) ? y : y + this.a / 500, z = isNaN(this.b) ? y : y - this.b / 200;
    x = Xn * lab2xyz(x);
    y = Yn * lab2xyz(y);
    z = Zn * lab2xyz(z);
    return new Rgb(
      lrgb2rgb(3.1338561 * x - 1.6168667 * y - 0.4906146 * z),
      lrgb2rgb(-0.9787684 * x + 1.9161415 * y + 0.033454 * z),
      lrgb2rgb(0.0719453 * x - 0.2289914 * y + 1.4052427 * z),
      this.opacity
    );
  }
}));
function xyz2lab(t) {
  return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
}
function lab2xyz(t) {
  return t > t1 ? t * t * t : t2 * (t - t0);
}
function lrgb2rgb(x) {
  return 255 * (x <= 31308e-7 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
}
function rgb2lrgb(x) {
  return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}
function hclConvert(o) {
  if (o instanceof Hcl)
    return new Hcl(o.h, o.c, o.l, o.opacity);
  if (!(o instanceof Lab))
    o = labConvert(o);
  if (o.a === 0 && o.b === 0)
    return new Hcl(NaN, 0 < o.l && o.l < 100 ? 0 : NaN, o.l, o.opacity);
  var h = Math.atan2(o.b, o.a) * degrees;
  return new Hcl(h < 0 ? h + 360 : h, Math.sqrt(o.a * o.a + o.b * o.b), o.l, o.opacity);
}
function hcl(h, c, l, opacity) {
  return arguments.length === 1 ? hclConvert(h) : new Hcl(h, c, l, opacity == null ? 1 : opacity);
}
function Hcl(h, c, l, opacity) {
  this.h = +h;
  this.c = +c;
  this.l = +l;
  this.opacity = +opacity;
}
function hcl2lab(o) {
  if (isNaN(o.h))
    return new Lab(o.l, 0, 0, o.opacity);
  var h = o.h * radians;
  return new Lab(o.l, Math.cos(h) * o.c, Math.sin(h) * o.c, o.opacity);
}
define_default(Hcl, hcl, extend(Color, {
  brighter(k) {
    return new Hcl(this.h, this.c, this.l + K * (k == null ? 1 : k), this.opacity);
  },
  darker(k) {
    return new Hcl(this.h, this.c, this.l - K * (k == null ? 1 : k), this.opacity);
  },
  rgb() {
    return hcl2lab(this).rgb();
  }
}));

// node_modules/.deno/d3-color@3.1.0/node_modules/d3-color/src/cubehelix.js
var A = -0.14861;
var B = 1.78277;
var C = -0.29227;
var D = -0.90649;
var E = 1.97294;
var ED = E * D;
var EB = E * B;
var BC_DA = B * C - D * A;
function cubehelixConvert(o) {
  if (o instanceof Cubehelix)
    return new Cubehelix(o.h, o.s, o.l, o.opacity);
  if (!(o instanceof Rgb))
    o = rgbConvert(o);
  var r = o.r / 255, g = o.g / 255, b = o.b / 255, l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB), bl = b - l, k = (E * (g - l) - C * bl) / D, s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), h = s ? Math.atan2(k, bl) * degrees - 120 : NaN;
  return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
}
function cubehelix(h, s, l, opacity) {
  return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
}
function Cubehelix(h, s, l, opacity) {
  this.h = +h;
  this.s = +s;
  this.l = +l;
  this.opacity = +opacity;
}
define_default(Cubehelix, cubehelix, extend(Color, {
  brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
  },
  rgb() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * radians, l = +this.l, a = isNaN(this.s) ? 0 : this.s * l * (1 - l), cosh2 = Math.cos(h), sinh2 = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh2 + B * sinh2)),
      255 * (l + a * (C * cosh2 + D * sinh2)),
      255 * (l + a * (E * cosh2)),
      this.opacity
    );
  }
}));

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basis.js
function basis(t12, v0, v1, v2, v3) {
  var t22 = t12 * t12, t32 = t22 * t12;
  return ((1 - 3 * t12 + 3 * t22 - t32) * v0 + (4 - 6 * t22 + 3 * t32) * v1 + (1 + 3 * t12 + 3 * t22 - 3 * t32) * v2 + t32 * v3) / 6;
}
function basis_default(values) {
  var n = values.length - 1;
  return function(t) {
    var i = t <= 0 ? t = 0 : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n), v1 = values[i], v2 = values[i + 1], v0 = i > 0 ? values[i - 1] : 2 * v1 - v2, v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/basisClosed.js
function basisClosed_default(values) {
  var n = values.length;
  return function(t) {
    var i = Math.floor(((t %= 1) < 0 ? ++t : t) * n), v0 = values[(i + n - 1) % n], v1 = values[i % n], v2 = values[(i + 1) % n], v3 = values[(i + 2) % n];
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/constant.js
var constant_default3 = (x) => () => x;

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/color.js
function linear(a, d) {
  return function(t) {
    return a + t * d;
  };
}
function exponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}
function hue(a, b) {
  var d = b - a;
  return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant_default3(isNaN(a) ? b : a);
}
function gamma(y) {
  return (y = +y) === 1 ? nogamma : function(a, b) {
    return b - a ? exponential(a, b, y) : constant_default3(isNaN(a) ? b : a);
  };
}
function nogamma(a, b) {
  var d = b - a;
  return d ? linear(a, d) : constant_default3(isNaN(a) ? b : a);
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/rgb.js
var rgb_default = function rgbGamma(y) {
  var color2 = gamma(y);
  function rgb2(start2, end) {
    var r = color2((start2 = rgb(start2)).r, (end = rgb(end)).r), g = color2(start2.g, end.g), b = color2(start2.b, end.b), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.r = r(t);
      start2.g = g(t);
      start2.b = b(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  }
  rgb2.gamma = rgbGamma;
  return rgb2;
}(1);
function rgbSpline(spline) {
  return function(colors) {
    var n = colors.length, r = new Array(n), g = new Array(n), b = new Array(n), i, color2;
    for (i = 0; i < n; ++i) {
      color2 = rgb(colors[i]);
      r[i] = color2.r || 0;
      g[i] = color2.g || 0;
      b[i] = color2.b || 0;
    }
    r = spline(r);
    g = spline(g);
    b = spline(b);
    color2.opacity = 1;
    return function(t) {
      color2.r = r(t);
      color2.g = g(t);
      color2.b = b(t);
      return color2 + "";
    };
  };
}
var rgbBasis = rgbSpline(basis_default);
var rgbBasisClosed = rgbSpline(basisClosed_default);

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/number.js
function number_default(a, b) {
  return a = +a, b = +b, function(t) {
    return a * (1 - t) + b * t;
  };
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/string.js
var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
var reB = new RegExp(reA.source, "g");
function zero(b) {
  return function() {
    return b;
  };
}
function one(b) {
  return function(t) {
    return b(t) + "";
  };
}
function string_default(a, b) {
  var bi = reA.lastIndex = reB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
  a = a + "", b = b + "";
  while ((am = reA.exec(a)) && (bm = reB.exec(b))) {
    if ((bs = bm.index) > bi) {
      bs = b.slice(bi, bs);
      if (s[i])
        s[i] += bs;
      else
        s[++i] = bs;
    }
    if ((am = am[0]) === (bm = bm[0])) {
      if (s[i])
        s[i] += bm;
      else
        s[++i] = bm;
    } else {
      s[++i] = null;
      q.push({ i, x: number_default(am, bm) });
    }
    bi = reB.lastIndex;
  }
  if (bi < b.length) {
    bs = b.slice(bi);
    if (s[i])
      s[i] += bs;
    else
      s[++i] = bs;
  }
  return s.length < 2 ? q[0] ? one(q[0].x) : zero(b) : (b = q.length, function(t) {
    for (var i2 = 0, o; i2 < b; ++i2)
      s[(o = q[i2]).i] = o.x(t);
    return s.join("");
  });
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/decompose.js
var degrees2 = 180 / Math.PI;
var identity = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function decompose_default(a, b, c, d, e, f) {
  var scaleX, scaleY, skewX;
  if (scaleX = Math.sqrt(a * a + b * b))
    a /= scaleX, b /= scaleX;
  if (skewX = a * c + b * d)
    c -= a * skewX, d -= b * skewX;
  if (scaleY = Math.sqrt(c * c + d * d))
    c /= scaleY, d /= scaleY, skewX /= scaleY;
  if (a * d < b * c)
    a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
  return {
    translateX: e,
    translateY: f,
    rotate: Math.atan2(b, a) * degrees2,
    skewX: Math.atan(skewX) * degrees2,
    scaleX,
    scaleY
  };
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/parse.js
var svgNode;
function parseCss(value) {
  const m = new (typeof DOMMatrix === "function" ? DOMMatrix : WebKitCSSMatrix)(value + "");
  return m.isIdentity ? identity : decompose_default(m.a, m.b, m.c, m.d, m.e, m.f);
}
function parseSvg(value) {
  if (value == null)
    return identity;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate()))
    return identity;
  value = value.matrix;
  return decompose_default(value.a, value.b, value.c, value.d, value.e, value.f);
}

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/transform/index.js
function interpolateTransform(parse, pxComma, pxParen, degParen) {
  function pop(s) {
    return s.length ? s.pop() + " " : "";
  }
  function translate(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push("translate(", null, pxComma, null, pxParen);
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb || yb) {
      s.push("translate(" + xb + pxComma + yb + pxParen);
    }
  }
  function rotate(a, b, s, q) {
    if (a !== b) {
      if (a - b > 180)
        b += 360;
      else if (b - a > 180)
        a += 360;
      q.push({ i: s.push(pop(s) + "rotate(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "rotate(" + b + degParen);
    }
  }
  function skewX(a, b, s, q) {
    if (a !== b) {
      q.push({ i: s.push(pop(s) + "skewX(", null, degParen) - 2, x: number_default(a, b) });
    } else if (b) {
      s.push(pop(s) + "skewX(" + b + degParen);
    }
  }
  function scale(xa, ya, xb, yb, s, q) {
    if (xa !== xb || ya !== yb) {
      var i = s.push(pop(s) + "scale(", null, ",", null, ")");
      q.push({ i: i - 4, x: number_default(xa, xb) }, { i: i - 2, x: number_default(ya, yb) });
    } else if (xb !== 1 || yb !== 1) {
      s.push(pop(s) + "scale(" + xb + "," + yb + ")");
    }
  }
  return function(a, b) {
    var s = [], q = [];
    a = parse(a), b = parse(b);
    translate(a.translateX, a.translateY, b.translateX, b.translateY, s, q);
    rotate(a.rotate, b.rotate, s, q);
    skewX(a.skewX, b.skewX, s, q);
    scale(a.scaleX, a.scaleY, b.scaleX, b.scaleY, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n)
        s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  };
}
var interpolateTransformCss = interpolateTransform(parseCss, "px, ", "px)", "deg)");
var interpolateTransformSvg = interpolateTransform(parseSvg, ", ", ")", ")");

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/zoom.js
var epsilon2 = 1e-12;
function cosh(x) {
  return ((x = Math.exp(x)) + 1 / x) / 2;
}
function sinh(x) {
  return ((x = Math.exp(x)) - 1 / x) / 2;
}
function tanh(x) {
  return ((x = Math.exp(2 * x)) - 1) / (x + 1);
}
var zoom_default = function zoomRho(rho, rho2, rho4) {
  function zoom(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < epsilon2) {
      S = Math.log(w1 / w0) / rho;
      i = function(t) {
        return [
          ux0 + t * dx,
          uy0 + t * dy,
          w0 * Math.exp(rho * t * S)
        ];
      };
    } else {
      var d1 = Math.sqrt(d2), b02 = (w1 * w1 - w0 * w0 + rho4 * d2) / (2 * w0 * rho2 * d1), b12 = (w1 * w1 - w0 * w0 - rho4 * d2) / (2 * w1 * rho2 * d1), r0 = Math.log(Math.sqrt(b02 * b02 + 1) - b02), r1 = Math.log(Math.sqrt(b12 * b12 + 1) - b12);
      S = (r1 - r0) / rho;
      i = function(t) {
        var s = t * S, coshr0 = cosh(r0), u = w0 / (rho2 * d1) * (coshr0 * tanh(rho * s + r0) - sinh(r0));
        return [
          ux0 + u * dx,
          uy0 + u * dy,
          w0 * coshr0 / cosh(rho * s + r0)
        ];
      };
    }
    i.duration = S * 1e3 * rho / Math.SQRT2;
    return i;
  }
  zoom.rho = function(_) {
    var _1 = Math.max(1e-3, +_), _2 = _1 * _1, _4 = _2 * _2;
    return zoomRho(_1, _2, _4);
  };
  return zoom;
}(Math.SQRT2, 2, 4);

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/hsl.js
function hsl2(hue2) {
  return function(start2, end) {
    var h = hue2((start2 = hsl(start2)).h, (end = hsl(end)).h), s = nogamma(start2.s, end.s), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.h = h(t);
      start2.s = s(t);
      start2.l = l(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  };
}
var hsl_default = hsl2(hue);
var hslLong = hsl2(nogamma);

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/hcl.js
function hcl2(hue2) {
  return function(start2, end) {
    var h = hue2((start2 = hcl(start2)).h, (end = hcl(end)).h), c = nogamma(start2.c, end.c), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
    return function(t) {
      start2.h = h(t);
      start2.c = c(t);
      start2.l = l(t);
      start2.opacity = opacity(t);
      return start2 + "";
    };
  };
}
var hcl_default = hcl2(hue);
var hclLong = hcl2(nogamma);

// node_modules/.deno/d3-interpolate@3.0.1/node_modules/d3-interpolate/src/cubehelix.js
function cubehelix2(hue2) {
  return function cubehelixGamma(y) {
    y = +y;
    function cubehelix3(start2, end) {
      var h = hue2((start2 = cubehelix(start2)).h, (end = cubehelix(end)).h), s = nogamma(start2.s, end.s), l = nogamma(start2.l, end.l), opacity = nogamma(start2.opacity, end.opacity);
      return function(t) {
        start2.h = h(t);
        start2.s = s(t);
        start2.l = l(Math.pow(t, y));
        start2.opacity = opacity(t);
        return start2 + "";
      };
    }
    cubehelix3.gamma = cubehelixGamma;
    return cubehelix3;
  }(1);
}
var cubehelix_default = cubehelix2(hue);
var cubehelixLong = cubehelix2(nogamma);

// node_modules/.deno/d3-timer@3.0.1/node_modules/d3-timer/src/timer.js
var frame = 0;
var timeout = 0;
var interval = 0;
var pokeDelay = 1e3;
var taskHead;
var taskTail;
var clockLast = 0;
var clockNow = 0;
var clockSkew = 0;
var clock = typeof performance === "object" && performance.now ? performance : Date;
var setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) {
  setTimeout(f, 17);
};
function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}
function clearNow() {
  clockNow = 0;
}
function Timer() {
  this._call = this._time = this._next = null;
}
Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function")
      throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail)
        taskTail._next = this;
      else
        taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};
function timer(callback, delay, time) {
  var t = new Timer();
  t.restart(callback, delay, time);
  return t;
}
function timerFlush() {
  now();
  ++frame;
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0)
      t._call.call(void 0, e);
    t = t._next;
  }
  --frame;
}
function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}
function poke() {
  var now2 = clock.now(), delay = now2 - clockLast;
  if (delay > pokeDelay)
    clockSkew -= delay, clockLast = now2;
}
function nap() {
  var t02, t12 = taskHead, t22, time = Infinity;
  while (t12) {
    if (t12._call) {
      if (time > t12._time)
        time = t12._time;
      t02 = t12, t12 = t12._next;
    } else {
      t22 = t12._next, t12._next = null;
      t12 = t02 ? t02._next = t22 : taskHead = t22;
    }
  }
  taskTail = t02;
  sleep(time);
}
function sleep(time) {
  if (frame)
    return;
  if (timeout)
    timeout = clearTimeout(timeout);
  var delay = time - clockNow;
  if (delay > 24) {
    if (time < Infinity)
      timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval)
      interval = clearInterval(interval);
  } else {
    if (!interval)
      clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}

// node_modules/.deno/d3-timer@3.0.1/node_modules/d3-timer/src/timeout.js
function timeout_default(callback, delay, time) {
  var t = new Timer();
  delay = delay == null ? 0 : +delay;
  t.restart((elapsed) => {
    t.stop();
    callback(elapsed + delay);
  }, delay, time);
  return t;
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/schedule.js
var emptyOn = dispatch_default("start", "end", "cancel", "interrupt");
var emptyTween = [];
var CREATED = 0;
var SCHEDULED = 1;
var STARTING = 2;
var STARTED = 3;
var RUNNING = 4;
var ENDING = 5;
var ENDED = 6;
function schedule_default(node, name, id2, index, group, timing) {
  var schedules = node.__transition;
  if (!schedules)
    node.__transition = {};
  else if (id2 in schedules)
    return;
  create(node, id2, {
    name,
    index,
    group,
    on: emptyOn,
    tween: emptyTween,
    time: timing.time,
    delay: timing.delay,
    duration: timing.duration,
    ease: timing.ease,
    timer: null,
    state: CREATED
  });
}
function init(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > CREATED)
    throw new Error("too late; already scheduled");
  return schedule;
}
function set2(node, id2) {
  var schedule = get2(node, id2);
  if (schedule.state > STARTED)
    throw new Error("too late; already running");
  return schedule;
}
function get2(node, id2) {
  var schedule = node.__transition;
  if (!schedule || !(schedule = schedule[id2]))
    throw new Error("transition not found");
  return schedule;
}
function create(node, id2, self) {
  var schedules = node.__transition, tween;
  schedules[id2] = self;
  self.timer = timer(schedule, 0, self.time);
  function schedule(elapsed) {
    self.state = SCHEDULED;
    self.timer.restart(start2, self.delay, self.time);
    if (self.delay <= elapsed)
      start2(elapsed - self.delay);
  }
  function start2(elapsed) {
    var i, j, n, o;
    if (self.state !== SCHEDULED)
      return stop();
    for (i in schedules) {
      o = schedules[i];
      if (o.name !== self.name)
        continue;
      if (o.state === STARTED)
        return timeout_default(start2);
      if (o.state === RUNNING) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("interrupt", node, node.__data__, o.index, o.group);
        delete schedules[i];
      } else if (+i < id2) {
        o.state = ENDED;
        o.timer.stop();
        o.on.call("cancel", node, node.__data__, o.index, o.group);
        delete schedules[i];
      }
    }
    timeout_default(function() {
      if (self.state === STARTED) {
        self.state = RUNNING;
        self.timer.restart(tick, self.delay, self.time);
        tick(elapsed);
      }
    });
    self.state = STARTING;
    self.on.call("start", node, node.__data__, self.index, self.group);
    if (self.state !== STARTING)
      return;
    self.state = STARTED;
    tween = new Array(n = self.tween.length);
    for (i = 0, j = -1; i < n; ++i) {
      if (o = self.tween[i].value.call(node, node.__data__, self.index, self.group)) {
        tween[++j] = o;
      }
    }
    tween.length = j + 1;
  }
  function tick(elapsed) {
    var t = elapsed < self.duration ? self.ease.call(null, elapsed / self.duration) : (self.timer.restart(stop), self.state = ENDING, 1), i = -1, n = tween.length;
    while (++i < n) {
      tween[i].call(node, t);
    }
    if (self.state === ENDING) {
      self.on.call("end", node, node.__data__, self.index, self.group);
      stop();
    }
  }
  function stop() {
    self.state = ENDED;
    self.timer.stop();
    delete schedules[id2];
    for (var i in schedules)
      return;
    delete node.__transition;
  }
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/interrupt.js
function interrupt_default(node, name) {
  var schedules = node.__transition, schedule, active, empty2 = true, i;
  if (!schedules)
    return;
  name = name == null ? null : name + "";
  for (i in schedules) {
    if ((schedule = schedules[i]).name !== name) {
      empty2 = false;
      continue;
    }
    active = schedule.state > STARTING && schedule.state < ENDING;
    schedule.state = ENDED;
    schedule.timer.stop();
    schedule.on.call(active ? "interrupt" : "cancel", node, node.__data__, schedule.index, schedule.group);
    delete schedules[i];
  }
  if (empty2)
    delete node.__transition;
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/selection/interrupt.js
function interrupt_default2(name) {
  return this.each(function() {
    interrupt_default(this, name);
  });
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/tween.js
function tweenRemove(id2, name) {
  var tween0, tween1;
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = tween0 = tween;
      for (var i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1 = tween1.slice();
          tween1.splice(i, 1);
          break;
        }
      }
    }
    schedule.tween = tween1;
  };
}
function tweenFunction(id2, name, value) {
  var tween0, tween1;
  if (typeof value !== "function")
    throw new Error();
  return function() {
    var schedule = set2(this, id2), tween = schedule.tween;
    if (tween !== tween0) {
      tween1 = (tween0 = tween).slice();
      for (var t = { name, value }, i = 0, n = tween1.length; i < n; ++i) {
        if (tween1[i].name === name) {
          tween1[i] = t;
          break;
        }
      }
      if (i === n)
        tween1.push(t);
    }
    schedule.tween = tween1;
  };
}
function tween_default(name, value) {
  var id2 = this._id;
  name += "";
  if (arguments.length < 2) {
    var tween = get2(this.node(), id2).tween;
    for (var i = 0, n = tween.length, t; i < n; ++i) {
      if ((t = tween[i]).name === name) {
        return t.value;
      }
    }
    return null;
  }
  return this.each((value == null ? tweenRemove : tweenFunction)(id2, name, value));
}
function tweenValue(transition2, name, value) {
  var id2 = transition2._id;
  transition2.each(function() {
    var schedule = set2(this, id2);
    (schedule.value || (schedule.value = {}))[name] = value.apply(this, arguments);
  });
  return function(node) {
    return get2(node, id2).value[name];
  };
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/interpolate.js
function interpolate_default(a, b) {
  var c;
  return (typeof b === "number" ? number_default : b instanceof color ? rgb_default : (c = color(b)) ? (b = c, rgb_default) : string_default)(a, b);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/attr.js
function attrRemove2(name) {
  return function() {
    this.removeAttribute(name);
  };
}
function attrRemoveNS2(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}
function attrConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttribute(name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrConstantNS2(fullname, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = this.getAttributeNS(fullname.space, fullname.local);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function attrFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttribute(name);
    string0 = this.getAttribute(name);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attrFunctionNS2(fullname, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0, value1 = value(this), string1;
    if (value1 == null)
      return void this.removeAttributeNS(fullname.space, fullname.local);
    string0 = this.getAttributeNS(fullname.space, fullname.local);
    string1 = value1 + "";
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function attr_default2(name, value) {
  var fullname = namespace_default(name), i = fullname === "transform" ? interpolateTransformSvg : interpolate_default;
  return this.attrTween(name, typeof value === "function" ? (fullname.local ? attrFunctionNS2 : attrFunction2)(fullname, i, tweenValue(this, "attr." + name, value)) : value == null ? (fullname.local ? attrRemoveNS2 : attrRemove2)(fullname) : (fullname.local ? attrConstantNS2 : attrConstant2)(fullname, i, value));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/attrTween.js
function attrInterpolate(name, i) {
  return function(t) {
    this.setAttribute(name, i.call(this, t));
  };
}
function attrInterpolateNS(fullname, i) {
  return function(t) {
    this.setAttributeNS(fullname.space, fullname.local, i.call(this, t));
  };
}
function attrTweenNS(fullname, value) {
  var t02, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && attrInterpolateNS(fullname, i);
    return t02;
  }
  tween._value = value;
  return tween;
}
function attrTween(name, value) {
  var t02, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && attrInterpolate(name, i);
    return t02;
  }
  tween._value = value;
  return tween;
}
function attrTween_default(name, value) {
  var key = "attr." + name;
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  var fullname = namespace_default(name);
  return this.tween(key, (fullname.local ? attrTweenNS : attrTween)(fullname, value));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/delay.js
function delayFunction(id2, value) {
  return function() {
    init(this, id2).delay = +value.apply(this, arguments);
  };
}
function delayConstant(id2, value) {
  return value = +value, function() {
    init(this, id2).delay = value;
  };
}
function delay_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? delayFunction : delayConstant)(id2, value)) : get2(this.node(), id2).delay;
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/duration.js
function durationFunction(id2, value) {
  return function() {
    set2(this, id2).duration = +value.apply(this, arguments);
  };
}
function durationConstant(id2, value) {
  return value = +value, function() {
    set2(this, id2).duration = value;
  };
}
function duration_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each((typeof value === "function" ? durationFunction : durationConstant)(id2, value)) : get2(this.node(), id2).duration;
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/ease.js
function easeConstant(id2, value) {
  if (typeof value !== "function")
    throw new Error();
  return function() {
    set2(this, id2).ease = value;
  };
}
function ease_default(value) {
  var id2 = this._id;
  return arguments.length ? this.each(easeConstant(id2, value)) : get2(this.node(), id2).ease;
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/easeVarying.js
function easeVarying(id2, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (typeof v !== "function")
      throw new Error();
    set2(this, id2).ease = v;
  };
}
function easeVarying_default(value) {
  if (typeof value !== "function")
    throw new Error();
  return this.each(easeVarying(this._id, value));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/filter.js
function filter_default2(match) {
  if (typeof match !== "function")
    match = matcher_default(match);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }
  return new Transition(subgroups, this._parents, this._name, this._id);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/merge.js
function merge_default2(transition2) {
  if (transition2._id !== this._id)
    throw new Error();
  for (var groups0 = this._groups, groups1 = transition2._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }
  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }
  return new Transition(merges, this._parents, this._name, this._id);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/on.js
function start(name) {
  return (name + "").trim().split(/^|\s+/).every(function(t) {
    var i = t.indexOf(".");
    if (i >= 0)
      t = t.slice(0, i);
    return !t || t === "start";
  });
}
function onFunction(id2, name, listener) {
  var on0, on1, sit = start(name) ? init : set2;
  return function() {
    var schedule = sit(this, id2), on = schedule.on;
    if (on !== on0)
      (on1 = (on0 = on).copy()).on(name, listener);
    schedule.on = on1;
  };
}
function on_default2(name, listener) {
  var id2 = this._id;
  return arguments.length < 2 ? get2(this.node(), id2).on.on(name) : this.each(onFunction(id2, name, listener));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/remove.js
function removeFunction(id2) {
  return function() {
    var parent = this.parentNode;
    for (var i in this.__transition)
      if (+i !== id2)
        return;
    if (parent)
      parent.removeChild(this);
  };
}
function remove_default2() {
  return this.on("end.remove", removeFunction(this._id));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/select.js
function select_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function")
    select = selector_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node)
          subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
        schedule_default(subgroup[i], name, id2, i, subgroup, get2(node, id2));
      }
    }
  }
  return new Transition(subgroups, this._parents, name, id2);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/selectAll.js
function selectAll_default3(select) {
  var name = this._name, id2 = this._id;
  if (typeof select !== "function")
    select = selectorAll_default(select);
  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        for (var children2 = select.call(node, node.__data__, i, group), child, inherit2 = get2(node, id2), k = 0, l = children2.length; k < l; ++k) {
          if (child = children2[k]) {
            schedule_default(child, name, id2, k, children2, inherit2);
          }
        }
        subgroups.push(children2);
        parents.push(node);
      }
    }
  }
  return new Transition(subgroups, parents, name, id2);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/selection.js
var Selection2 = selection_default.prototype.constructor;
function selection_default2() {
  return new Selection2(this._groups, this._parents);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/style.js
function styleNull(name, interpolate) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), string1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : interpolate0 = interpolate(string00 = string0, string10 = string1);
  };
}
function styleRemove2(name) {
  return function() {
    this.style.removeProperty(name);
  };
}
function styleConstant2(name, interpolate, value1) {
  var string00, string1 = value1 + "", interpolate0;
  return function() {
    var string0 = styleValue(this, name);
    return string0 === string1 ? null : string0 === string00 ? interpolate0 : interpolate0 = interpolate(string00 = string0, value1);
  };
}
function styleFunction2(name, interpolate, value) {
  var string00, string10, interpolate0;
  return function() {
    var string0 = styleValue(this, name), value1 = value(this), string1 = value1 + "";
    if (value1 == null)
      string1 = value1 = (this.style.removeProperty(name), styleValue(this, name));
    return string0 === string1 ? null : string0 === string00 && string1 === string10 ? interpolate0 : (string10 = string1, interpolate0 = interpolate(string00 = string0, value1));
  };
}
function styleMaybeRemove(id2, name) {
  var on0, on1, listener0, key = "style." + name, event = "end." + key, remove2;
  return function() {
    var schedule = set2(this, id2), on = schedule.on, listener = schedule.value[key] == null ? remove2 || (remove2 = styleRemove2(name)) : void 0;
    if (on !== on0 || listener0 !== listener)
      (on1 = (on0 = on).copy()).on(event, listener0 = listener);
    schedule.on = on1;
  };
}
function style_default2(name, value, priority) {
  var i = (name += "") === "transform" ? interpolateTransformCss : interpolate_default;
  return value == null ? this.styleTween(name, styleNull(name, i)).on("end.style." + name, styleRemove2(name)) : typeof value === "function" ? this.styleTween(name, styleFunction2(name, i, tweenValue(this, "style." + name, value))).each(styleMaybeRemove(this._id, name)) : this.styleTween(name, styleConstant2(name, i, value), priority).on("end.style." + name, null);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/styleTween.js
function styleInterpolate(name, i, priority) {
  return function(t) {
    this.style.setProperty(name, i.call(this, t), priority);
  };
}
function styleTween(name, value, priority) {
  var t, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t = (i0 = i) && styleInterpolate(name, i, priority);
    return t;
  }
  tween._value = value;
  return tween;
}
function styleTween_default(name, value, priority) {
  var key = "style." + (name += "");
  if (arguments.length < 2)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, styleTween(name, value, priority == null ? "" : priority));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/text.js
function textConstant2(value) {
  return function() {
    this.textContent = value;
  };
}
function textFunction2(value) {
  return function() {
    var value1 = value(this);
    this.textContent = value1 == null ? "" : value1;
  };
}
function text_default2(value) {
  return this.tween("text", typeof value === "function" ? textFunction2(tweenValue(this, "text", value)) : textConstant2(value == null ? "" : value + ""));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/textTween.js
function textInterpolate(i) {
  return function(t) {
    this.textContent = i.call(this, t);
  };
}
function textTween(value) {
  var t02, i0;
  function tween() {
    var i = value.apply(this, arguments);
    if (i !== i0)
      t02 = (i0 = i) && textInterpolate(i);
    return t02;
  }
  tween._value = value;
  return tween;
}
function textTween_default(value) {
  var key = "text";
  if (arguments.length < 1)
    return (key = this.tween(key)) && key._value;
  if (value == null)
    return this.tween(key, null);
  if (typeof value !== "function")
    throw new Error();
  return this.tween(key, textTween(value));
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/transition.js
function transition_default() {
  var name = this._name, id0 = this._id, id1 = newId();
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        var inherit2 = get2(node, id0);
        schedule_default(node, name, id1, i, group, {
          time: inherit2.time + inherit2.delay + inherit2.duration,
          delay: 0,
          duration: inherit2.duration,
          ease: inherit2.ease
        });
      }
    }
  }
  return new Transition(groups, this._parents, name, id1);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/end.js
function end_default() {
  var on0, on1, that = this, id2 = that._id, size = that.size();
  return new Promise(function(resolve, reject) {
    var cancel = { value: reject }, end = { value: function() {
      if (--size === 0)
        resolve();
    } };
    that.each(function() {
      var schedule = set2(this, id2), on = schedule.on;
      if (on !== on0) {
        on1 = (on0 = on).copy();
        on1._.cancel.push(cancel);
        on1._.interrupt.push(cancel);
        on1._.end.push(end);
      }
      schedule.on = on1;
    });
    if (size === 0)
      resolve();
  });
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/transition/index.js
var id = 0;
function Transition(groups, parents, name, id2) {
  this._groups = groups;
  this._parents = parents;
  this._name = name;
  this._id = id2;
}
function transition(name) {
  return selection_default().transition(name);
}
function newId() {
  return ++id;
}
var selection_prototype = selection_default.prototype;
Transition.prototype = transition.prototype = {
  constructor: Transition,
  select: select_default3,
  selectAll: selectAll_default3,
  selectChild: selection_prototype.selectChild,
  selectChildren: selection_prototype.selectChildren,
  filter: filter_default2,
  merge: merge_default2,
  selection: selection_default2,
  transition: transition_default,
  call: selection_prototype.call,
  nodes: selection_prototype.nodes,
  node: selection_prototype.node,
  size: selection_prototype.size,
  empty: selection_prototype.empty,
  each: selection_prototype.each,
  on: on_default2,
  attr: attr_default2,
  attrTween: attrTween_default,
  style: style_default2,
  styleTween: styleTween_default,
  text: text_default2,
  textTween: textTween_default,
  remove: remove_default2,
  tween: tween_default,
  delay: delay_default,
  duration: duration_default,
  ease: ease_default,
  easeVarying: easeVarying_default,
  end: end_default,
  [Symbol.iterator]: selection_prototype[Symbol.iterator]
};

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/cubic.js
function cubicInOut(t) {
  return ((t *= 2) <= 1 ? t * t * t : (t -= 2) * t * t + 2) / 2;
}

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/poly.js
var exponent = 3;
var polyIn = function custom(e) {
  e = +e;
  function polyIn2(t) {
    return Math.pow(t, e);
  }
  polyIn2.exponent = custom;
  return polyIn2;
}(exponent);
var polyOut = function custom2(e) {
  e = +e;
  function polyOut2(t) {
    return 1 - Math.pow(1 - t, e);
  }
  polyOut2.exponent = custom2;
  return polyOut2;
}(exponent);
var polyInOut = function custom3(e) {
  e = +e;
  function polyInOut2(t) {
    return ((t *= 2) <= 1 ? Math.pow(t, e) : 2 - Math.pow(2 - t, e)) / 2;
  }
  polyInOut2.exponent = custom3;
  return polyInOut2;
}(exponent);

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/sin.js
var pi = Math.PI;
var halfPi = pi / 2;

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/math.js
function tpmt(x) {
  return (Math.pow(2, -10 * x) - 9765625e-10) * 1.0009775171065494;
}

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/bounce.js
var b1 = 4 / 11;
var b2 = 6 / 11;
var b3 = 8 / 11;
var b4 = 3 / 4;
var b5 = 9 / 11;
var b6 = 10 / 11;
var b7 = 15 / 16;
var b8 = 21 / 22;
var b9 = 63 / 64;
var b0 = 1 / b1 / b1;

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/back.js
var overshoot = 1.70158;
var backIn = function custom4(s) {
  s = +s;
  function backIn2(t) {
    return (t = +t) * t * (s * (t - 1) + t);
  }
  backIn2.overshoot = custom4;
  return backIn2;
}(overshoot);
var backOut = function custom5(s) {
  s = +s;
  function backOut2(t) {
    return --t * t * ((t + 1) * s + t) + 1;
  }
  backOut2.overshoot = custom5;
  return backOut2;
}(overshoot);
var backInOut = function custom6(s) {
  s = +s;
  function backInOut2(t) {
    return ((t *= 2) < 1 ? t * t * ((s + 1) * t - s) : (t -= 2) * t * ((s + 1) * t + s) + 2) / 2;
  }
  backInOut2.overshoot = custom6;
  return backInOut2;
}(overshoot);

// node_modules/.deno/d3-ease@3.0.1/node_modules/d3-ease/src/elastic.js
var tau = 2 * Math.PI;
var amplitude = 1;
var period = 0.3;
var elasticIn = function custom7(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticIn2(t) {
    return a * tpmt(- --t) * Math.sin((s - t) / p);
  }
  elasticIn2.amplitude = function(a2) {
    return custom7(a2, p * tau);
  };
  elasticIn2.period = function(p2) {
    return custom7(a, p2);
  };
  return elasticIn2;
}(amplitude, period);
var elasticOut = function custom8(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticOut2(t) {
    return 1 - a * tpmt(t = +t) * Math.sin((t + s) / p);
  }
  elasticOut2.amplitude = function(a2) {
    return custom8(a2, p * tau);
  };
  elasticOut2.period = function(p2) {
    return custom8(a, p2);
  };
  return elasticOut2;
}(amplitude, period);
var elasticInOut = function custom9(a, p) {
  var s = Math.asin(1 / (a = Math.max(1, a))) * (p /= tau);
  function elasticInOut2(t) {
    return ((t = t * 2 - 1) < 0 ? a * tpmt(-t) * Math.sin((s - t) / p) : 2 - a * tpmt(t) * Math.sin((s + t) / p)) / 2;
  }
  elasticInOut2.amplitude = function(a2) {
    return custom9(a2, p * tau);
  };
  elasticInOut2.period = function(p2) {
    return custom9(a, p2);
  };
  return elasticInOut2;
}(amplitude, period);

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/selection/transition.js
var defaultTiming = {
  time: null,
  delay: 0,
  duration: 250,
  ease: cubicInOut
};
function inherit(node, id2) {
  var timing;
  while (!(timing = node.__transition) || !(timing = timing[id2])) {
    if (!(node = node.parentNode)) {
      throw new Error(`transition ${id2} not found`);
    }
  }
  return timing;
}
function transition_default2(name) {
  var id2, timing;
  if (name instanceof Transition) {
    id2 = name._id, name = name._name;
  } else {
    id2 = newId(), (timing = defaultTiming).time = now(), name = name == null ? null : name + "";
  }
  for (var groups = this._groups, m = groups.length, j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        schedule_default(node, name, id2, i, group, timing || inherit(node, id2));
      }
    }
  }
  return new Transition(groups, this._parents, name, id2);
}

// node_modules/.deno/d3-transition@3.0.1/node_modules/d3-transition/src/selection/index.js
selection_default.prototype.interrupt = interrupt_default2;
selection_default.prototype.transition = transition_default2;

// node_modules/.deno/d3-zoom@3.0.0/node_modules/d3-zoom/src/constant.js
var constant_default4 = (x) => () => x;

// node_modules/.deno/d3-zoom@3.0.0/node_modules/d3-zoom/src/event.js
function ZoomEvent(type, {
  sourceEvent,
  target,
  transform: transform2,
  dispatch: dispatch2
}) {
  Object.defineProperties(this, {
    type: { value: type, enumerable: true, configurable: true },
    sourceEvent: { value: sourceEvent, enumerable: true, configurable: true },
    target: { value: target, enumerable: true, configurable: true },
    transform: { value: transform2, enumerable: true, configurable: true },
    _: { value: dispatch2 }
  });
}

// node_modules/.deno/d3-zoom@3.0.0/node_modules/d3-zoom/src/transform.js
function Transform(k, x, y) {
  this.k = k;
  this.x = x;
  this.y = y;
}
Transform.prototype = {
  constructor: Transform,
  scale: function(k) {
    return k === 1 ? this : new Transform(this.k * k, this.x, this.y);
  },
  translate: function(x, y) {
    return x === 0 & y === 0 ? this : new Transform(this.k, this.x + this.k * x, this.y + this.k * y);
  },
  apply: function(point) {
    return [point[0] * this.k + this.x, point[1] * this.k + this.y];
  },
  applyX: function(x) {
    return x * this.k + this.x;
  },
  applyY: function(y) {
    return y * this.k + this.y;
  },
  invert: function(location) {
    return [(location[0] - this.x) / this.k, (location[1] - this.y) / this.k];
  },
  invertX: function(x) {
    return (x - this.x) / this.k;
  },
  invertY: function(y) {
    return (y - this.y) / this.k;
  },
  rescaleX: function(x) {
    return x.copy().domain(x.range().map(this.invertX, this).map(x.invert, x));
  },
  rescaleY: function(y) {
    return y.copy().domain(y.range().map(this.invertY, this).map(y.invert, y));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var identity2 = new Transform(1, 0, 0);
transform.prototype = Transform.prototype;
function transform(node) {
  while (!node.__zoom)
    if (!(node = node.parentNode))
      return identity2;
  return node.__zoom;
}

// node_modules/.deno/d3-zoom@3.0.0/node_modules/d3-zoom/src/noevent.js
function nopropagation2(event) {
  event.stopImmediatePropagation();
}
function noevent_default2(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
}

// node_modules/.deno/d3-zoom@3.0.0/node_modules/d3-zoom/src/zoom.js
function defaultFilter2(event) {
  return (!event.ctrlKey || event.type === "wheel") && !event.button;
}
function defaultExtent() {
  var e = this;
  if (e instanceof SVGElement) {
    e = e.ownerSVGElement || e;
    if (e.hasAttribute("viewBox")) {
      e = e.viewBox.baseVal;
      return [[e.x, e.y], [e.x + e.width, e.y + e.height]];
    }
    return [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]];
  }
  return [[0, 0], [e.clientWidth, e.clientHeight]];
}
function defaultTransform() {
  return this.__zoom || identity2;
}
function defaultWheelDelta(event) {
  return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * (event.ctrlKey ? 10 : 1);
}
function defaultTouchable2() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function defaultConstrain(transform2, extent, translateExtent) {
  var dx0 = transform2.invertX(extent[0][0]) - translateExtent[0][0], dx1 = transform2.invertX(extent[1][0]) - translateExtent[1][0], dy0 = transform2.invertY(extent[0][1]) - translateExtent[0][1], dy1 = transform2.invertY(extent[1][1]) - translateExtent[1][1];
  return transform2.translate(
    dx1 > dx0 ? (dx0 + dx1) / 2 : Math.min(0, dx0) || Math.max(0, dx1),
    dy1 > dy0 ? (dy0 + dy1) / 2 : Math.min(0, dy0) || Math.max(0, dy1)
  );
}
function zoom_default2() {
  var filter2 = defaultFilter2, extent = defaultExtent, constrain = defaultConstrain, wheelDelta = defaultWheelDelta, touchable = defaultTouchable2, scaleExtent = [0, Infinity], translateExtent = [[-Infinity, -Infinity], [Infinity, Infinity]], duration = 250, interpolate = zoom_default, listeners = dispatch_default("start", "zoom", "end"), touchstarting, touchfirst, touchending, touchDelay = 500, wheelDelay = 150, clickDistance2 = 0, tapDistance = 10;
  function zoom(selection2) {
    selection2.property("__zoom", defaultTransform).on("wheel.zoom", wheeled, { passive: false }).on("mousedown.zoom", mousedowned).on("dblclick.zoom", dblclicked).filter(touchable).on("touchstart.zoom", touchstarted).on("touchmove.zoom", touchmoved).on("touchend.zoom touchcancel.zoom", touchended).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  zoom.transform = function(collection, transform2, point, event) {
    var selection2 = collection.selection ? collection.selection() : collection;
    selection2.property("__zoom", defaultTransform);
    if (collection !== selection2) {
      schedule(collection, transform2, point, event);
    } else {
      selection2.interrupt().each(function() {
        gesture(this, arguments).event(event).start().zoom(null, typeof transform2 === "function" ? transform2.apply(this, arguments) : transform2).end();
      });
    }
  };
  zoom.scaleBy = function(selection2, k, p, event) {
    zoom.scaleTo(selection2, function() {
      var k0 = this.__zoom.k, k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return k0 * k1;
    }, p, event);
  };
  zoom.scaleTo = function(selection2, k, p, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t02 = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p, p1 = t02.invert(p0), k1 = typeof k === "function" ? k.apply(this, arguments) : k;
      return constrain(translate(scale(t02, k1), p0, p1), e, translateExtent);
    }, p, event);
  };
  zoom.translateBy = function(selection2, x, y, event) {
    zoom.transform(selection2, function() {
      return constrain(this.__zoom.translate(
        typeof x === "function" ? x.apply(this, arguments) : x,
        typeof y === "function" ? y.apply(this, arguments) : y
      ), extent.apply(this, arguments), translateExtent);
    }, null, event);
  };
  zoom.translateTo = function(selection2, x, y, p, event) {
    zoom.transform(selection2, function() {
      var e = extent.apply(this, arguments), t = this.__zoom, p0 = p == null ? centroid(e) : typeof p === "function" ? p.apply(this, arguments) : p;
      return constrain(identity2.translate(p0[0], p0[1]).scale(t.k).translate(
        typeof x === "function" ? -x.apply(this, arguments) : -x,
        typeof y === "function" ? -y.apply(this, arguments) : -y
      ), e, translateExtent);
    }, p, event);
  };
  function scale(transform2, k) {
    k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], k));
    return k === transform2.k ? transform2 : new Transform(k, transform2.x, transform2.y);
  }
  function translate(transform2, p0, p1) {
    var x = p0[0] - p1[0] * transform2.k, y = p0[1] - p1[1] * transform2.k;
    return x === transform2.x && y === transform2.y ? transform2 : new Transform(transform2.k, x, y);
  }
  function centroid(extent2) {
    return [(+extent2[0][0] + +extent2[1][0]) / 2, (+extent2[0][1] + +extent2[1][1]) / 2];
  }
  function schedule(transition2, transform2, point, event) {
    transition2.on("start.zoom", function() {
      gesture(this, arguments).event(event).start();
    }).on("interrupt.zoom end.zoom", function() {
      gesture(this, arguments).event(event).end();
    }).tween("zoom", function() {
      var that = this, args = arguments, g = gesture(that, args).event(event), e = extent.apply(that, args), p = point == null ? centroid(e) : typeof point === "function" ? point.apply(that, args) : point, w = Math.max(e[1][0] - e[0][0], e[1][1] - e[0][1]), a = that.__zoom, b = typeof transform2 === "function" ? transform2.apply(that, args) : transform2, i = interpolate(a.invert(p).concat(w / a.k), b.invert(p).concat(w / b.k));
      return function(t) {
        if (t === 1)
          t = b;
        else {
          var l = i(t), k = w / l[2];
          t = new Transform(k, p[0] - l[0] * k, p[1] - l[1] * k);
        }
        g.zoom(null, t);
      };
    });
  }
  function gesture(that, args, clean) {
    return !clean && that.__zooming || new Gesture(that, args);
  }
  function Gesture(that, args) {
    this.that = that;
    this.args = args;
    this.active = 0;
    this.sourceEvent = null;
    this.extent = extent.apply(that, args);
    this.taps = 0;
  }
  Gesture.prototype = {
    event: function(event) {
      if (event)
        this.sourceEvent = event;
      return this;
    },
    start: function() {
      if (++this.active === 1) {
        this.that.__zooming = this;
        this.emit("start");
      }
      return this;
    },
    zoom: function(key, transform2) {
      if (this.mouse && key !== "mouse")
        this.mouse[1] = transform2.invert(this.mouse[0]);
      if (this.touch0 && key !== "touch")
        this.touch0[1] = transform2.invert(this.touch0[0]);
      if (this.touch1 && key !== "touch")
        this.touch1[1] = transform2.invert(this.touch1[0]);
      this.that.__zoom = transform2;
      this.emit("zoom");
      return this;
    },
    end: function() {
      if (--this.active === 0) {
        delete this.that.__zooming;
        this.emit("end");
      }
      return this;
    },
    emit: function(type) {
      var d = select_default2(this.that).datum();
      listeners.call(
        type,
        this.that,
        new ZoomEvent(type, {
          sourceEvent: this.sourceEvent,
          target: zoom,
          type,
          transform: this.that.__zoom,
          dispatch: listeners
        }),
        d
      );
    }
  };
  function wheeled(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var g = gesture(this, args).event(event), t = this.__zoom, k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], t.k * Math.pow(2, wheelDelta.apply(this, arguments)))), p = pointer_default(event);
    if (g.wheel) {
      if (g.mouse[0][0] !== p[0] || g.mouse[0][1] !== p[1]) {
        g.mouse[1] = t.invert(g.mouse[0] = p);
      }
      clearTimeout(g.wheel);
    } else if (t.k === k)
      return;
    else {
      g.mouse = [p, t.invert(p)];
      interrupt_default(this);
      g.start();
    }
    noevent_default2(event);
    g.wheel = setTimeout(wheelidled, wheelDelay);
    g.zoom("mouse", constrain(translate(scale(t, k), g.mouse[0], g.mouse[1]), g.extent, translateExtent));
    function wheelidled() {
      g.wheel = null;
      g.end();
    }
  }
  function mousedowned(event, ...args) {
    if (touchending || !filter2.apply(this, arguments))
      return;
    var currentTarget = event.currentTarget, g = gesture(this, args, true).event(event), v = select_default2(event.view).on("mousemove.zoom", mousemoved, true).on("mouseup.zoom", mouseupped, true), p = pointer_default(event, currentTarget), x0 = event.clientX, y0 = event.clientY;
    nodrag_default(event.view);
    nopropagation2(event);
    g.mouse = [p, this.__zoom.invert(p)];
    interrupt_default(this);
    g.start();
    function mousemoved(event2) {
      noevent_default2(event2);
      if (!g.moved) {
        var dx = event2.clientX - x0, dy = event2.clientY - y0;
        g.moved = dx * dx + dy * dy > clickDistance2;
      }
      g.event(event2).zoom("mouse", constrain(translate(g.that.__zoom, g.mouse[0] = pointer_default(event2, currentTarget), g.mouse[1]), g.extent, translateExtent));
    }
    function mouseupped(event2) {
      v.on("mousemove.zoom mouseup.zoom", null);
      yesdrag(event2.view, g.moved);
      noevent_default2(event2);
      g.event(event2).end();
    }
  }
  function dblclicked(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var t02 = this.__zoom, p0 = pointer_default(event.changedTouches ? event.changedTouches[0] : event, this), p1 = t02.invert(p0), k1 = t02.k * (event.shiftKey ? 0.5 : 2), t12 = constrain(translate(scale(t02, k1), p0, p1), extent.apply(this, args), translateExtent);
    noevent_default2(event);
    if (duration > 0)
      select_default2(this).transition().duration(duration).call(schedule, t12, p0, event);
    else
      select_default2(this).call(zoom.transform, t12, p0, event);
  }
  function touchstarted(event, ...args) {
    if (!filter2.apply(this, arguments))
      return;
    var touches = event.touches, n = touches.length, g = gesture(this, args, event.changedTouches.length === n).event(event), started, i, t, p;
    nopropagation2(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      p = [p, this.__zoom.invert(p), t.identifier];
      if (!g.touch0)
        g.touch0 = p, started = true, g.taps = 1 + !!touchstarting;
      else if (!g.touch1 && g.touch0[2] !== p[2])
        g.touch1 = p, g.taps = 0;
    }
    if (touchstarting)
      touchstarting = clearTimeout(touchstarting);
    if (started) {
      if (g.taps < 2)
        touchfirst = p[0], touchstarting = setTimeout(function() {
          touchstarting = null;
        }, touchDelay);
      interrupt_default(this);
      g.start();
    }
  }
  function touchmoved(event, ...args) {
    if (!this.__zooming)
      return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t, p, l;
    noevent_default2(event);
    for (i = 0; i < n; ++i) {
      t = touches[i], p = pointer_default(t, this);
      if (g.touch0 && g.touch0[2] === t.identifier)
        g.touch0[0] = p;
      else if (g.touch1 && g.touch1[2] === t.identifier)
        g.touch1[0] = p;
    }
    t = g.that.__zoom;
    if (g.touch1) {
      var p0 = g.touch0[0], l0 = g.touch0[1], p1 = g.touch1[0], l1 = g.touch1[1], dp = (dp = p1[0] - p0[0]) * dp + (dp = p1[1] - p0[1]) * dp, dl = (dl = l1[0] - l0[0]) * dl + (dl = l1[1] - l0[1]) * dl;
      t = scale(t, Math.sqrt(dp / dl));
      p = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      l = [(l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2];
    } else if (g.touch0)
      p = g.touch0[0], l = g.touch0[1];
    else
      return;
    g.zoom("touch", constrain(translate(t, p, l), g.extent, translateExtent));
  }
  function touchended(event, ...args) {
    if (!this.__zooming)
      return;
    var g = gesture(this, args).event(event), touches = event.changedTouches, n = touches.length, i, t;
    nopropagation2(event);
    if (touchending)
      clearTimeout(touchending);
    touchending = setTimeout(function() {
      touchending = null;
    }, touchDelay);
    for (i = 0; i < n; ++i) {
      t = touches[i];
      if (g.touch0 && g.touch0[2] === t.identifier)
        delete g.touch0;
      else if (g.touch1 && g.touch1[2] === t.identifier)
        delete g.touch1;
    }
    if (g.touch1 && !g.touch0)
      g.touch0 = g.touch1, delete g.touch1;
    if (g.touch0)
      g.touch0[1] = this.__zoom.invert(g.touch0[0]);
    else {
      g.end();
      if (g.taps === 2) {
        t = pointer_default(t, this);
        if (Math.hypot(touchfirst[0] - t[0], touchfirst[1] - t[1]) < tapDistance) {
          var p = select_default2(this).on("dblclick.zoom");
          if (p)
            p.apply(this, arguments);
        }
      }
    }
  }
  zoom.wheelDelta = function(_) {
    return arguments.length ? (wheelDelta = typeof _ === "function" ? _ : constant_default4(+_), zoom) : wheelDelta;
  };
  zoom.filter = function(_) {
    return arguments.length ? (filter2 = typeof _ === "function" ? _ : constant_default4(!!_), zoom) : filter2;
  };
  zoom.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant_default4(!!_), zoom) : touchable;
  };
  zoom.extent = function(_) {
    return arguments.length ? (extent = typeof _ === "function" ? _ : constant_default4([[+_[0][0], +_[0][1]], [+_[1][0], +_[1][1]]]), zoom) : extent;
  };
  zoom.scaleExtent = function(_) {
    return arguments.length ? (scaleExtent[0] = +_[0], scaleExtent[1] = +_[1], zoom) : [scaleExtent[0], scaleExtent[1]];
  };
  zoom.translateExtent = function(_) {
    return arguments.length ? (translateExtent[0][0] = +_[0][0], translateExtent[1][0] = +_[1][0], translateExtent[0][1] = +_[0][1], translateExtent[1][1] = +_[1][1], zoom) : [[translateExtent[0][0], translateExtent[0][1]], [translateExtent[1][0], translateExtent[1][1]]];
  };
  zoom.constrain = function(_) {
    return arguments.length ? (constrain = _, zoom) : constrain;
  };
  zoom.duration = function(_) {
    return arguments.length ? (duration = +_, zoom) : duration;
  };
  zoom.interpolate = function(_) {
    return arguments.length ? (interpolate = _, zoom) : interpolate;
  };
  zoom.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? zoom : value;
  };
  zoom.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, zoom) : Math.sqrt(clickDistance2);
  };
  zoom.tapDistance = function(_) {
    return arguments.length ? (tapDistance = +_, zoom) : tapDistance;
  };
  return zoom;
}

// node_modules/.deno/@reactflow+core@11.3.0/node_modules/@reactflow/core/dist/esm/index.js
var import_react_dom = __toESM(require_react_dom());
var StoreContext = (0, import_react2.createContext)(null);
var Provider$1 = StoreContext.Provider;
var errorMessage = "[React Flow]: Seems like you have not used zustand provider as an ancestor. Help: https://reactflow.dev/error#100";
function useStore2(selector5, equalityFn) {
  const store = (0, import_react2.useContext)(StoreContext);
  if (store === null) {
    throw new Error(errorMessage);
  }
  return useStore(store, selector5, equalityFn);
}
var useStoreApi = () => {
  const store = (0, import_react2.useContext)(StoreContext);
  if (store === null) {
    throw new Error(errorMessage);
  }
  return (0, import_react2.useMemo)(() => ({
    getState: store.getState,
    setState: store.setState,
    subscribe: store.subscribe,
    destroy: store.destroy
  }), [store]);
};
var selector$f = (s) => s.userSelectionActive ? "none" : "all";
function Panel({ position, children: children2, className, style: style2, ...rest }) {
  const pointerEvents = useStore2(selector$f);
  const positionClasses = `${position}`.split("-");
  return (0, import_jsx_runtime.jsx)("div", { className: cc(["react-flow__panel", className, ...positionClasses]), style: { ...style2, pointerEvents }, ...rest, children: children2 });
}
function Attribution({ proOptions, position = "bottom-right" }) {
  if (proOptions == null ? void 0 : proOptions.hideAttribution) {
    return null;
  }
  return (0, import_jsx_runtime.jsx)(Panel, { position, className: "react-flow__attribution", "data-message": "Please only hide this attribution when you are subscribed to React Flow Pro: https://pro.reactflow.dev", children: (0, import_jsx_runtime.jsx)("a", { href: "https://reactflow.dev", target: "_blank", rel: "noopener noreferrer", "aria-label": "React Flow attribution", children: "React Flow" }) });
}
var EdgeText = ({ x, y, label, labelStyle = {}, labelShowBg = true, labelBgStyle = {}, labelBgPadding = [2, 4], labelBgBorderRadius = 2, children: children2, className, ...rest }) => {
  const edgeRef = (0, import_react2.useRef)(null);
  const [edgeTextBbox, setEdgeTextBbox] = (0, import_react2.useState)({ x: 0, y: 0, width: 0, height: 0 });
  const edgeTextClasses = cc(["react-flow__edge-textwrapper", className]);
  (0, import_react2.useEffect)(() => {
    if (edgeRef.current) {
      const textBbox = edgeRef.current.getBBox();
      setEdgeTextBbox({
        x: textBbox.x,
        y: textBbox.y,
        width: textBbox.width,
        height: textBbox.height
      });
    }
  }, [label]);
  if (typeof label === "undefined" || !label) {
    return null;
  }
  return (0, import_jsx_runtime.jsxs)("g", { transform: `translate(${x - edgeTextBbox.width / 2} ${y - edgeTextBbox.height / 2})`, className: edgeTextClasses, visibility: edgeTextBbox.width ? "visible" : "hidden", ...rest, children: [labelShowBg && (0, import_jsx_runtime.jsx)("rect", { width: edgeTextBbox.width + 2 * labelBgPadding[0], x: -labelBgPadding[0], y: -labelBgPadding[1], height: edgeTextBbox.height + 2 * labelBgPadding[1], className: "react-flow__edge-textbg", style: labelBgStyle, rx: labelBgBorderRadius, ry: labelBgBorderRadius }), (0, import_jsx_runtime.jsx)("text", { className: "react-flow__edge-text", y: edgeTextBbox.height / 2, dy: "0.3em", ref: edgeRef, style: labelStyle, children: label }), children2] });
};
var EdgeText$1 = (0, import_react2.memo)(EdgeText);
var BaseEdge = ({ path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth = 20 }) => {
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("path", { style: style2, d: path, fill: "none", className: "react-flow__edge-path", markerEnd, markerStart }), interactionWidth && (0, import_jsx_runtime.jsx)("path", { d: path, fill: "none", strokeOpacity: 0, strokeWidth: interactionWidth, className: "react-flow__edge-interaction" }), label ? (0, import_jsx_runtime.jsx)(EdgeText$1, { x: labelX, y: labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius }) : null] });
};
BaseEdge.displayName = "BaseEdge";
var getMarkerEnd = (markerType, markerEndId) => {
  if (typeof markerEndId !== "undefined" && markerEndId) {
    return `url(#${markerEndId})`;
  }
  return typeof markerType !== "undefined" ? `url(#react-flow__${markerType})` : "none";
};
function getMouseHandler$1(id2, getState, handler) {
  return handler === void 0 ? handler : (event) => {
    const edge = getState().edges.find((e) => e.id === id2);
    if (edge) {
      handler(event, { ...edge });
    }
  };
}
function getEdgeCenter({ sourceX, sourceY, targetX, targetY }) {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;
  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;
  return [centerX, centerY, xOffset, yOffset];
}
function getBezierEdgeCenter({ sourceX, sourceY, targetX, targetY, sourceControlX, sourceControlY, targetControlX, targetControlY }) {
  const centerX = sourceX * 0.125 + sourceControlX * 0.375 + targetControlX * 0.375 + targetX * 0.125;
  const centerY = sourceY * 0.125 + sourceControlY * 0.375 + targetControlY * 0.375 + targetY * 0.125;
  const offsetX = Math.abs(centerX - sourceX);
  const offsetY = Math.abs(centerY - sourceY);
  return [centerX, centerY, offsetX, offsetY];
}
var ConnectionMode;
(function(ConnectionMode2) {
  ConnectionMode2["Strict"] = "strict";
  ConnectionMode2["Loose"] = "loose";
})(ConnectionMode || (ConnectionMode = {}));
var PanOnScrollMode;
(function(PanOnScrollMode2) {
  PanOnScrollMode2["Free"] = "free";
  PanOnScrollMode2["Vertical"] = "vertical";
  PanOnScrollMode2["Horizontal"] = "horizontal";
})(PanOnScrollMode || (PanOnScrollMode = {}));
var getDimensions = (node) => ({
  width: node.offsetWidth,
  height: node.offsetHeight
});
var clamp = (val, min = 0, max = 1) => Math.min(Math.max(val, min), max);
var clampPosition = (position = { x: 0, y: 0 }, extent) => ({
  x: clamp(position.x, extent[0][0], extent[1][0]),
  y: clamp(position.y, extent[0][1], extent[1][1])
});
var getHostForElement = (element) => {
  var _a;
  return ((_a = element.getRootNode) == null ? void 0 : _a.call(element)) || (window == null ? void 0 : window.document);
};
var getBoundsOfBoxes = (box1, box2) => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2)
});
var rectToBox = ({ x, y, width, height }) => ({
  x,
  y,
  x2: x + width,
  y2: y + height
});
var boxToRect = ({ x, y, x2, y2 }) => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y
});
var nodeToRect = (node) => ({
  ...node.positionAbsolute || { x: 0, y: 0 },
  width: node.width || 0,
  height: node.height || 0
});
var getBoundsOfRects = (rect1, rect2) => boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));
var getOverlappingArea = (rectA, rectB) => {
  const xOverlap = Math.max(0, Math.min(rectA.x + rectA.width, rectB.x + rectB.width) - Math.max(rectA.x, rectB.x));
  const yOverlap = Math.max(0, Math.min(rectA.y + rectA.height, rectB.y + rectB.height) - Math.max(rectA.y, rectB.y));
  return Math.ceil(xOverlap * yOverlap);
};
var isRectObject = (obj) => !!obj.width && !!obj.height && !!obj.x && !!obj.y;
var isNumeric = (n) => !isNaN(n) && isFinite(n);
var internalsSymbol = Symbol.for("internals");
var elementSelectionKeys = ["Enter", " ", "Escape"];
var devWarn = (message) => {
  if (true) {
    console.warn(`[React Flow]: ${message}`);
  }
};
var ConnectionLineType;
(function(ConnectionLineType2) {
  ConnectionLineType2["Bezier"] = "default";
  ConnectionLineType2["Straight"] = "straight";
  ConnectionLineType2["Step"] = "step";
  ConnectionLineType2["SmoothStep"] = "smoothstep";
  ConnectionLineType2["SimpleBezier"] = "simplebezier";
})(ConnectionLineType || (ConnectionLineType = {}));
var MarkerType;
(function(MarkerType2) {
  MarkerType2["Arrow"] = "arrow";
  MarkerType2["ArrowClosed"] = "arrowclosed";
})(MarkerType || (MarkerType = {}));
var Position;
(function(Position2) {
  Position2["Left"] = "left";
  Position2["Top"] = "top";
  Position2["Right"] = "right";
  Position2["Bottom"] = "bottom";
})(Position || (Position = {}));
function getControl({ pos, x1, y1, x2, y2 }) {
  if (pos === Position.Left || pos === Position.Right) {
    return [0.5 * (x1 + x2), y1];
  }
  return [x1, 0.5 * (y1 + y2)];
}
function getSimpleBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top }) {
  const [sourceControlX, sourceControlY] = getControl({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY
  });
  const [targetControlX, targetControlY] = getControl({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
var SimpleBezierEdge = (0, import_react2.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
  const [path, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });
  return (0, import_jsx_runtime.jsx)(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
SimpleBezierEdge.displayName = "SimpleBezierEdge";
var handleDirections = {
  [Position.Left]: { x: -1, y: 0 },
  [Position.Right]: { x: 1, y: 0 },
  [Position.Top]: { x: 0, y: -1 },
  [Position.Bottom]: { x: 0, y: 1 }
};
var getDirection = ({ source, sourcePosition = Position.Bottom, target }) => {
  if (sourcePosition === Position.Left || sourcePosition === Position.Right) {
    return source.x < target.x ? { x: 1, y: 0 } : { x: -1, y: 0 };
  }
  return source.y < target.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
};
var distance = (a, b) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
function getPoints({ source, sourcePosition = Position.Bottom, target, targetPosition = Position.Top, center, offset }) {
  const sourceDir = handleDirections[sourcePosition];
  const targetDir = handleDirections[targetPosition];
  const sourceGapped = { x: source.x + sourceDir.x * offset, y: source.y + sourceDir.y * offset };
  const targetGapped = { x: target.x + targetDir.x * offset, y: target.y + targetDir.y * offset };
  const dir = getDirection({
    source: sourceGapped,
    sourcePosition,
    target: targetGapped
  });
  const dirAccessor = dir.x !== 0 ? "x" : "y";
  const currDir = dir[dirAccessor];
  let points = [];
  let centerX, centerY;
  const [defaultCenterX, defaultCenterY, defaultOffsetX, defaultOffsetY] = getEdgeCenter({
    sourceX: source.x,
    sourceY: source.y,
    targetX: target.x,
    targetY: target.y
  });
  if (sourceDir[dirAccessor] * targetDir[dirAccessor] === -1) {
    centerX = center.x || defaultCenterX;
    centerY = center.y || defaultCenterY;
    const verticalSplit = [
      { x: centerX, y: sourceGapped.y },
      { x: centerX, y: targetGapped.y }
    ];
    const horizontalSplit = [
      { x: sourceGapped.x, y: centerY },
      { x: targetGapped.x, y: centerY }
    ];
    if (sourceDir[dirAccessor] === currDir) {
      points = dirAccessor === "x" ? verticalSplit : horizontalSplit;
    } else {
      points = dirAccessor === "x" ? horizontalSplit : verticalSplit;
    }
  } else {
    const sourceTarget = [{ x: sourceGapped.x, y: targetGapped.y }];
    const targetSource = [{ x: targetGapped.x, y: sourceGapped.y }];
    if (dirAccessor === "x") {
      points = sourceDir.x === currDir ? targetSource : sourceTarget;
    } else {
      points = sourceDir.y === currDir ? sourceTarget : targetSource;
    }
    if (sourcePosition !== targetPosition) {
      const dirAccessorOpposite = dirAccessor === "x" ? "y" : "x";
      const isSameDir = sourceDir[dirAccessor] === targetDir[dirAccessorOpposite];
      const sourceGtTargetOppo = sourceGapped[dirAccessorOpposite] > targetGapped[dirAccessorOpposite];
      const sourceLtTargetOppo = sourceGapped[dirAccessorOpposite] < targetGapped[dirAccessorOpposite];
      const flipSourceTarget = sourceDir[dirAccessor] === 1 && (!isSameDir && sourceGtTargetOppo || isSameDir && sourceLtTargetOppo) || sourceDir[dirAccessor] !== 1 && (!isSameDir && sourceLtTargetOppo || isSameDir && sourceGtTargetOppo);
      if (flipSourceTarget) {
        points = dirAccessor === "x" ? sourceTarget : targetSource;
      }
    }
    centerX = points[0].x;
    centerY = points[0].y;
  }
  const pathPoints = [source, sourceGapped, ...points, targetGapped, target];
  return [pathPoints, centerX, centerY, defaultOffsetX, defaultOffsetY];
}
function getBend(a, b, c, size) {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;
  if (a.x === x && x === c.x || a.y === y && y === c.y) {
    return `L${x} ${y}`;
  }
  if (a.y === y) {
    const xDir2 = a.x < c.x ? -1 : 1;
    const yDir2 = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir2},${y}Q ${x},${y} ${x},${y + bendSize * yDir2}`;
  }
  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
}
function getSmoothStepPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, borderRadius = 5, centerX, centerY, offset = 20 }) {
  const [points, labelX, labelY, offsetX, offsetY] = getPoints({
    source: { x: sourceX, y: sourceY },
    sourcePosition,
    target: { x: targetX, y: targetY },
    targetPosition,
    center: { x: centerX, y: centerY },
    offset
  });
  const path = points.reduce((res, p, i) => {
    let segment = "";
    if (i > 0 && i < points.length - 1) {
      segment = getBend(points[i - 1], p, points[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? "M" : "L"}${p.x} ${p.y}`;
    }
    res += segment;
    return res;
  }, "");
  return [path, labelX, labelY, offsetX, offsetY];
}
var SmoothStepEdge = (0, import_react2.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, sourcePosition = Position.Bottom, targetPosition = Position.Top, markerEnd, markerStart, pathOptions, interactionWidth }) => {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: pathOptions == null ? void 0 : pathOptions.borderRadius,
    offset: pathOptions == null ? void 0 : pathOptions.offset
  });
  return (0, import_jsx_runtime.jsx)(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
SmoothStepEdge.displayName = "SmoothStepEdge";
var StepEdge = (0, import_react2.memo)((props) => {
  var _a;
  return (0, import_jsx_runtime.jsx)(SmoothStepEdge, { ...props, pathOptions: (0, import_react2.useMemo)(() => {
    var _a2;
    return { borderRadius: 0, offset: (_a2 = props.pathOptions) == null ? void 0 : _a2.offset };
  }, [(_a = props.pathOptions) == null ? void 0 : _a.offset]) });
});
StepEdge.displayName = "StepEdge";
function getStraightPath({ sourceX, sourceY, targetX, targetY }) {
  const [labelX, labelY, offsetX, offsetY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY
  });
  return [`M ${sourceX},${sourceY}L ${targetX},${targetY}`, labelX, labelY, offsetX, offsetY];
}
var StraightEdge = (0, import_react2.memo)(({ sourceX, sourceY, targetX, targetY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth }) => {
  const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (0, import_jsx_runtime.jsx)(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
StraightEdge.displayName = "StraightEdge";
function calculateControlOffset(distance2, curvature) {
  if (distance2 >= 0) {
    return 0.5 * distance2;
  }
  return curvature * 25 * Math.sqrt(-distance2);
}
function getControlWithCurvature({ pos, x1, y1, x2, y2, c }) {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, c), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, c), y1];
    case Position.Top:
      return [x1, y1 - calculateControlOffset(y1 - y2, c)];
    case Position.Bottom:
      return [x1, y1 + calculateControlOffset(y2 - y1, c)];
  }
}
function getBezierPath({ sourceX, sourceY, sourcePosition = Position.Bottom, targetX, targetY, targetPosition = Position.Top, curvature = 0.25 }) {
  const [sourceControlX, sourceControlY] = getControlWithCurvature({
    pos: sourcePosition,
    x1: sourceX,
    y1: sourceY,
    x2: targetX,
    y2: targetY,
    c: curvature
  });
  const [targetControlX, targetControlY] = getControlWithCurvature({
    pos: targetPosition,
    x1: targetX,
    y1: targetY,
    x2: sourceX,
    y2: sourceY,
    c: curvature
  });
  const [labelX, labelY, offsetX, offsetY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourceControlX,
    sourceControlY,
    targetControlX,
    targetControlY
  });
  return [
    `M${sourceX},${sourceY} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetX},${targetY}`,
    labelX,
    labelY,
    offsetX,
    offsetY
  ];
}
var BezierEdge = (0, import_react2.memo)(({ sourceX, sourceY, targetX, targetY, sourcePosition = Position.Bottom, targetPosition = Position.Top, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, pathOptions, interactionWidth }) => {
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: pathOptions == null ? void 0 : pathOptions.curvature
  });
  return (0, import_jsx_runtime.jsx)(BaseEdge, { path, labelX, labelY, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, markerEnd, markerStart, interactionWidth });
});
BezierEdge.displayName = "BezierEdge";
var NodeIdContext = (0, import_react2.createContext)(null);
var Provider = NodeIdContext.Provider;
NodeIdContext.Consumer;
function checkElementBelowIsValid(event, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc2) {
  const elementBelow = doc2.elementFromPoint(event.clientX, event.clientY);
  const elementBelowIsTarget = (elementBelow == null ? void 0 : elementBelow.classList.contains("target")) || false;
  const elementBelowIsSource = (elementBelow == null ? void 0 : elementBelow.classList.contains("source")) || false;
  const result = {
    elementBelow,
    isValid: false,
    connection: { source: null, target: null, sourceHandle: null, targetHandle: null },
    isHoveringHandle: false
  };
  if (elementBelow && (elementBelowIsTarget || elementBelowIsSource)) {
    result.isHoveringHandle = true;
    const elementBelowNodeId = elementBelow.getAttribute("data-nodeid");
    const elementBelowHandleId = elementBelow.getAttribute("data-handleid");
    const connection = isTarget ? {
      source: elementBelowNodeId,
      sourceHandle: elementBelowHandleId,
      target: nodeId,
      targetHandle: handleId
    } : {
      source: nodeId,
      sourceHandle: handleId,
      target: elementBelowNodeId,
      targetHandle: elementBelowHandleId
    };
    result.connection = connection;
    const isValid = connectionMode === ConnectionMode.Strict ? isTarget && elementBelowIsSource || !isTarget && elementBelowIsTarget : true;
    if (isValid) {
      result.isValid = isValidConnection(connection);
    }
  }
  return result;
}
function resetRecentHandle(hoveredHandle) {
  hoveredHandle == null ? void 0 : hoveredHandle.classList.remove("react-flow__handle-valid");
  hoveredHandle == null ? void 0 : hoveredHandle.classList.remove("react-flow__handle-connecting");
}
function handleMouseDown({ event, handleId, nodeId, onConnect, isTarget, getState, setState, isValidConnection, elementEdgeUpdaterType, onEdgeUpdateEnd }) {
  const reactFlowNode = event.target.closest(".react-flow");
  const doc2 = getHostForElement(event.target);
  if (!doc2) {
    return;
  }
  const elementBelow = doc2.elementFromPoint(event.clientX, event.clientY);
  const elementBelowIsTarget = elementBelow == null ? void 0 : elementBelow.classList.contains("target");
  const elementBelowIsSource = elementBelow == null ? void 0 : elementBelow.classList.contains("source");
  if (!reactFlowNode || !elementBelowIsTarget && !elementBelowIsSource && !elementEdgeUpdaterType) {
    return;
  }
  const { onConnectStart, connectionMode } = getState();
  const handleType = elementEdgeUpdaterType ? elementEdgeUpdaterType : elementBelowIsTarget ? "target" : "source";
  const containerBounds = reactFlowNode.getBoundingClientRect();
  let recentHoveredHandle;
  setState({
    connectionPosition: {
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top
    },
    connectionNodeId: nodeId,
    connectionHandleId: handleId,
    connectionHandleType: handleType
  });
  onConnectStart == null ? void 0 : onConnectStart(event, { nodeId, handleId, handleType });
  function onMouseMove(event2) {
    setState({
      connectionPosition: {
        x: event2.clientX - containerBounds.left,
        y: event2.clientY - containerBounds.top
      }
    });
    const { connection, elementBelow: elementBelow2, isValid, isHoveringHandle } = checkElementBelowIsValid(event2, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc2);
    if (!isHoveringHandle) {
      return resetRecentHandle(recentHoveredHandle);
    }
    if (connection.source !== connection.target && elementBelow2) {
      resetRecentHandle(recentHoveredHandle);
      recentHoveredHandle = elementBelow2;
      elementBelow2.classList.add("react-flow__handle-connecting");
      elementBelow2.classList.toggle("react-flow__handle-valid", isValid);
    }
  }
  function onMouseUp(event2) {
    var _a, _b;
    const { connection, isValid } = checkElementBelowIsValid(event2, connectionMode, isTarget, nodeId, handleId, isValidConnection, doc2);
    if (isValid) {
      onConnect == null ? void 0 : onConnect(connection);
    }
    (_b = (_a = getState()).onConnectEnd) == null ? void 0 : _b.call(_a, event2);
    if (elementEdgeUpdaterType && onEdgeUpdateEnd) {
      onEdgeUpdateEnd(event2);
    }
    resetRecentHandle(recentHoveredHandle);
    setState({
      connectionNodeId: null,
      connectionHandleId: null,
      connectionHandleType: null
    });
    doc2.removeEventListener("mousemove", onMouseMove);
    doc2.removeEventListener("mouseup", onMouseUp);
  }
  doc2.addEventListener("mousemove", onMouseMove);
  doc2.addEventListener("mouseup", onMouseUp);
}
var isEdge = (element) => "id" in element && "source" in element && "target" in element;
var isNode = (element) => "id" in element && !("source" in element) && !("target" in element);
var getOutgoers = (node, nodes, edges) => {
  if (!isNode(node)) {
    return [];
  }
  const outgoerIds = edges.filter((e) => e.source === node.id).map((e) => e.target);
  return nodes.filter((n) => outgoerIds.includes(n.id));
};
var getIncomers = (node, nodes, edges) => {
  if (!isNode(node)) {
    return [];
  }
  const incomersIds = edges.filter((e) => e.target === node.id).map((e) => e.source);
  return nodes.filter((n) => incomersIds.includes(n.id));
};
var getEdgeId = ({ source, sourceHandle, target, targetHandle }) => `reactflow__edge-${source}${sourceHandle || ""}-${target}${targetHandle || ""}`;
var getMarkerId = (marker, rfId) => {
  if (typeof marker === "undefined") {
    return "";
  }
  if (typeof marker === "string") {
    return marker;
  }
  const idPrefix = rfId ? `${rfId}__` : "";
  return `${idPrefix}${Object.keys(marker).sort().map((key) => `${key}=${marker[key]}`).join("&")}`;
};
var connectionExists = (edge, edges) => {
  return edges.some((el) => el.source === edge.source && el.target === edge.target && (el.sourceHandle === edge.sourceHandle || !el.sourceHandle && !edge.sourceHandle) && (el.targetHandle === edge.targetHandle || !el.targetHandle && !edge.targetHandle));
};
var addEdge = (edgeParams, edges) => {
  if (!edgeParams.source || !edgeParams.target) {
    devWarn("Can't create edge. An edge needs a source and a target. Help: https://reactflow.dev/error#600");
    return edges;
  }
  let edge;
  if (isEdge(edgeParams)) {
    edge = { ...edgeParams };
  } else {
    edge = {
      ...edgeParams,
      id: getEdgeId(edgeParams)
    };
  }
  if (connectionExists(edge, edges)) {
    return edges;
  }
  return edges.concat(edge);
};
var updateEdge = (oldEdge, newConnection, edges) => {
  if (!newConnection.source || !newConnection.target) {
    devWarn("Can't create a new edge. An edge needs a source and a target. Help: https://reactflow.dev/error#600");
    return edges;
  }
  const foundEdge = edges.find((e) => e.id === oldEdge.id);
  if (!foundEdge) {
    devWarn(`The old edge with id=${oldEdge.id} does not exist. Help: https://reactflow.dev/error#700`);
    return edges;
  }
  const edge = {
    ...oldEdge,
    id: getEdgeId(newConnection),
    source: newConnection.source,
    target: newConnection.target,
    sourceHandle: newConnection.sourceHandle,
    targetHandle: newConnection.targetHandle
  };
  return edges.filter((e) => e.id !== oldEdge.id).concat(edge);
};
var pointToRendererPoint = ({ x, y }, [tx, ty, tScale], snapToGrid, [snapX, snapY]) => {
  const position = {
    x: (x - tx) / tScale,
    y: (y - ty) / tScale
  };
  if (snapToGrid) {
    return {
      x: snapX * Math.round(position.x / snapX),
      y: snapY * Math.round(position.y / snapY)
    };
  }
  return position;
};
var getRectOfNodes = (nodes, nodeOrigin = [0, 0]) => {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const box = nodes.reduce((currBox, { positionAbsolute, position, width, height }) => {
    const nodeX = positionAbsolute ? positionAbsolute.x : position.x;
    const nodeY = positionAbsolute ? positionAbsolute.y : position.y;
    return getBoundsOfBoxes(currBox, rectToBox({
      x: nodeX - nodeOrigin[0] * (width || 0),
      y: nodeY - nodeOrigin[1] * (height || 0),
      width: width || 0,
      height: height || 0
    }));
  }, { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity });
  return boxToRect(box);
};
var getNodesInside = (nodeInternals, rect, [tx, ty, tScale] = [0, 0, 1], partially = false, excludeNonSelectableNodes = false, nodeOrigin = [0, 0]) => {
  const paneRect = {
    x: (rect.x - tx) / tScale,
    y: (rect.y - ty) / tScale,
    width: rect.width / tScale,
    height: rect.height / tScale
  };
  const visibleNodes = [];
  nodeInternals.forEach((node) => {
    const { width, height, selectable = true, positionAbsolute = { x: 0, y: 0 } } = node;
    if (excludeNonSelectableNodes && !selectable) {
      return false;
    }
    const nodeRect = {
      x: positionAbsolute.x - nodeOrigin[0] * (width || 0),
      y: positionAbsolute.y - nodeOrigin[1] * (height || 0),
      width: width || 0,
      height: height || 0
    };
    const overlappingArea = getOverlappingArea(paneRect, nodeRect);
    const notInitialized = typeof width === "undefined" || typeof height === "undefined" || width === null || height === null;
    const partiallyVisible = partially && overlappingArea > 0;
    const area = (width || 0) * (height || 0);
    const isVisible = notInitialized || partiallyVisible || overlappingArea >= area;
    if (isVisible || node.dragging) {
      visibleNodes.push(node);
    }
  });
  return visibleNodes;
};
var getConnectedEdges = (nodes, edges) => {
  const nodeIds = nodes.map((node) => node.id);
  return edges.filter((edge) => nodeIds.includes(edge.source) || nodeIds.includes(edge.target));
};
var getTransformForBounds = (bounds, width, height, minZoom, maxZoom, padding = 0.1) => {
  const xZoom = width / (bounds.width * (1 + padding));
  const yZoom = height / (bounds.height * (1 + padding));
  const zoom = Math.min(xZoom, yZoom);
  const clampedZoom = clamp(zoom, minZoom, maxZoom);
  const boundsCenterX = bounds.x + bounds.width / 2;
  const boundsCenterY = bounds.y + bounds.height / 2;
  const x = width / 2 - boundsCenterX * clampedZoom;
  const y = height / 2 - boundsCenterY * clampedZoom;
  return [x, y, clampedZoom];
};
var getD3Transition = (selection2, duration = 0) => {
  return selection2.transition().duration(duration);
};
var alwaysValid = () => true;
var selector$e = (s) => ({
  connectionStartHandle: s.connectionStartHandle,
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName
});
var Handle = (0, import_react2.forwardRef)(({ type = "source", position = Position.Top, isValidConnection = alwaysValid, isConnectable = true, id: id2, onConnect, children: children2, className, onMouseDown, ...rest }, ref) => {
  const store = useStoreApi();
  const nodeId = (0, import_react2.useContext)(NodeIdContext);
  const { connectionStartHandle, connectOnClick, noPanClassName } = useStore2(selector$e, shallow);
  const handleId = id2 || null;
  const isTarget = type === "target";
  const onConnectExtended = (params) => {
    const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();
    const edgeParams = {
      ...defaultEdgeOptions,
      ...params
    };
    if (hasDefaultEdges) {
      const { edges } = store.getState();
      store.setState({ edges: addEdge(edgeParams, edges) });
    }
    onConnectAction == null ? void 0 : onConnectAction(edgeParams);
    onConnect == null ? void 0 : onConnect(edgeParams);
  };
  const onMouseDownHandler = (event) => {
    if (event.button === 0) {
      handleMouseDown({
        event,
        handleId,
        nodeId,
        onConnect: onConnectExtended,
        isTarget,
        getState: store.getState,
        setState: store.setState,
        isValidConnection
      });
    }
    onMouseDown == null ? void 0 : onMouseDown(event);
  };
  const onClick = (event) => {
    const { onClickConnectStart, onClickConnectEnd, connectionMode } = store.getState();
    if (!connectionStartHandle) {
      onClickConnectStart == null ? void 0 : onClickConnectStart(event, { nodeId, handleId, handleType: type });
      store.setState({ connectionStartHandle: { nodeId, type, handleId } });
      return;
    }
    const doc2 = getHostForElement(event.target);
    const { connection, isValid } = checkElementBelowIsValid(event, connectionMode, connectionStartHandle.type === "target", connectionStartHandle.nodeId, connectionStartHandle.handleId || null, isValidConnection, doc2);
    if (isValid) {
      onConnectExtended(connection);
    }
    onClickConnectEnd == null ? void 0 : onClickConnectEnd(event);
    store.setState({ connectionStartHandle: null });
  };
  return (0, import_jsx_runtime.jsx)("div", { "data-handleid": handleId, "data-nodeid": nodeId, "data-handlepos": position, className: cc([
    "react-flow__handle",
    `react-flow__handle-${position}`,
    "nodrag",
    noPanClassName,
    className,
    {
      source: !isTarget,
      target: isTarget,
      connectable: isConnectable,
      connecting: (connectionStartHandle == null ? void 0 : connectionStartHandle.nodeId) === nodeId && (connectionStartHandle == null ? void 0 : connectionStartHandle.handleId) === handleId && (connectionStartHandle == null ? void 0 : connectionStartHandle.type) === type
    }
  ]), onMouseDown: onMouseDownHandler, onClick: connectOnClick ? onClick : void 0, ref, ...rest, children: children2 });
});
Handle.displayName = "Handle";
var Handle$1 = (0, import_react2.memo)(Handle);
var DefaultNode = ({ data, isConnectable, targetPosition = Position.Top, sourcePosition = Position.Bottom }) => {
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(Handle$1, { type: "target", position: targetPosition, isConnectable }), data == null ? void 0 : data.label, (0, import_jsx_runtime.jsx)(Handle$1, { type: "source", position: sourcePosition, isConnectable })] });
};
DefaultNode.displayName = "DefaultNode";
var DefaultNode$1 = (0, import_react2.memo)(DefaultNode);
var InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }) => (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [data == null ? void 0 : data.label, (0, import_jsx_runtime.jsx)(Handle$1, { type: "source", position: sourcePosition, isConnectable })] });
InputNode.displayName = "InputNode";
var InputNode$1 = (0, import_react2.memo)(InputNode);
var OutputNode = ({ data, isConnectable, targetPosition = Position.Top }) => (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(Handle$1, { type: "target", position: targetPosition, isConnectable }), data == null ? void 0 : data.label] });
OutputNode.displayName = "OutputNode";
var OutputNode$1 = (0, import_react2.memo)(OutputNode);
var GroupNode = () => null;
GroupNode.displayName = "GroupNode";
var selector$d = (s) => ({
  selectedNodes: Array.from(s.nodeInternals.values()).filter((n) => n.selected),
  selectedEdges: s.edges.filter((e) => e.selected)
});
var selectId = (obj) => obj.id;
function areEqual(a, b) {
  return shallow(a.selectedNodes.map(selectId), b.selectedNodes.map(selectId)) && shallow(a.selectedEdges.map(selectId), b.selectedEdges.map(selectId));
}
var SelectionListener = (0, import_react2.memo)(({ onSelectionChange }) => {
  const store = useStoreApi();
  const { selectedNodes, selectedEdges } = useStore2(selector$d, areEqual);
  (0, import_react2.useEffect)(() => {
    var _a, _b;
    const params = { nodes: selectedNodes, edges: selectedEdges };
    onSelectionChange == null ? void 0 : onSelectionChange(params);
    (_b = (_a = store.getState()).onSelectionChange) == null ? void 0 : _b.call(_a, params);
  }, [selectedNodes, selectedEdges, onSelectionChange]);
  return null;
});
SelectionListener.displayName = "SelectionListener";
var changeSelector = (s) => !!s.onSelectionChange;
function Wrapper$1({ onSelectionChange }) {
  const storeHasSelectionChange = useStore2(changeSelector);
  if (onSelectionChange || storeHasSelectionChange) {
    return (0, import_jsx_runtime.jsx)(SelectionListener, { onSelectionChange });
  }
  return null;
}
var selector$c = (s) => ({
  setNodes: s.setNodes,
  setEdges: s.setEdges,
  setDefaultNodesAndEdges: s.setDefaultNodesAndEdges,
  setMinZoom: s.setMinZoom,
  setMaxZoom: s.setMaxZoom,
  setTranslateExtent: s.setTranslateExtent,
  setNodeExtent: s.setNodeExtent,
  reset: s.reset
});
function useStoreUpdater(value, setStoreState) {
  (0, import_react2.useEffect)(() => {
    if (typeof value !== "undefined") {
      setStoreState(value);
    }
  }, [value]);
}
function useDirectStoreUpdater(key, value, setState) {
  (0, import_react2.useEffect)(() => {
    if (typeof value !== "undefined") {
      setState({ [key]: value });
    }
  }, [value]);
}
var StoreUpdater = ({ nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, elementsSelectable, connectionMode, snapGrid, snapToGrid, translateExtent, connectOnClick, defaultEdgeOptions, fitView: fitView2, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDrag, onNodeDragStart, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId }) => {
  const { setNodes, setEdges, setDefaultNodesAndEdges, setMinZoom, setMaxZoom, setTranslateExtent, setNodeExtent, reset } = useStore2(selector$c, shallow);
  const store = useStoreApi();
  (0, import_react2.useEffect)(() => {
    const edgesWithDefaults = defaultEdges == null ? void 0 : defaultEdges.map((e) => ({ ...e, ...defaultEdgeOptions }));
    setDefaultNodesAndEdges(defaultNodes, edgesWithDefaults);
    return () => {
      reset();
    };
  }, []);
  useDirectStoreUpdater("defaultEdgeOptions", defaultEdgeOptions, store.setState);
  useDirectStoreUpdater("connectionMode", connectionMode, store.setState);
  useDirectStoreUpdater("onConnect", onConnect, store.setState);
  useDirectStoreUpdater("onConnectStart", onConnectStart, store.setState);
  useDirectStoreUpdater("onConnectEnd", onConnectEnd, store.setState);
  useDirectStoreUpdater("onClickConnectStart", onClickConnectStart, store.setState);
  useDirectStoreUpdater("onClickConnectEnd", onClickConnectEnd, store.setState);
  useDirectStoreUpdater("nodesDraggable", nodesDraggable, store.setState);
  useDirectStoreUpdater("nodesConnectable", nodesConnectable, store.setState);
  useDirectStoreUpdater("nodesFocusable", nodesFocusable, store.setState);
  useDirectStoreUpdater("edgesFocusable", edgesFocusable, store.setState);
  useDirectStoreUpdater("elementsSelectable", elementsSelectable, store.setState);
  useDirectStoreUpdater("snapToGrid", snapToGrid, store.setState);
  useDirectStoreUpdater("snapGrid", snapGrid, store.setState);
  useDirectStoreUpdater("onNodesChange", onNodesChange, store.setState);
  useDirectStoreUpdater("onEdgesChange", onEdgesChange, store.setState);
  useDirectStoreUpdater("connectOnClick", connectOnClick, store.setState);
  useDirectStoreUpdater("fitViewOnInit", fitView2, store.setState);
  useDirectStoreUpdater("fitViewOnInitOptions", fitViewOptions, store.setState);
  useDirectStoreUpdater("onNodesDelete", onNodesDelete, store.setState);
  useDirectStoreUpdater("onEdgesDelete", onEdgesDelete, store.setState);
  useDirectStoreUpdater("onNodeDrag", onNodeDrag, store.setState);
  useDirectStoreUpdater("onNodeDragStart", onNodeDragStart, store.setState);
  useDirectStoreUpdater("onNodeDragStop", onNodeDragStop, store.setState);
  useDirectStoreUpdater("onSelectionDrag", onSelectionDrag, store.setState);
  useDirectStoreUpdater("onSelectionDragStart", onSelectionDragStart, store.setState);
  useDirectStoreUpdater("onSelectionDragStop", onSelectionDragStop, store.setState);
  useDirectStoreUpdater("noPanClassName", noPanClassName, store.setState);
  useDirectStoreUpdater("nodeOrigin", nodeOrigin, store.setState);
  useDirectStoreUpdater("rfId", rfId, store.setState);
  useStoreUpdater(nodes, setNodes);
  useStoreUpdater(edges, setEdges);
  useStoreUpdater(minZoom, setMinZoom);
  useStoreUpdater(maxZoom, setMaxZoom);
  useStoreUpdater(translateExtent, setTranslateExtent);
  useStoreUpdater(nodeExtent, setNodeExtent);
  return null;
};
var style = { display: "none" };
var ariaLiveStyle = {
  position: "absolute",
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: "hidden",
  clip: "rect(0px, 0px, 0px, 0px)",
  clipPath: "inset(100%)"
};
var ARIA_NODE_DESC_KEY = "react-flow__node-desc";
var ARIA_EDGE_DESC_KEY = "react-flow__edge-desc";
var ARIA_LIVE_MESSAGE = "react-flow__aria-live";
var selector$b = (s) => s.ariaLiveMessage;
function AriaLiveMessage({ rfId }) {
  const ariaLiveMessage = useStore2(selector$b);
  return (0, import_jsx_runtime.jsx)("div", { id: `${ARIA_LIVE_MESSAGE}-${rfId}`, "aria-live": "assertive", "aria-atomic": "true", style: ariaLiveStyle, children: ariaLiveMessage });
}
function A11yDescriptions({ rfId, disableKeyboardA11y }) {
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsxs)("div", { id: `${ARIA_NODE_DESC_KEY}-${rfId}`, style, children: ["Press enter or space to select a node.", !disableKeyboardA11y && "You can then use the arrow keys to move the node around.", " Press delete to remove it and escape to cancel.", " "] }), (0, import_jsx_runtime.jsx)("div", { id: `${ARIA_EDGE_DESC_KEY}-${rfId}`, style, children: "Press enter or space to select an edge. You can then press delete to remove it or escape to cancel." }), !disableKeyboardA11y && (0, import_jsx_runtime.jsx)(AriaLiveMessage, { rfId })] });
}
var shiftX = (x, shift, position) => {
  if (position === Position.Left)
    return x - shift;
  if (position === Position.Right)
    return x + shift;
  return x;
};
var shiftY = (y, shift, position) => {
  if (position === Position.Top)
    return y - shift;
  if (position === Position.Bottom)
    return y + shift;
  return y;
};
var EdgeUpdaterClassName = "react-flow__edgeupdater";
var EdgeAnchor = ({ position, centerX, centerY, radius = 10, onMouseDown, onMouseEnter, onMouseOut, type }) => (0, import_jsx_runtime.jsx)("circle", { onMouseDown, onMouseEnter, onMouseOut, className: cc([EdgeUpdaterClassName, `${EdgeUpdaterClassName}-${type}`]), cx: shiftX(centerX, radius, position), cy: shiftY(centerY, radius, position), r: radius, stroke: "transparent", fill: "transparent" });
var wrapEdge = (EdgeComponent) => {
  const EdgeWrapper = ({ id: id2, className, type, data, onClick, onEdgeDoubleClick, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, style: style2, source, target, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, hidden, sourceHandleId, targetHandleId, onContextMenu, onMouseEnter, onMouseMove, onMouseLeave, edgeUpdaterRadius, onEdgeUpdate, onEdgeUpdateStart, onEdgeUpdateEnd, markerEnd, markerStart, rfId, ariaLabel, isFocusable, pathOptions, interactionWidth }) => {
    const edgeRef = (0, import_react2.useRef)(null);
    const [updateHover, setUpdateHover] = (0, import_react2.useState)(false);
    const [updating, setUpdating] = (0, import_react2.useState)(false);
    const store = useStoreApi();
    const markerStartUrl = (0, import_react2.useMemo)(() => `url(#${getMarkerId(markerStart, rfId)})`, [markerStart, rfId]);
    const markerEndUrl = (0, import_react2.useMemo)(() => `url(#${getMarkerId(markerEnd, rfId)})`, [markerEnd, rfId]);
    if (hidden) {
      return null;
    }
    const onEdgeClick = (event) => {
      const { edges, addSelectedEdges } = store.getState();
      if (elementsSelectable) {
        store.setState({ nodesSelectionActive: false });
        addSelectedEdges([id2]);
      }
      if (onClick) {
        const edge = edges.find((e) => e.id === id2);
        onClick(event, edge);
      }
    };
    const onEdgeDoubleClickHandler = getMouseHandler$1(id2, store.getState, onEdgeDoubleClick);
    const onEdgeContextMenu = getMouseHandler$1(id2, store.getState, onContextMenu);
    const onEdgeMouseEnter = getMouseHandler$1(id2, store.getState, onMouseEnter);
    const onEdgeMouseMove = getMouseHandler$1(id2, store.getState, onMouseMove);
    const onEdgeMouseLeave = getMouseHandler$1(id2, store.getState, onMouseLeave);
    const handleEdgeUpdater = (event, isSourceHandle) => {
      const nodeId = isSourceHandle ? target : source;
      const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
      const handleType = isSourceHandle ? "target" : "source";
      const isValidConnection = () => true;
      const isTarget = isSourceHandle;
      const edge = store.getState().edges.find((e) => e.id === id2);
      setUpdating(true);
      onEdgeUpdateStart == null ? void 0 : onEdgeUpdateStart(event, edge, handleType);
      const _onEdgeUpdateEnd = (evt) => {
        setUpdating(false);
        onEdgeUpdateEnd == null ? void 0 : onEdgeUpdateEnd(evt, edge, handleType);
      };
      const onConnectEdge = (connection) => onEdgeUpdate == null ? void 0 : onEdgeUpdate(edge, connection);
      handleMouseDown({
        event,
        handleId,
        nodeId,
        onConnect: onConnectEdge,
        isTarget,
        getState: store.getState,
        setState: store.setState,
        isValidConnection,
        elementEdgeUpdaterType: handleType,
        onEdgeUpdateEnd: _onEdgeUpdateEnd
      });
    };
    const onEdgeUpdaterSourceMouseDown = (event) => handleEdgeUpdater(event, true);
    const onEdgeUpdaterTargetMouseDown = (event) => handleEdgeUpdater(event, false);
    const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
    const onEdgeUpdaterMouseOut = () => setUpdateHover(false);
    const inactive = !elementsSelectable && !onClick;
    const handleEdgeUpdate = typeof onEdgeUpdate !== "undefined";
    const onKeyDown = (event) => {
      var _a;
      if (elementSelectionKeys.includes(event.key) && elementsSelectable) {
        const { unselectNodesAndEdges, addSelectedEdges, edges } = store.getState();
        const unselect = event.key === "Escape";
        if (unselect) {
          (_a = edgeRef.current) == null ? void 0 : _a.blur();
          unselectNodesAndEdges({ edges: [edges.find((e) => e.id === id2)] });
        } else {
          addSelectedEdges([id2]);
        }
      }
    };
    return (0, import_jsx_runtime.jsxs)("g", { className: cc([
      "react-flow__edge",
      `react-flow__edge-${type}`,
      className,
      { selected, animated, inactive, updating: updateHover }
    ]), onClick: onEdgeClick, onDoubleClick: onEdgeDoubleClickHandler, onContextMenu: onEdgeContextMenu, onMouseEnter: onEdgeMouseEnter, onMouseMove: onEdgeMouseMove, onMouseLeave: onEdgeMouseLeave, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : void 0, "data-testid": `rf__edge-${id2}`, "aria-label": ariaLabel === null ? void 0 : ariaLabel ? ariaLabel : `Edge from ${source} to ${target}`, "aria-describedby": isFocusable ? `${ARIA_EDGE_DESC_KEY}-${rfId}` : void 0, ref: edgeRef, children: [!updating && (0, import_jsx_runtime.jsx)(EdgeComponent, { id: id2, source, target, selected, animated, label, labelStyle, labelShowBg, labelBgStyle, labelBgPadding, labelBgBorderRadius, data, style: style2, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, sourceHandleId, targetHandleId, markerStart: markerStartUrl, markerEnd: markerEndUrl, pathOptions, interactionWidth }), handleEdgeUpdate && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(EdgeAnchor, { position: sourcePosition, centerX: sourceX, centerY: sourceY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterSourceMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "source" }), (0, import_jsx_runtime.jsx)(EdgeAnchor, { position: targetPosition, centerX: targetX, centerY: targetY, radius: edgeUpdaterRadius, onMouseDown: onEdgeUpdaterTargetMouseDown, onMouseEnter: onEdgeUpdaterMouseEnter, onMouseOut: onEdgeUpdaterMouseOut, type: "target" })] })] });
  };
  EdgeWrapper.displayName = "EdgeWrapper";
  return (0, import_react2.memo)(EdgeWrapper);
};
function createEdgeTypes(edgeTypes) {
  const standardTypes = {
    default: wrapEdge(edgeTypes.default || BezierEdge),
    straight: wrapEdge(edgeTypes.bezier || StraightEdge),
    step: wrapEdge(edgeTypes.step || StepEdge),
    smoothstep: wrapEdge(edgeTypes.step || SmoothStepEdge),
    simplebezier: wrapEdge(edgeTypes.simplebezier || SimpleBezierEdge)
  };
  const wrappedTypes = {};
  const specialTypes = Object.keys(edgeTypes).filter((k) => !["default", "bezier"].includes(k)).reduce((res, key) => {
    res[key] = wrapEdge(edgeTypes[key] || BezierEdge);
    return res;
  }, wrappedTypes);
  return {
    ...standardTypes,
    ...specialTypes
  };
}
function getHandlePosition(position, nodeRect, handle = null) {
  const x = ((handle == null ? void 0 : handle.x) || 0) + nodeRect.x;
  const y = ((handle == null ? void 0 : handle.y) || 0) + nodeRect.y;
  const width = (handle == null ? void 0 : handle.width) || nodeRect.width;
  const height = (handle == null ? void 0 : handle.height) || nodeRect.height;
  switch (position) {
    case Position.Top:
      return {
        x: x + width / 2,
        y
      };
    case Position.Right:
      return {
        x: x + width,
        y: y + height / 2
      };
    case Position.Bottom:
      return {
        x: x + width / 2,
        y: y + height
      };
    case Position.Left:
      return {
        x,
        y: y + height / 2
      };
  }
}
function getHandle(bounds, handleId) {
  if (!bounds) {
    return null;
  }
  let handle = null;
  if (bounds.length === 1 || !handleId) {
    handle = bounds[0];
  } else if (handleId) {
    handle = bounds.find((d) => d.id === handleId);
  }
  return typeof handle === "undefined" ? null : handle;
}
var getEdgePositions = (sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition) => {
  const sourceHandlePos = getHandlePosition(sourcePosition, sourceNodeRect, sourceHandle);
  const targetHandlePos = getHandlePosition(targetPosition, targetNodeRect, targetHandle);
  return {
    sourceX: sourceHandlePos.x,
    sourceY: sourceHandlePos.y,
    targetX: targetHandlePos.x,
    targetY: targetHandlePos.y
  };
};
function isEdgeVisible({ sourcePos, targetPos, sourceWidth, sourceHeight, targetWidth, targetHeight, width, height, transform: transform2 }) {
  const edgeBox = {
    x: Math.min(sourcePos.x, targetPos.x),
    y: Math.min(sourcePos.y, targetPos.y),
    x2: Math.max(sourcePos.x + sourceWidth, targetPos.x + targetWidth),
    y2: Math.max(sourcePos.y + sourceHeight, targetPos.y + targetHeight)
  };
  if (edgeBox.x === edgeBox.x2) {
    edgeBox.x2 += 1;
  }
  if (edgeBox.y === edgeBox.y2) {
    edgeBox.y2 += 1;
  }
  const viewBox = rectToBox({
    x: (0 - transform2[0]) / transform2[2],
    y: (0 - transform2[1]) / transform2[2],
    width: width / transform2[2],
    height: height / transform2[2]
  });
  const xOverlap = Math.max(0, Math.min(viewBox.x2, edgeBox.x2) - Math.max(viewBox.x, edgeBox.x));
  const yOverlap = Math.max(0, Math.min(viewBox.y2, edgeBox.y2) - Math.max(viewBox.y, edgeBox.y));
  const overlappingArea = Math.ceil(xOverlap * yOverlap);
  return overlappingArea > 0;
}
function getNodeData(node) {
  var _a, _b, _c, _d, _e;
  const handleBounds = ((_a = node == null ? void 0 : node[internalsSymbol]) == null ? void 0 : _a.handleBounds) || null;
  const isInvalid = !node || !handleBounds || !node.width || !node.height || typeof ((_b = node.positionAbsolute) == null ? void 0 : _b.x) === "undefined" || typeof ((_c = node.positionAbsolute) == null ? void 0 : _c.y) === "undefined";
  return [
    {
      x: ((_d = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _d.x) || 0,
      y: ((_e = node == null ? void 0 : node.positionAbsolute) == null ? void 0 : _e.y) || 0,
      width: (node == null ? void 0 : node.width) || 0,
      height: (node == null ? void 0 : node.height) || 0
    },
    handleBounds,
    !isInvalid
  ];
}
function isParentSelected(node, nodeInternals) {
  if (!node.parentNode) {
    return false;
  }
  const parentNode = nodeInternals.get(node.parentNode);
  if (!parentNode) {
    return false;
  }
  if (parentNode.selected) {
    return true;
  }
  return isParentSelected(parentNode, nodeInternals);
}
function hasSelector(target, selector5, nodeRef) {
  let current = target;
  do {
    if (current == null ? void 0 : current.matches(selector5))
      return true;
    if (current === nodeRef.current)
      return false;
    current = current.parentElement;
  } while (current);
  return false;
}
function getDragItems(nodeInternals, mousePos, nodeId) {
  return Array.from(nodeInternals.values()).filter((n) => (n.selected || n.id === nodeId) && (!n.parentNode || !isParentSelected(n, nodeInternals))).map((n) => {
    var _a, _b, _c, _d;
    return {
      id: n.id,
      position: n.position || { x: 0, y: 0 },
      positionAbsolute: n.positionAbsolute || { x: 0, y: 0 },
      distance: {
        x: mousePos.x - ((_b = (_a = n.positionAbsolute) == null ? void 0 : _a.x) != null ? _b : 0),
        y: mousePos.y - ((_d = (_c = n.positionAbsolute) == null ? void 0 : _c.y) != null ? _d : 0)
      },
      delta: {
        x: 0,
        y: 0
      },
      extent: n.extent,
      parentNode: n.parentNode,
      width: n.width,
      height: n.height
    };
  });
}
function calcNextPosition(node, nextPosition, nodeInternals, nodeExtent) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  let currentExtent = node.extent || nodeExtent;
  if (node.extent === "parent") {
    if (node.parentNode && node.width && node.height) {
      const parent = nodeInternals.get(node.parentNode);
      currentExtent = (parent == null ? void 0 : parent.positionAbsolute) && (parent == null ? void 0 : parent.width) && (parent == null ? void 0 : parent.height) ? [
        [parent.positionAbsolute.x, parent.positionAbsolute.y],
        [
          parent.positionAbsolute.x + parent.width - node.width,
          parent.positionAbsolute.y + parent.height - node.height
        ]
      ] : currentExtent;
    } else {
      devWarn("Only child nodes can use a parent extent. Help: https://reactflow.dev/error#500");
      currentExtent = nodeExtent;
    }
  } else if (node.extent && node.parentNode) {
    const parent = nodeInternals.get(node.parentNode);
    const parentX = (_b = (_a = parent == null ? void 0 : parent.positionAbsolute) == null ? void 0 : _a.x) != null ? _b : 0;
    const parentY = (_d = (_c = parent == null ? void 0 : parent.positionAbsolute) == null ? void 0 : _c.y) != null ? _d : 0;
    currentExtent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
    ];
  }
  let parentPosition = { x: 0, y: 0 };
  if (node.parentNode) {
    const parentNode = nodeInternals.get(node.parentNode);
    parentPosition = { x: (_f = (_e = parentNode == null ? void 0 : parentNode.positionAbsolute) == null ? void 0 : _e.x) != null ? _f : 0, y: (_h = (_g = parentNode == null ? void 0 : parentNode.positionAbsolute) == null ? void 0 : _g.y) != null ? _h : 0 };
  }
  const positionAbsolute = currentExtent ? clampPosition(nextPosition, currentExtent) : nextPosition;
  return {
    position: {
      x: positionAbsolute.x - parentPosition.x,
      y: positionAbsolute.y - parentPosition.y
    },
    positionAbsolute
  };
}
function getEventHandlerParams({ nodeId, dragItems, nodeInternals }) {
  const extentedDragItems = dragItems.map((n) => {
    const node = nodeInternals.get(n.id);
    return {
      ...node,
      position: n.position,
      positionAbsolute: n.positionAbsolute
    };
  });
  return [nodeId ? extentedDragItems.find((n) => n.id === nodeId) : extentedDragItems[0], extentedDragItems];
}
var getHandleBounds = (selector5, nodeElement, zoom, nodeOrigin) => {
  const handles = nodeElement.querySelectorAll(selector5);
  if (!handles || !handles.length) {
    return null;
  }
  const handlesArray = Array.from(handles);
  const nodeBounds = nodeElement.getBoundingClientRect();
  const nodeOffset = {
    x: nodeBounds.width * nodeOrigin[0],
    y: nodeBounds.height * nodeOrigin[1]
  };
  return handlesArray.map((handle) => {
    const handleBounds = handle.getBoundingClientRect();
    return {
      id: handle.getAttribute("data-handleid"),
      position: handle.getAttribute("data-handlepos"),
      x: (handleBounds.left - nodeBounds.left - nodeOffset.x) / zoom,
      y: (handleBounds.top - nodeBounds.top - nodeOffset.y) / zoom,
      ...getDimensions(handle)
    };
  });
};
function getMouseHandler(id2, getState, handler) {
  return handler === void 0 ? handler : (event) => {
    const node = getState().nodeInternals.get(id2);
    handler(event, { ...node });
  };
}
function handleNodeClick({ id: id2, store, unselect = false }) {
  const { addSelectedNodes, unselectNodesAndEdges, multiSelectionActive, nodeInternals } = store.getState();
  const node = nodeInternals.get(id2);
  store.setState({ nodesSelectionActive: false });
  if (!node.selected) {
    addSelectedNodes([id2]);
  } else if (unselect || node.selected && multiSelectionActive) {
    unselectNodesAndEdges({ nodes: [node] });
  }
}
function wrapSelectionDragFunc(selectionFunc) {
  return (event, _, nodes) => selectionFunc == null ? void 0 : selectionFunc(event, nodes);
}
function useDrag({ nodeRef, disabled = false, noDragClassName, handleSelector, nodeId, isSelectable, selectNodesOnDrag }) {
  const [dragging, setDragging] = (0, import_react2.useState)(false);
  const store = useStoreApi();
  const dragItems = (0, import_react2.useRef)();
  const lastPos = (0, import_react2.useRef)({ x: null, y: null });
  const getPointerPosition = (0, import_react2.useCallback)(({ sourceEvent }) => {
    const { transform: transform2, snapGrid, snapToGrid } = store.getState();
    const x = sourceEvent.touches ? sourceEvent.touches[0].clientX : sourceEvent.clientX;
    const y = sourceEvent.touches ? sourceEvent.touches[0].clientY : sourceEvent.clientY;
    const pointerPos = {
      x: (x - transform2[0]) / transform2[2],
      y: (y - transform2[1]) / transform2[2]
    };
    return {
      xSnapped: snapToGrid ? snapGrid[0] * Math.round(pointerPos.x / snapGrid[0]) : pointerPos.x,
      ySnapped: snapToGrid ? snapGrid[1] * Math.round(pointerPos.y / snapGrid[1]) : pointerPos.y,
      ...pointerPos
    };
  }, []);
  (0, import_react2.useEffect)(() => {
    if (nodeRef == null ? void 0 : nodeRef.current) {
      const selection2 = select_default2(nodeRef.current);
      if (disabled) {
        selection2.on(".drag", null);
      } else {
        const dragHandler = drag_default().on("start", (event) => {
          var _a;
          const { nodeInternals, multiSelectionActive, unselectNodesAndEdges, onNodeDragStart, onSelectionDragStart } = store.getState();
          const onStart = nodeId ? onNodeDragStart : wrapSelectionDragFunc(onSelectionDragStart);
          if (!selectNodesOnDrag && !multiSelectionActive && nodeId) {
            if (!((_a = nodeInternals.get(nodeId)) == null ? void 0 : _a.selected)) {
              unselectNodesAndEdges();
            }
          }
          if (nodeId && isSelectable && selectNodesOnDrag) {
            handleNodeClick({
              id: nodeId,
              store
            });
          }
          const pointerPos = getPointerPosition(event);
          lastPos.current = pointerPos;
          dragItems.current = getDragItems(nodeInternals, pointerPos, nodeId);
          if (onStart && dragItems.current) {
            const [currentNode, nodes] = getEventHandlerParams({
              nodeId,
              dragItems: dragItems.current,
              nodeInternals
            });
            onStart(event.sourceEvent, currentNode, nodes);
          }
        }).on("drag", (event) => {
          const { updateNodePositions, nodeInternals, nodeExtent, onNodeDrag, onSelectionDrag, snapGrid, snapToGrid } = store.getState();
          const pointerPos = getPointerPosition(event);
          if ((lastPos.current.x !== pointerPos.xSnapped || lastPos.current.y !== pointerPos.ySnapped) && dragItems.current) {
            lastPos.current = {
              x: pointerPos.xSnapped,
              y: pointerPos.ySnapped
            };
            dragItems.current = dragItems.current.map((n) => {
              const nextPosition = { x: pointerPos.x - n.distance.x, y: pointerPos.y - n.distance.y };
              if (snapToGrid) {
                nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
                nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
              }
              const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent);
              n.position = updatedPos.position;
              n.positionAbsolute = updatedPos.positionAbsolute;
              return n;
            });
            const onDrag = nodeId ? onNodeDrag : wrapSelectionDragFunc(onSelectionDrag);
            updateNodePositions(dragItems.current, true, true);
            setDragging(true);
            if (onDrag) {
              const [currentNode, nodes] = getEventHandlerParams({
                nodeId,
                dragItems: dragItems.current,
                nodeInternals
              });
              onDrag(event.sourceEvent, currentNode, nodes);
            }
          }
        }).on("end", (event) => {
          setDragging(false);
          if (dragItems.current) {
            const { updateNodePositions, nodeInternals, onNodeDragStop, onSelectionDragStop } = store.getState();
            const onStop = nodeId ? onNodeDragStop : wrapSelectionDragFunc(onSelectionDragStop);
            updateNodePositions(dragItems.current, false, false);
            if (onStop) {
              const [currentNode, nodes] = getEventHandlerParams({
                nodeId,
                dragItems: dragItems.current,
                nodeInternals
              });
              onStop(event.sourceEvent, currentNode, nodes);
            }
          }
        }).filter((event) => {
          const target = event.target;
          const isDraggable = !event.button && (!noDragClassName || !hasSelector(target, `.${noDragClassName}`, nodeRef)) && (!handleSelector || hasSelector(target, handleSelector, nodeRef));
          return isDraggable;
        });
        selection2.call(dragHandler);
        return () => {
          selection2.on(".drag", null);
        };
      }
    }
  }, [
    nodeRef,
    disabled,
    noDragClassName,
    handleSelector,
    isSelectable,
    store,
    nodeId,
    selectNodesOnDrag,
    getPointerPosition
  ]);
  return dragging;
}
function useUpdateNodePositions() {
  const store = useStoreApi();
  const updatePositions = (0, import_react2.useCallback)((positionDiff) => {
    const { nodeInternals, nodeExtent, updateNodePositions, snapToGrid, snapGrid } = store.getState();
    const selectedNodes = Array.from(nodeInternals.values()).filter((n) => n.selected);
    const nodeUpdates = selectedNodes.map((n) => {
      if (n.positionAbsolute) {
        const nextPosition = { x: n.positionAbsolute.x + positionDiff.x, y: n.positionAbsolute.y + positionDiff.y };
        if (snapToGrid) {
          nextPosition.x = snapGrid[0] * Math.round(nextPosition.x / snapGrid[0]);
          nextPosition.y = snapGrid[1] * Math.round(nextPosition.y / snapGrid[1]);
        }
        const updatedPos = calcNextPosition(n, nextPosition, nodeInternals, nodeExtent);
        n.position = updatedPos.position;
        n.positionAbsolute = updatedPos.positionAbsolute;
      }
      return n;
    });
    updateNodePositions(nodeUpdates, true, true);
  }, []);
  return updatePositions;
}
var arrowKeyDiffs = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
var wrapNode = (NodeComponent) => {
  const NodeWrapper = ({ id: id2, type, data, xPos, yPos, xPosOrigin, yPosOrigin, selected, onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onDoubleClick, style: style2, className, isDraggable, isSelectable, isConnectable, isFocusable, selectNodesOnDrag, sourcePosition, targetPosition, hidden, resizeObserver, dragHandle, zIndex, isParent, noDragClassName, noPanClassName, initialized, disableKeyboardA11y, ariaLabel, rfId }) => {
    const store = useStoreApi();
    const nodeRef = (0, import_react2.useRef)(null);
    const prevSourcePosition = (0, import_react2.useRef)(sourcePosition);
    const prevTargetPosition = (0, import_react2.useRef)(targetPosition);
    const prevType = (0, import_react2.useRef)(type);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const updatePositions = useUpdateNodePositions();
    const onMouseEnterHandler = getMouseHandler(id2, store.getState, onMouseEnter);
    const onMouseMoveHandler = getMouseHandler(id2, store.getState, onMouseMove);
    const onMouseLeaveHandler = getMouseHandler(id2, store.getState, onMouseLeave);
    const onContextMenuHandler = getMouseHandler(id2, store.getState, onContextMenu);
    const onDoubleClickHandler = getMouseHandler(id2, store.getState, onDoubleClick);
    const onSelectNodeHandler = (event) => {
      if (isSelectable && (!selectNodesOnDrag || !isDraggable)) {
        handleNodeClick({
          id: id2,
          store
        });
      }
      if (onClick) {
        const node = store.getState().nodeInternals.get(id2);
        onClick(event, { ...node });
      }
    };
    const onKeyDown = (event) => {
      var _a;
      const { snapGrid, snapToGrid } = store.getState();
      if (elementSelectionKeys.includes(event.key) && isSelectable) {
        const unselect = event.key === "Escape";
        if (unselect) {
          (_a = nodeRef.current) == null ? void 0 : _a.blur();
        }
        handleNodeClick({
          id: id2,
          store,
          unselect
        });
      } else if (!disableKeyboardA11y && isDraggable && selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
        store.setState({
          ariaLiveMessage: `Moved selected node ${event.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}`
        });
        const xVelo = snapToGrid ? snapGrid[0] : 5;
        const yVelo = snapToGrid ? snapGrid[1] : 5;
        const factor = event.shiftKey ? 4 : 1;
        updatePositions({
          x: arrowKeyDiffs[event.key].x * xVelo * factor,
          y: arrowKeyDiffs[event.key].y * yVelo * factor
        });
      }
    };
    (0, import_react2.useEffect)(() => {
      if (nodeRef.current && !hidden) {
        const currNode = nodeRef.current;
        resizeObserver == null ? void 0 : resizeObserver.observe(currNode);
        return () => resizeObserver == null ? void 0 : resizeObserver.unobserve(currNode);
      }
    }, [hidden]);
    (0, import_react2.useEffect)(() => {
      const typeChanged = prevType.current !== type;
      const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== targetPosition;
      if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
        if (typeChanged) {
          prevType.current = type;
        }
        if (sourcePosChanged) {
          prevSourcePosition.current = sourcePosition;
        }
        if (targetPosChanged) {
          prevTargetPosition.current = targetPosition;
        }
        store.getState().updateNodeDimensions([{ id: id2, nodeElement: nodeRef.current, forceUpdate: true }]);
      }
    }, [id2, type, sourcePosition, targetPosition]);
    const dragging = useDrag({
      nodeRef,
      disabled: hidden || !isDraggable,
      noDragClassName,
      handleSelector: dragHandle,
      nodeId: id2,
      isSelectable,
      selectNodesOnDrag
    });
    if (hidden) {
      return null;
    }
    return (0, import_jsx_runtime.jsx)("div", { className: cc([
      "react-flow__node",
      `react-flow__node-${type}`,
      {
        [noPanClassName]: isDraggable
      },
      className,
      {
        selected,
        selectable: isSelectable,
        parent: isParent,
        dragging
      }
    ]), ref: nodeRef, style: {
      zIndex,
      transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
      pointerEvents: hasPointerEvents ? "all" : "none",
      visibility: initialized ? "visible" : "hidden",
      ...style2
    }, "data-id": id2, "data-testid": `rf__node-${id2}`, onMouseEnter: onMouseEnterHandler, onMouseMove: onMouseMoveHandler, onMouseLeave: onMouseLeaveHandler, onContextMenu: onContextMenuHandler, onClick: onSelectNodeHandler, onDoubleClick: onDoubleClickHandler, onKeyDown: isFocusable ? onKeyDown : void 0, tabIndex: isFocusable ? 0 : void 0, role: isFocusable ? "button" : void 0, "aria-describedby": disableKeyboardA11y ? void 0 : `${ARIA_NODE_DESC_KEY}-${rfId}`, "aria-label": ariaLabel, children: (0, import_jsx_runtime.jsx)(Provider, { value: id2, children: (0, import_jsx_runtime.jsx)(NodeComponent, { id: id2, data, type, xPos, yPos, selected, isConnectable, sourcePosition, targetPosition, dragging, dragHandle, zIndex }) }) });
  };
  NodeWrapper.displayName = "NodeWrapper";
  return (0, import_react2.memo)(NodeWrapper);
};
function createNodeTypes(nodeTypes) {
  const standardTypes = {
    input: wrapNode(nodeTypes.input || InputNode$1),
    default: wrapNode(nodeTypes.default || DefaultNode$1),
    output: wrapNode(nodeTypes.output || OutputNode$1),
    group: wrapNode(nodeTypes.group || GroupNode)
  };
  const wrappedTypes = {};
  const specialTypes = Object.keys(nodeTypes).filter((k) => !["input", "default", "output", "group"].includes(k)).reduce((res, key) => {
    res[key] = wrapNode(nodeTypes[key] || DefaultNode$1);
    return res;
  }, wrappedTypes);
  return {
    ...standardTypes,
    ...specialTypes
  };
}
var getPositionWithOrigin = ({ x, y, width, height, origin }) => {
  if (!width || !height) {
    return { x, y };
  }
  if (origin[0] < 0 || origin[1] < 0 || origin[0] > 1 || origin[1] > 1) {
    devWarn("nodeOrigin must be between 0 and 1");
    return { x, y };
  }
  return {
    x: x - width * origin[0],
    y: y - height * origin[1]
  };
};
var doc = typeof document !== "undefined" ? document : null;
var useKeyPress = (keyCode = null, options = { target: doc }) => {
  const [keyPressed, setKeyPressed] = (0, import_react2.useState)(false);
  const pressedKeys = (0, import_react2.useRef)(/* @__PURE__ */ new Set([]));
  const [keyCodes, keysToWatch] = (0, import_react2.useMemo)(() => {
    if (keyCode !== null) {
      const keyCodeArr = Array.isArray(keyCode) ? keyCode : [keyCode];
      const keys = keyCodeArr.filter((kc) => typeof kc === "string").map((kc) => kc.split("+"));
      const keysFlat = keys.reduce((res, item) => res.concat(...item), []);
      return [keys, keysFlat];
    }
    return [[], []];
  }, [keyCode]);
  (0, import_react2.useEffect)(() => {
    var _a, _b;
    if (keyCode !== null) {
      const downHandler = (event) => {
        if (isInputDOMNode(event)) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        pressedKeys.current.add(event[keyOrCode]);
        if (isMatchingKey(keyCodes, pressedKeys.current, false)) {
          event.preventDefault();
          setKeyPressed(true);
        }
      };
      const upHandler = (event) => {
        if (isInputDOMNode(event)) {
          return false;
        }
        const keyOrCode = useKeyOrCode(event.code, keysToWatch);
        if (isMatchingKey(keyCodes, pressedKeys.current, true)) {
          setKeyPressed(false);
          pressedKeys.current.clear();
        } else {
          pressedKeys.current.delete(event[keyOrCode]);
        }
      };
      const resetHandler = () => {
        pressedKeys.current.clear();
        setKeyPressed(false);
      };
      (_a = options == null ? void 0 : options.target) == null ? void 0 : _a.addEventListener("keydown", downHandler);
      (_b = options == null ? void 0 : options.target) == null ? void 0 : _b.addEventListener("keyup", upHandler);
      window.addEventListener("blur", resetHandler);
      return () => {
        var _a2, _b2;
        (_a2 = options == null ? void 0 : options.target) == null ? void 0 : _a2.removeEventListener("keydown", downHandler);
        (_b2 = options == null ? void 0 : options.target) == null ? void 0 : _b2.removeEventListener("keyup", upHandler);
        window.removeEventListener("blur", resetHandler);
      };
    }
  }, [keyCode, setKeyPressed]);
  return keyPressed;
};
function isMatchingKey(keyCodes, pressedKeys, isUp) {
  return keyCodes.filter((keys) => isUp || keys.length === pressedKeys.size).some((keys) => keys.every((k) => pressedKeys.has(k)));
}
function useKeyOrCode(eventCode, keysToWatch) {
  return keysToWatch.includes(eventCode) ? "code" : "key";
}
function isInputDOMNode(event) {
  var _a;
  const target = ((_a = event.composedPath) == null ? void 0 : _a.call(event)[0]) || event.target;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(target == null ? void 0 : target.nodeName) || (target == null ? void 0 : target.hasAttribute("contenteditable")) || !!(target == null ? void 0 : target.closest(".nokey"));
}
function calculateXYZPosition(node, nodeInternals, parentNodes, result) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  if (!node.parentNode) {
    return result;
  }
  const parentNode = nodeInternals.get(node.parentNode);
  return calculateXYZPosition(parentNode, nodeInternals, parentNodes, {
    x: ((_a = result.x) != null ? _a : 0) + ((_c = (_b = parentNode.position) == null ? void 0 : _b.x) != null ? _c : 0),
    y: ((_d = result.y) != null ? _d : 0) + ((_f = (_e = parentNode.position) == null ? void 0 : _e.y) != null ? _f : 0),
    z: ((_h = (_g = parentNode[internalsSymbol]) == null ? void 0 : _g.z) != null ? _h : 0) > ((_i = result.z) != null ? _i : 0) ? (_k = (_j = parentNode[internalsSymbol]) == null ? void 0 : _j.z) != null ? _k : 0 : (_l = result.z) != null ? _l : 0
  });
}
function createNodeInternals(nodes, nodeInternals) {
  const nextNodeInternals = /* @__PURE__ */ new Map();
  const parentNodes = {};
  nodes.forEach((node) => {
    var _a;
    const z = (isNumeric(node.zIndex) ? node.zIndex : 0) + (node.selected ? 1e3 : 0);
    const currInternals = nodeInternals.get(node.id);
    const internals = {
      width: currInternals == null ? void 0 : currInternals.width,
      height: currInternals == null ? void 0 : currInternals.height,
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y
      }
    };
    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }
    Object.defineProperty(internals, internalsSymbol, {
      enumerable: false,
      value: {
        handleBounds: (_a = currInternals == null ? void 0 : currInternals[internalsSymbol]) == null ? void 0 : _a.handleBounds,
        z
      }
    });
    nextNodeInternals.set(node.id, internals);
  });
  nextNodeInternals.forEach((node) => {
    var _a, _b;
    if (node.parentNode && !nextNodeInternals.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }
    if (node.parentNode || parentNodes[node.id]) {
      const { x, y, z } = calculateXYZPosition(node, nextNodeInternals, parentNodes, {
        ...node.position,
        z: (_b = (_a = node[internalsSymbol]) == null ? void 0 : _a.z) != null ? _b : 0
      });
      node.positionAbsolute = {
        x,
        y
      };
      node[internalsSymbol].z = z;
      if (parentNodes[node.id]) {
        node[internalsSymbol].isParent = true;
      }
    }
  });
  return nextNodeInternals;
}
function fitView(get3, options = {}) {
  var _a, _b, _c;
  const { nodeInternals, width, height, minZoom, maxZoom, d3Zoom, d3Selection, fitViewOnInitDone, fitViewOnInit, nodeOrigin } = get3();
  if (options.initial && !fitViewOnInitDone && fitViewOnInit || !options.initial) {
    if (d3Zoom && d3Selection) {
      const nodes = Array.from(nodeInternals.values()).filter((n) => options.includeHiddenNodes ? n.width && n.height : !n.hidden);
      const nodesInitialized = nodes.every((n) => n.width && n.height);
      if (nodes.length > 0 && nodesInitialized) {
        const bounds = getRectOfNodes(nodes, nodeOrigin);
        const [x, y, zoom] = getTransformForBounds(bounds, width, height, (_a = options.minZoom) != null ? _a : minZoom, (_b = options.maxZoom) != null ? _b : maxZoom, (_c = options.padding) != null ? _c : 0.1);
        const nextTransform = identity2.translate(x, y).scale(zoom);
        if (typeof options.duration === "number" && options.duration > 0) {
          d3Zoom.transform(getD3Transition(d3Selection, options.duration), nextTransform);
        } else {
          d3Zoom.transform(d3Selection, nextTransform);
        }
        return true;
      }
    }
  }
  return false;
}
function handleControlledNodeSelectionChange(nodeChanges, nodeInternals) {
  nodeChanges.forEach((change) => {
    const node = nodeInternals.get(change.id);
    if (node) {
      nodeInternals.set(node.id, {
        ...node,
        [internalsSymbol]: node[internalsSymbol],
        selected: change.selected
      });
    }
  });
  return new Map(nodeInternals);
}
function handleControlledEdgeSelectionChange(edgeChanges, edges) {
  return edges.map((e) => {
    const change = edgeChanges.find((change2) => change2.id === e.id);
    if (change) {
      e.selected = change.selected;
    }
    return e;
  });
}
function updateNodesAndEdgesSelections({ changedNodes, changedEdges, get: get3, set: set3 }) {
  const { nodeInternals, edges, onNodesChange, onEdgesChange, hasDefaultNodes, hasDefaultEdges } = get3();
  if (changedNodes == null ? void 0 : changedNodes.length) {
    if (hasDefaultNodes) {
      set3({ nodeInternals: handleControlledNodeSelectionChange(changedNodes, nodeInternals) });
    }
    onNodesChange == null ? void 0 : onNodesChange(changedNodes);
  }
  if (changedEdges == null ? void 0 : changedEdges.length) {
    if (hasDefaultEdges) {
      set3({ edges: handleControlledEdgeSelectionChange(changedEdges, edges) });
    }
    onEdgesChange == null ? void 0 : onEdgesChange(changedEdges);
  }
}
var noop2 = () => {
};
var initialViewportHelper = {
  zoomIn: noop2,
  zoomOut: noop2,
  zoomTo: noop2,
  getZoom: () => 1,
  setViewport: noop2,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  fitView: noop2,
  setCenter: noop2,
  fitBounds: noop2,
  project: (position) => position,
  viewportInitialized: false
};
var selector$a = (s) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection
});
var useViewportHelper = () => {
  const store = useStoreApi();
  const { d3Zoom, d3Selection } = useStore2(selector$a, shallow);
  const viewportHelperFunctions = (0, import_react2.useMemo)(() => {
    if (d3Selection && d3Zoom) {
      return {
        zoomIn: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options == null ? void 0 : options.duration), 1.2),
        zoomOut: (options) => d3Zoom.scaleBy(getD3Transition(d3Selection, options == null ? void 0 : options.duration), 1 / 1.2),
        zoomTo: (zoomLevel, options) => d3Zoom.scaleTo(getD3Transition(d3Selection, options == null ? void 0 : options.duration), zoomLevel),
        getZoom: () => store.getState().transform[2],
        setViewport: (transform2, options) => {
          var _a, _b, _c;
          const [x, y, zoom] = store.getState().transform;
          const nextTransform = identity2.translate((_a = transform2.x) != null ? _a : x, (_b = transform2.y) != null ? _b : y).scale((_c = transform2.zoom) != null ? _c : zoom);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), nextTransform);
        },
        getViewport: () => {
          const [x, y, zoom] = store.getState().transform;
          return { x, y, zoom };
        },
        fitView: (options) => fitView(store.getState, options),
        setCenter: (x, y, options) => {
          const { width, height, maxZoom } = store.getState();
          const nextZoom = typeof (options == null ? void 0 : options.zoom) !== "undefined" ? options.zoom : maxZoom;
          const centerX = width / 2 - x * nextZoom;
          const centerY = height / 2 - y * nextZoom;
          const transform2 = identity2.translate(centerX, centerY).scale(nextZoom);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), transform2);
        },
        fitBounds: (bounds, options) => {
          var _a;
          const { width, height, minZoom, maxZoom } = store.getState();
          const [x, y, zoom] = getTransformForBounds(bounds, width, height, minZoom, maxZoom, (_a = options == null ? void 0 : options.padding) != null ? _a : 0.1);
          const transform2 = identity2.translate(x, y).scale(zoom);
          d3Zoom.transform(getD3Transition(d3Selection, options == null ? void 0 : options.duration), transform2);
        },
        project: (position) => {
          const { transform: transform2, snapToGrid, snapGrid } = store.getState();
          return pointToRendererPoint(position, transform2, snapToGrid, snapGrid);
        },
        viewportInitialized: true
      };
    }
    return initialViewportHelper;
  }, [d3Zoom, d3Selection]);
  return viewportHelperFunctions;
};
function useReactFlow() {
  const viewportHelper = useViewportHelper();
  const store = useStoreApi();
  const getNodes = (0, import_react2.useCallback)(() => {
    const { nodeInternals } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    return nodes.map((n) => ({ ...n }));
  }, []);
  const getNode = (0, import_react2.useCallback)((id2) => {
    const { nodeInternals } = store.getState();
    return nodeInternals.get(id2);
  }, []);
  const getEdges = (0, import_react2.useCallback)(() => {
    const { edges = [] } = store.getState();
    return edges.map((e) => ({ ...e }));
  }, []);
  const getEdge = (0, import_react2.useCallback)((id2) => {
    const { edges = [] } = store.getState();
    return edges.find((e) => e.id === id2);
  }, []);
  const setNodes = (0, import_react2.useCallback)((payload) => {
    const { nodeInternals, setNodes: setNodes2, hasDefaultNodes, onNodesChange } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nextNodes = typeof payload === "function" ? payload(nodes) : payload;
    if (hasDefaultNodes) {
      setNodes2(nextNodes);
    } else if (onNodesChange) {
      const changes = nextNodes.length === 0 ? nodes.map((node) => ({ type: "remove", id: node.id })) : nextNodes.map((node) => ({ item: node, type: "reset" }));
      onNodesChange(changes);
    }
  }, []);
  const setEdges = (0, import_react2.useCallback)((payload) => {
    const { edges = [], setEdges: setEdges2, hasDefaultEdges, onEdgesChange } = store.getState();
    const nextEdges = typeof payload === "function" ? payload(edges) : payload;
    if (hasDefaultEdges) {
      setEdges2(nextEdges);
    } else if (onEdgesChange) {
      const changes = nextEdges.length === 0 ? edges.map((edge) => ({ type: "remove", id: edge.id })) : nextEdges.map((edge) => ({ item: edge, type: "reset" }));
      onEdgesChange(changes);
    }
  }, []);
  const addNodes = (0, import_react2.useCallback)((payload) => {
    const nodes = Array.isArray(payload) ? payload : [payload];
    const { nodeInternals, setNodes: setNodes2, hasDefaultNodes, onNodesChange } = store.getState();
    if (hasDefaultNodes) {
      const currentNodes = Array.from(nodeInternals.values());
      const nextNodes = [...currentNodes, ...nodes];
      setNodes2(nextNodes);
    } else if (onNodesChange) {
      const changes = nodes.map((node) => ({ item: node, type: "add" }));
      onNodesChange(changes);
    }
  }, []);
  const addEdges = (0, import_react2.useCallback)((payload) => {
    const nextEdges = Array.isArray(payload) ? payload : [payload];
    const { edges = [], setEdges: setEdges2, hasDefaultEdges, onEdgesChange } = store.getState();
    if (hasDefaultEdges) {
      setEdges2([...edges, ...nextEdges]);
    } else if (onEdgesChange) {
      const changes = nextEdges.map((edge) => ({ item: edge, type: "add" }));
      onEdgesChange(changes);
    }
  }, []);
  const toObject = (0, import_react2.useCallback)(() => {
    const { nodeInternals, edges = [], transform: transform2 } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const [x, y, zoom] = transform2;
    return {
      nodes: nodes.map((n) => ({ ...n })),
      edges: edges.map((e) => ({ ...e })),
      viewport: {
        x,
        y,
        zoom
      }
    };
  }, []);
  const deleteElements = (0, import_react2.useCallback)(({ nodes: nodesDeleted, edges: edgesDeleted }) => {
    const { nodeInternals, edges, hasDefaultNodes, hasDefaultEdges, onNodesDelete, onEdgesDelete, onNodesChange, onEdgesChange } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const nodeIds = (nodesDeleted || []).map((node) => node.id);
    const edgeIds = (edgesDeleted || []).map((edge) => edge.id);
    const nodesToRemove = nodes.reduce((res, node) => {
      const parentHit = !nodeIds.includes(node.id) && node.parentNode && res.find((n) => n.id === node.parentNode);
      const deletable = typeof node.deletable === "boolean" ? node.deletable : true;
      if (deletable && (nodeIds.includes(node.id) || parentHit)) {
        res.push(node);
      }
      return res;
    }, []);
    const deletableEdges = edges.filter((e) => typeof e.deletable === "boolean" ? e.deletable : true);
    const initialHitEdges = deletableEdges.filter((e) => edgeIds.includes(e.id));
    if (nodesToRemove || initialHitEdges) {
      const connectedEdges = getConnectedEdges(nodesToRemove, deletableEdges);
      const edgesToRemove = [...initialHitEdges, ...connectedEdges];
      const edgeIdsToRemove = edgesToRemove.reduce((res, edge) => {
        if (!res.includes(edge.id)) {
          res.push(edge.id);
        }
        return res;
      }, []);
      if (hasDefaultEdges || hasDefaultNodes) {
        if (hasDefaultEdges) {
          store.setState({
            edges: edges.filter((e) => !edgeIdsToRemove.includes(e.id))
          });
        }
        if (hasDefaultNodes) {
          nodesToRemove.forEach((node) => {
            nodeInternals.delete(node.id);
          });
          store.setState({
            nodeInternals: new Map(nodeInternals)
          });
        }
      }
      if (edgeIdsToRemove.length > 0) {
        onEdgesDelete == null ? void 0 : onEdgesDelete(edgesToRemove);
        if (onEdgesChange) {
          onEdgesChange(edgeIdsToRemove.map((id2) => ({
            id: id2,
            type: "remove"
          })));
        }
      }
      if (nodesToRemove.length > 0) {
        onNodesDelete == null ? void 0 : onNodesDelete(nodesToRemove);
        if (onNodesChange) {
          const nodeChanges = nodesToRemove.map((n) => ({ id: n.id, type: "remove" }));
          onNodesChange(nodeChanges);
        }
      }
    }
  }, []);
  const getNodeRect = (0, import_react2.useCallback)((nodeOrRect) => {
    const isRect = isRectObject(nodeOrRect);
    const node = isRect ? null : store.getState().nodeInternals.get(nodeOrRect.id);
    const nodeRect = isRect ? nodeOrRect : nodeToRect(node);
    return [nodeRect, node, isRect];
  }, []);
  const getIntersectingNodes = (0, import_react2.useCallback)((nodeOrRect, partially = true, nodes) => {
    const [nodeRect, node, isRect] = getNodeRect(nodeOrRect);
    if (!nodeRect) {
      return [];
    }
    return (nodes || Array.from(store.getState().nodeInternals.values())).filter((n) => {
      if (!isRect && (n.id === node.id || !n.positionAbsolute)) {
        return false;
      }
      const currNodeRect = nodeToRect(n);
      const overlappingArea = getOverlappingArea(currNodeRect, nodeRect);
      const partiallyVisible = partially && overlappingArea > 0;
      return partiallyVisible || overlappingArea >= nodeOrRect.width * nodeOrRect.height;
    });
  }, []);
  const isNodeIntersecting = (0, import_react2.useCallback)((nodeOrRect, area, partially = true) => {
    const [nodeRect] = getNodeRect(nodeOrRect);
    if (!nodeRect) {
      return false;
    }
    const overlappingArea = getOverlappingArea(nodeRect, area);
    const partiallyVisible = partially && overlappingArea > 0;
    return partiallyVisible || overlappingArea >= nodeOrRect.width * nodeOrRect.height;
  }, []);
  return (0, import_react2.useMemo)(() => {
    return {
      ...viewportHelper,
      getNodes,
      getNode,
      getEdges,
      getEdge,
      setNodes,
      setEdges,
      addNodes,
      addEdges,
      toObject,
      deleteElements,
      getIntersectingNodes,
      isNodeIntersecting
    };
  }, [
    viewportHelper,
    getNodes,
    getNode,
    getEdges,
    getEdge,
    setNodes,
    setEdges,
    addNodes,
    addEdges,
    toObject,
    deleteElements,
    getIntersectingNodes,
    isNodeIntersecting
  ]);
}
var useGlobalKeyHandler = ({ deleteKeyCode, multiSelectionKeyCode }) => {
  const store = useStoreApi();
  const { deleteElements } = useReactFlow();
  const deleteKeyPressed = useKeyPress(deleteKeyCode);
  const multiSelectionKeyPressed = useKeyPress(multiSelectionKeyCode);
  (0, import_react2.useEffect)(() => {
    if (deleteKeyPressed) {
      const { nodeInternals, edges } = store.getState();
      const nodes = Array.from(nodeInternals.values());
      const selectedNodes = nodes.filter((node) => node.selected);
      const selectedEdges = edges.filter((edge) => edge.selected);
      deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      store.setState({ nodesSelectionActive: false });
    }
  }, [deleteKeyPressed]);
  (0, import_react2.useEffect)(() => {
    store.setState({ multiSelectionActive: multiSelectionKeyPressed });
  }, [multiSelectionKeyPressed]);
};
function useResizeHandler(rendererNode) {
  const store = useStoreApi();
  (0, import_react2.useEffect)(() => {
    let resizeObserver;
    const updateDimensions = () => {
      if (!rendererNode.current) {
        return;
      }
      const size = getDimensions(rendererNode.current);
      if (size.height === 0 || size.width === 0) {
        devWarn("The React Flow parent container needs a width and a height to render the graph. Help: https://reactflow.dev/error#400");
      }
      store.setState({ width: size.width || 500, height: size.height || 500 });
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    if (rendererNode.current) {
      resizeObserver = new ResizeObserver(() => updateDimensions());
      resizeObserver.observe(rendererNode.current);
    }
    return () => {
      window.removeEventListener("resize", updateDimensions);
      if (resizeObserver && rendererNode.current) {
        resizeObserver.unobserve(rendererNode.current);
      }
    };
  }, []);
}
var containerStyle = {
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0
};
var viewChanged = (prevViewport, eventViewport) => prevViewport.x !== eventViewport.x || prevViewport.y !== eventViewport.y || prevViewport.zoom !== eventViewport.k;
var eventToFlowTransform = (eventViewport) => ({
  x: eventViewport.x,
  y: eventViewport.y,
  zoom: eventViewport.k
});
var isWrappedWithClass = (event, className) => event.target.closest(`.${className}`);
var selector$9 = (s) => ({
  d3Zoom: s.d3Zoom,
  d3Selection: s.d3Selection,
  d3ZoomHandler: s.d3ZoomHandler
});
var ZoomPane = ({ onMove, onMoveStart, onMoveEnd, zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, selectionKeyPressed, elementsSelectable, panOnDrag = true, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling = true, children: children2, noWheelClassName, noPanClassName }) => {
  const timerId = (0, import_react2.useRef)();
  const store = useStoreApi();
  const isZoomingOrPanning = (0, import_react2.useRef)(false);
  const zoomPane = (0, import_react2.useRef)(null);
  const prevTransform = (0, import_react2.useRef)({ x: 0, y: 0, zoom: 0 });
  const { d3Zoom, d3Selection, d3ZoomHandler } = useStore2(selector$9, shallow);
  const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
  useResizeHandler(zoomPane);
  (0, import_react2.useEffect)(() => {
    if (zoomPane.current) {
      const d3ZoomInstance = zoom_default2().scaleExtent([minZoom, maxZoom]).translateExtent(translateExtent);
      const selection2 = select_default2(zoomPane.current).call(d3ZoomInstance);
      const clampedX = clamp(defaultViewport.x, translateExtent[0][0], translateExtent[1][0]);
      const clampedY = clamp(defaultViewport.y, translateExtent[0][1], translateExtent[1][1]);
      const clampedZoom = clamp(defaultViewport.zoom, minZoom, maxZoom);
      const updatedTransform = identity2.translate(clampedX, clampedY).scale(clampedZoom);
      d3ZoomInstance.transform(selection2, updatedTransform);
      store.setState({
        d3Zoom: d3ZoomInstance,
        d3Selection: selection2,
        d3ZoomHandler: selection2.on("wheel.zoom"),
        transform: [clampedX, clampedY, clampedZoom],
        domNode: zoomPane.current.closest(".react-flow")
      });
    }
  }, []);
  (0, import_react2.useEffect)(() => {
    if (d3Selection && d3Zoom) {
      if (panOnScroll && !zoomActivationKeyPressed) {
        d3Selection.on("wheel.zoom", (event) => {
          if (isWrappedWithClass(event, noWheelClassName)) {
            return false;
          }
          event.preventDefault();
          event.stopImmediatePropagation();
          const currentZoom = d3Selection.property("__zoom").k || 1;
          if (event.ctrlKey && zoomOnPinch) {
            const point = pointer_default(event);
            const pinchDelta = -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 2e-3) * 10;
            const zoom = currentZoom * Math.pow(2, pinchDelta);
            d3Zoom.scaleTo(d3Selection, zoom, point);
            return;
          }
          const deltaNormalize = event.deltaMode === 1 ? 20 : 1;
          const deltaX = panOnScrollMode === PanOnScrollMode.Vertical ? 0 : event.deltaX * deltaNormalize;
          const deltaY = panOnScrollMode === PanOnScrollMode.Horizontal ? 0 : event.deltaY * deltaNormalize;
          d3Zoom.translateBy(d3Selection, -(deltaX / currentZoom) * panOnScrollSpeed, -(deltaY / currentZoom) * panOnScrollSpeed);
        });
      } else if (typeof d3ZoomHandler !== "undefined") {
        d3Selection.on("wheel.zoom", function(event, d) {
          if (!preventScrolling || isWrappedWithClass(event, noWheelClassName)) {
            return null;
          }
          event.preventDefault();
          d3ZoomHandler.call(this, event, d);
        });
      }
    }
  }, [
    panOnScroll,
    panOnScrollMode,
    d3Selection,
    d3Zoom,
    d3ZoomHandler,
    zoomActivationKeyPressed,
    zoomOnPinch,
    preventScrolling,
    noWheelClassName
  ]);
  (0, import_react2.useEffect)(() => {
    if (d3Zoom) {
      if (selectionKeyPressed && !isZoomingOrPanning.current) {
        d3Zoom.on("zoom", null);
      } else if (!selectionKeyPressed) {
        d3Zoom.on("zoom", (event) => {
          const { onViewportChange } = store.getState();
          store.setState({ transform: [event.transform.x, event.transform.y, event.transform.k] });
          if (onMove || onViewportChange) {
            const flowTransform = eventToFlowTransform(event.transform);
            onViewportChange == null ? void 0 : onViewportChange(flowTransform);
            onMove == null ? void 0 : onMove(event.sourceEvent, flowTransform);
          }
        });
      }
    }
  }, [selectionKeyPressed, d3Zoom, onMove]);
  (0, import_react2.useEffect)(() => {
    if (d3Zoom) {
      d3Zoom.on("start", (event) => {
        var _a;
        if (!event.sourceEvent) {
          return null;
        }
        const { onViewportChangeStart } = store.getState();
        isZoomingOrPanning.current = true;
        if (((_a = event.sourceEvent) == null ? void 0 : _a.type) === "mousedown") {
          store.setState({ paneDragging: true });
        }
        if (onMoveStart || onViewportChangeStart) {
          const flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;
          onViewportChangeStart == null ? void 0 : onViewportChangeStart(flowTransform);
          onMoveStart == null ? void 0 : onMoveStart(event.sourceEvent, flowTransform);
        }
      });
    }
  }, [d3Zoom, onMoveStart]);
  (0, import_react2.useEffect)(() => {
    if (d3Zoom) {
      d3Zoom.on("end", (event) => {
        if (!event.sourceEvent) {
          return null;
        }
        const { onViewportChangeEnd } = store.getState();
        isZoomingOrPanning.current = false;
        store.setState({ paneDragging: false });
        if ((onMoveEnd || onViewportChangeEnd) && viewChanged(prevTransform.current, event.transform)) {
          const flowTransform = eventToFlowTransform(event.transform);
          prevTransform.current = flowTransform;
          clearTimeout(timerId.current);
          timerId.current = setTimeout(() => {
            onViewportChangeEnd == null ? void 0 : onViewportChangeEnd(flowTransform);
            onMoveEnd == null ? void 0 : onMoveEnd(event.sourceEvent, flowTransform);
          }, panOnScroll ? 150 : 0);
        }
      });
    }
  }, [d3Zoom, onMoveEnd, panOnScroll]);
  (0, import_react2.useEffect)(() => {
    if (d3Zoom) {
      d3Zoom.filter((event) => {
        const zoomScroll = zoomActivationKeyPressed || zoomOnScroll;
        const pinchZoom = zoomOnPinch && event.ctrlKey;
        if (event.button === 1 && event.type === "mousedown" && event.target.closest(`.react-flow__node`)) {
          return true;
        }
        if (!panOnDrag && !zoomScroll && !panOnScroll && !zoomOnDoubleClick && !zoomOnPinch) {
          return false;
        }
        if (selectionKeyPressed) {
          return false;
        }
        if (!zoomOnDoubleClick && event.type === "dblclick") {
          return false;
        }
        if (isWrappedWithClass(event, noWheelClassName) && event.type === "wheel") {
          return false;
        }
        if (isWrappedWithClass(event, noPanClassName) && event.type !== "wheel") {
          return false;
        }
        if (!zoomOnPinch && event.ctrlKey && event.type === "wheel") {
          return false;
        }
        if (!zoomScroll && !panOnScroll && !pinchZoom && event.type === "wheel") {
          return false;
        }
        if (!panOnDrag && (event.type === "mousedown" || event.type === "touchstart")) {
          return false;
        }
        return (!event.ctrlKey || event.type === "wheel") && (!event.button || event.button <= 1);
      });
    }
  }, [
    d3Zoom,
    zoomOnScroll,
    zoomOnPinch,
    panOnScroll,
    zoomOnDoubleClick,
    panOnDrag,
    selectionKeyPressed,
    elementsSelectable,
    zoomActivationKeyPressed
  ]);
  return (0, import_jsx_runtime.jsx)("div", { className: "react-flow__renderer", ref: zoomPane, style: containerStyle, children: children2 });
};
function handleParentExpand(res, updateItem) {
  var _a, _b;
  const parent = res.find((e) => e.id === updateItem.parentNode);
  if (parent) {
    const extendWidth = updateItem.position.x + updateItem.width - parent.width;
    const extendHeight = updateItem.position.y + updateItem.height - parent.height;
    if (extendWidth > 0 || extendHeight > 0 || updateItem.position.x < 0 || updateItem.position.y < 0) {
      parent.style = { ...parent.style };
      parent.style.width = (_a = parent.style.width) != null ? _a : parent.width;
      parent.style.height = (_b = parent.style.height) != null ? _b : parent.height;
      if (extendWidth > 0) {
        parent.style.width += extendWidth;
      }
      if (extendHeight > 0) {
        parent.style.height += extendHeight;
      }
      if (updateItem.position.x < 0) {
        const xDiff = Math.abs(updateItem.position.x);
        parent.position.x = parent.position.x - xDiff;
        parent.style.width += xDiff;
        updateItem.position.x = 0;
      }
      if (updateItem.position.y < 0) {
        const yDiff = Math.abs(updateItem.position.y);
        parent.position.y = parent.position.y - yDiff;
        parent.style.height += yDiff;
        updateItem.position.y = 0;
      }
      parent.width = parent.style.width;
      parent.height = parent.style.height;
    }
  }
}
function applyChanges(changes, elements) {
  if (changes.some((c) => c.type === "reset")) {
    return changes.filter((c) => c.type === "reset").map((c) => c.item);
  }
  const initElements = changes.filter((c) => c.type === "add").map((c) => c.item);
  return elements.reduce((res, item) => {
    const currentChange = changes.find((c) => c.id === item.id);
    if (currentChange) {
      switch (currentChange.type) {
        case "select": {
          res.push({ ...item, selected: currentChange.selected });
          return res;
        }
        case "position": {
          const updateItem = { ...item };
          if (typeof currentChange.position !== "undefined") {
            updateItem.position = currentChange.position;
          }
          if (typeof currentChange.positionAbsolute !== "undefined") {
            updateItem.positionAbsolute = currentChange.positionAbsolute;
          }
          if (typeof currentChange.dragging !== "undefined") {
            updateItem.dragging = currentChange.dragging;
          }
          if (updateItem.expandParent) {
            handleParentExpand(res, updateItem);
          }
          res.push(updateItem);
          return res;
        }
        case "dimensions": {
          const updateItem = { ...item };
          if (typeof currentChange.dimensions !== "undefined") {
            updateItem.width = currentChange.dimensions.width;
            updateItem.height = currentChange.dimensions.height;
          }
          if (updateItem.expandParent) {
            handleParentExpand(res, updateItem);
          }
          res.push(updateItem);
          return res;
        }
        case "remove": {
          return res;
        }
      }
    }
    res.push(item);
    return res;
  }, initElements);
}
function applyNodeChanges(changes, nodes) {
  return applyChanges(changes, nodes);
}
function applyEdgeChanges(changes, edges) {
  return applyChanges(changes, edges);
}
var createSelectionChange = (id2, selected) => ({
  id: id2,
  type: "select",
  selected
});
function getSelectionChanges(items, selectedIds) {
  return items.reduce((res, item) => {
    const willBeSelected = selectedIds.includes(item.id);
    if (!item.selected && willBeSelected) {
      item.selected = true;
      res.push(createSelectionChange(item.id, true));
    } else if (item.selected && !willBeSelected) {
      item.selected = false;
      res.push(createSelectionChange(item.id, false));
    }
    return res;
  }, []);
}
function getMousePosition(event, containerBounds) {
  return {
    x: event.clientX - containerBounds.left,
    y: event.clientY - containerBounds.top
  };
}
var selector$8 = (s) => ({
  userSelectionActive: s.userSelectionActive,
  elementsSelectable: s.elementsSelectable
});
var initialRect = {
  startX: 0,
  startY: 0,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  draw: false
};
var UserSelection = (0, import_react2.memo)(({ selectionKeyPressed }) => {
  const store = useStoreApi();
  const prevSelectedNodesCount = (0, import_react2.useRef)(0);
  const prevSelectedEdgesCount = (0, import_react2.useRef)(0);
  const containerBounds = (0, import_react2.useRef)();
  const [userSelectionRect, setUserSelectionRect] = (0, import_react2.useState)(initialRect);
  const { userSelectionActive, elementsSelectable } = useStore2(selector$8, shallow);
  const renderUserSelectionPane = userSelectionActive || selectionKeyPressed;
  if (!elementsSelectable || !renderUserSelectionPane) {
    return null;
  }
  const resetUserSelection = () => {
    setUserSelectionRect(initialRect);
    store.setState({ userSelectionActive: false });
    prevSelectedNodesCount.current = 0;
    prevSelectedEdgesCount.current = 0;
  };
  const onMouseDown = (event) => {
    const reactFlowNode = event.target.closest(".react-flow");
    containerBounds.current = reactFlowNode.getBoundingClientRect();
    const mousePos = getMousePosition(event, containerBounds.current);
    setUserSelectionRect({
      width: 0,
      height: 0,
      startX: mousePos.x,
      startY: mousePos.y,
      x: mousePos.x,
      y: mousePos.y,
      draw: true
    });
    store.setState({ userSelectionActive: true, nodesSelectionActive: false });
  };
  const onMouseMove = (event) => {
    var _a, _b;
    if (!selectionKeyPressed || !userSelectionRect.draw || !containerBounds.current) {
      return;
    }
    const mousePos = getMousePosition(event, containerBounds.current);
    const startX = (_a = userSelectionRect.startX) != null ? _a : 0;
    const startY = (_b = userSelectionRect.startY) != null ? _b : 0;
    const nextUserSelectRect = {
      ...userSelectionRect,
      x: mousePos.x < startX ? mousePos.x : startX,
      y: mousePos.y < startY ? mousePos.y : startY,
      width: Math.abs(mousePos.x - startX),
      height: Math.abs(mousePos.y - startY)
    };
    const { nodeInternals, edges, transform: transform2, onNodesChange, onEdgesChange, nodeOrigin } = store.getState();
    const nodes = Array.from(nodeInternals.values());
    const selectedNodes = getNodesInside(nodeInternals, nextUserSelectRect, transform2, false, true, nodeOrigin);
    const selectedEdgeIds = getConnectedEdges(selectedNodes, edges).map((e) => e.id);
    const selectedNodeIds = selectedNodes.map((n) => n.id);
    if (prevSelectedNodesCount.current !== selectedNodeIds.length) {
      prevSelectedNodesCount.current = selectedNodeIds.length;
      const changes = getSelectionChanges(nodes, selectedNodeIds);
      if (changes.length) {
        onNodesChange == null ? void 0 : onNodesChange(changes);
      }
    }
    if (prevSelectedEdgesCount.current !== selectedEdgeIds.length) {
      prevSelectedEdgesCount.current = selectedEdgeIds.length;
      const changes = getSelectionChanges(edges, selectedEdgeIds);
      if (changes.length) {
        onEdgesChange == null ? void 0 : onEdgesChange(changes);
      }
    }
    setUserSelectionRect(nextUserSelectRect);
  };
  const onMouseUp = () => {
    store.setState({ nodesSelectionActive: prevSelectedNodesCount.current > 0 });
    resetUserSelection();
  };
  const onMouseLeave = () => {
    store.setState({ nodesSelectionActive: false });
    resetUserSelection();
  };
  return (0, import_jsx_runtime.jsx)("div", { className: "react-flow__selectionpane react-flow__container", onMouseDown, onMouseMove, onMouseUp, onMouseLeave, children: userSelectionRect.draw && (0, import_jsx_runtime.jsx)("div", { className: "react-flow__selection react-flow__container", style: {
    width: userSelectionRect.width,
    height: userSelectionRect.height,
    transform: `translate(${userSelectionRect.x}px, ${userSelectionRect.y}px)`
  } }) });
});
UserSelection.displayName = "UserSelection";
var selector$7 = (s) => ({
  transformString: `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`,
  userSelectionActive: s.userSelectionActive
});
var bboxSelector = (s) => {
  const selectedNodes = Array.from(s.nodeInternals.values()).filter((n) => n.selected);
  return getRectOfNodes(selectedNodes, s.nodeOrigin);
};
function NodesSelection({ onSelectionContextMenu, noPanClassName, disableKeyboardA11y }) {
  const store = useStoreApi();
  const { transformString, userSelectionActive } = useStore2(selector$7, shallow);
  const { width, height, x: left, y: top } = useStore2(bboxSelector, shallow);
  const updatePositions = useUpdateNodePositions();
  const nodeRef = (0, import_react2.useRef)(null);
  (0, import_react2.useEffect)(() => {
    var _a;
    if (!disableKeyboardA11y) {
      (_a = nodeRef.current) == null ? void 0 : _a.focus();
    }
  }, [disableKeyboardA11y]);
  useDrag({
    nodeRef
  });
  if (userSelectionActive || !width || !height) {
    return null;
  }
  const onContextMenu = onSelectionContextMenu ? (event) => {
    const selectedNodes = Array.from(store.getState().nodeInternals.values()).filter((n) => n.selected);
    onSelectionContextMenu(event, selectedNodes);
  } : void 0;
  const onKeyDown = (event) => {
    if (Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      updatePositions(arrowKeyDiffs[event.key]);
    }
  };
  return (0, import_jsx_runtime.jsx)("div", { className: cc(["react-flow__nodesselection", "react-flow__container", noPanClassName]), style: {
    transform: transformString
  }, children: (0, import_jsx_runtime.jsx)("div", { ref: nodeRef, className: "react-flow__nodesselection-rect", onContextMenu, tabIndex: disableKeyboardA11y ? void 0 : -1, onKeyDown: disableKeyboardA11y ? void 0 : onKeyDown, style: {
    width,
    height,
    top,
    left
  } }) });
}
var NodesSelection$1 = (0, import_react2.memo)(NodesSelection);
var selector$6 = (s) => s.paneDragging;
function Pane({ onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onWheel }) {
  const dragging = useStore2(selector$6);
  return (0, import_jsx_runtime.jsx)("div", { className: cc(["react-flow__pane", { dragging }]), onClick, onMouseEnter, onMouseMove, onMouseLeave, onContextMenu, onWheel, style: containerStyle });
}
var selector$5 = (s) => s.nodesSelectionActive;
var FlowRenderer = ({ children: children2, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, onMove, onMoveStart, onMoveEnd, selectionKeyCode, multiSelectionKeyCode, zoomActivationKeyCode, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, onSelectionContextMenu, noWheelClassName, noPanClassName, disableKeyboardA11y }) => {
  const store = useStoreApi();
  const nodesSelectionActive = useStore2(selector$5);
  const selectionKeyPressed = useKeyPress(selectionKeyCode);
  useGlobalKeyHandler({ deleteKeyCode, multiSelectionKeyCode });
  const onClick = (event) => {
    onPaneClick == null ? void 0 : onPaneClick(event);
    store.getState().resetSelectedElements();
    store.setState({ nodesSelectionActive: false });
  };
  const onContextMenu = onPaneContextMenu ? (event) => onPaneContextMenu(event) : void 0;
  const onWheel = onPaneScroll ? (event) => onPaneScroll(event) : void 0;
  return (0, import_jsx_runtime.jsxs)(ZoomPane, { onMove, onMoveStart, onMoveEnd, selectionKeyPressed, elementsSelectable, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, zoomActivationKeyCode, preventScrolling, noWheelClassName, noPanClassName, children: [children2, (0, import_jsx_runtime.jsx)(UserSelection, { selectionKeyPressed }), nodesSelectionActive && (0, import_jsx_runtime.jsx)(NodesSelection$1, { onSelectionContextMenu, noPanClassName, disableKeyboardA11y }), (0, import_jsx_runtime.jsx)(Pane, { onClick, onMouseEnter: onPaneMouseEnter, onMouseMove: onPaneMouseMove, onMouseLeave: onPaneMouseLeave, onContextMenu, onWheel })] });
};
FlowRenderer.displayName = "FlowRenderer";
var FlowRenderer$1 = (0, import_react2.memo)(FlowRenderer);
function useVisibleNodes(onlyRenderVisible) {
  const nodes = useStore2((0, import_react2.useCallback)((s) => onlyRenderVisible ? getNodesInside(s.nodeInternals, { x: 0, y: 0, width: s.width, height: s.height }, s.transform, true) : Array.from(s.nodeInternals.values()), [onlyRenderVisible]));
  return nodes;
}
var selector$4 = (s) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions
});
var NodeRenderer = (props) => {
  const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions } = useStore2(selector$4, shallow);
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const resizeObserverRef = (0, import_react2.useRef)();
  const resizeObserver = (0, import_react2.useMemo)(() => {
    if (typeof ResizeObserver === "undefined") {
      return null;
    }
    const observer = new ResizeObserver((entries) => {
      const updates = entries.map((entry) => ({
        id: entry.target.getAttribute("data-id"),
        nodeElement: entry.target,
        forceUpdate: true
      }));
      updateNodeDimensions(updates);
    });
    resizeObserverRef.current = observer;
    return observer;
  }, []);
  (0, import_react2.useEffect)(() => {
    return () => {
      var _a;
      (_a = resizeObserverRef == null ? void 0 : resizeObserverRef.current) == null ? void 0 : _a.disconnect();
    };
  }, []);
  return (0, import_jsx_runtime.jsx)("div", { className: "react-flow__nodes", style: containerStyle, children: nodes.map((node) => {
    var _a, _b, _c, _d, _e, _f, _g;
    let nodeType = node.type || "default";
    if (!props.nodeTypes[nodeType]) {
      devWarn(`Node type "${nodeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`);
      nodeType = "default";
    }
    const NodeComponent = props.nodeTypes[nodeType] || props.nodeTypes.default;
    const isDraggable = !!(node.draggable || nodesDraggable && typeof node.draggable === "undefined");
    const isSelectable = !!(node.selectable || elementsSelectable && typeof node.selectable === "undefined");
    const isConnectable = !!(node.connectable || nodesConnectable && typeof node.connectable === "undefined");
    const isFocusable = !!(node.focusable || nodesFocusable && typeof node.focusable === "undefined");
    const clampedPosition = props.nodeExtent ? clampPosition(node.positionAbsolute, props.nodeExtent) : node.positionAbsolute;
    const posX = (_a = clampedPosition == null ? void 0 : clampedPosition.x) != null ? _a : 0;
    const posY = (_b = clampedPosition == null ? void 0 : clampedPosition.y) != null ? _b : 0;
    const posOrigin = getPositionWithOrigin({
      x: posX,
      y: posY,
      width: (_c = node.width) != null ? _c : 0,
      height: (_d = node.height) != null ? _d : 0,
      origin: props.nodeOrigin
    });
    return (0, import_jsx_runtime.jsx)(NodeComponent, { id: node.id, className: node.className, style: node.style, type: nodeType, data: node.data, sourcePosition: node.sourcePosition || Position.Bottom, targetPosition: node.targetPosition || Position.Top, hidden: node.hidden, xPos: posX, yPos: posY, xPosOrigin: posOrigin.x, yPosOrigin: posOrigin.y, selectNodesOnDrag: props.selectNodesOnDrag, onClick: props.onNodeClick, onMouseEnter: props.onNodeMouseEnter, onMouseMove: props.onNodeMouseMove, onMouseLeave: props.onNodeMouseLeave, onContextMenu: props.onNodeContextMenu, onDoubleClick: props.onNodeDoubleClick, selected: !!node.selected, isDraggable, isSelectable, isConnectable, isFocusable, resizeObserver, dragHandle: node.dragHandle, zIndex: (_f = (_e = node[internalsSymbol]) == null ? void 0 : _e.z) != null ? _f : 0, isParent: !!((_g = node[internalsSymbol]) == null ? void 0 : _g.isParent), noDragClassName: props.noDragClassName, noPanClassName: props.noPanClassName, initialized: !!node.width && !!node.height, rfId: props.rfId, disableKeyboardA11y: props.disableKeyboardA11y, ariaLabel: node.ariaLabel }, node.id);
  }) });
};
NodeRenderer.displayName = "NodeRenderer";
var NodeRenderer$1 = (0, import_react2.memo)(NodeRenderer);
var defaultEdgeTree = [{ level: 0, isMaxLevel: true, edges: [] }];
function groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect = false) {
  let maxLevel = -1;
  const levelLookup = edges.reduce((tree, edge) => {
    var _a, _b, _c, _d;
    const hasZIndex = isNumeric(edge.zIndex);
    let z = hasZIndex ? edge.zIndex : 0;
    if (elevateEdgesOnSelect) {
      z = hasZIndex ? edge.zIndex : Math.max(((_b = (_a = nodeInternals.get(edge.source)) == null ? void 0 : _a[internalsSymbol]) == null ? void 0 : _b.z) || 0, ((_d = (_c = nodeInternals.get(edge.target)) == null ? void 0 : _c[internalsSymbol]) == null ? void 0 : _d.z) || 0);
    }
    if (tree[z]) {
      tree[z].push(edge);
    } else {
      tree[z] = [edge];
    }
    maxLevel = z > maxLevel ? z : maxLevel;
    return tree;
  }, {});
  const edgeTree = Object.entries(levelLookup).map(([key, edges2]) => {
    const level = +key;
    return {
      edges: edges2,
      level,
      isMaxLevel: level === maxLevel
    };
  });
  if (edgeTree.length === 0) {
    return defaultEdgeTree;
  }
  return edgeTree;
}
function useVisibleEdges(onlyRenderVisible, nodeInternals, elevateEdgesOnSelect) {
  const edges = useStore2((0, import_react2.useCallback)((s) => {
    if (!onlyRenderVisible) {
      return s.edges;
    }
    return s.edges.filter((e) => {
      const sourceNode = nodeInternals.get(e.source);
      const targetNode = nodeInternals.get(e.target);
      return (sourceNode == null ? void 0 : sourceNode.width) && (sourceNode == null ? void 0 : sourceNode.height) && (targetNode == null ? void 0 : targetNode.width) && (targetNode == null ? void 0 : targetNode.height) && isEdgeVisible({
        sourcePos: sourceNode.positionAbsolute || { x: 0, y: 0 },
        targetPos: targetNode.positionAbsolute || { x: 0, y: 0 },
        sourceWidth: sourceNode.width,
        sourceHeight: sourceNode.height,
        targetWidth: targetNode.width,
        targetHeight: targetNode.height,
        width: s.width,
        height: s.height,
        transform: s.transform
      });
    });
  }, [onlyRenderVisible, nodeInternals]));
  return groupEdgesByZLevel(edges, nodeInternals, elevateEdgesOnSelect);
}
var oppositePosition = {
  [Position.Left]: Position.Right,
  [Position.Right]: Position.Left,
  [Position.Top]: Position.Bottom,
  [Position.Bottom]: Position.Top
};
var ConnectionLine = ({ connectionNodeId, connectionHandleType, connectionLineStyle, connectionLineType = ConnectionLineType.Bezier, isConnectable, CustomConnectionLineComponent }) => {
  var _a, _b, _c, _d, _e;
  const { fromNode, handleId, toX, toY, connectionMode } = useStore2((0, import_react2.useCallback)((s) => ({
    fromNode: s.nodeInternals.get(connectionNodeId),
    handleId: s.connectionHandleId,
    toX: (s.connectionPosition.x - s.transform[0]) / s.transform[2],
    toY: (s.connectionPosition.y - s.transform[1]) / s.transform[2],
    connectionMode: s.connectionMode
  }), [connectionNodeId]), shallow);
  const fromHandleBounds = (_a = fromNode == null ? void 0 : fromNode[internalsSymbol]) == null ? void 0 : _a.handleBounds;
  let handleBounds = fromHandleBounds == null ? void 0 : fromHandleBounds[connectionHandleType];
  if (connectionMode === ConnectionMode.Loose) {
    handleBounds = handleBounds ? handleBounds : fromHandleBounds == null ? void 0 : fromHandleBounds[connectionHandleType === "source" ? "target" : "source"];
  }
  if (!fromNode || !isConnectable || !handleBounds) {
    return null;
  }
  const fromHandle = handleId ? handleBounds.find((d) => d.id === handleId) : handleBounds[0];
  const fromHandleX = fromHandle ? fromHandle.x + fromHandle.width / 2 : ((_b = fromNode == null ? void 0 : fromNode.width) != null ? _b : 0) / 2;
  const fromHandleY = fromHandle ? fromHandle.y + fromHandle.height / 2 : (_c = fromNode == null ? void 0 : fromNode.height) != null ? _c : 0;
  const fromX = (((_d = fromNode == null ? void 0 : fromNode.positionAbsolute) == null ? void 0 : _d.x) || 0) + fromHandleX;
  const fromY = (((_e = fromNode == null ? void 0 : fromNode.positionAbsolute) == null ? void 0 : _e.y) || 0) + fromHandleY;
  const fromPosition = fromHandle == null ? void 0 : fromHandle.position;
  if (!fromPosition) {
    return null;
  }
  const toPosition = oppositePosition[fromPosition];
  if (CustomConnectionLineComponent) {
    return (0, import_jsx_runtime.jsx)("g", { className: "react-flow__connection", children: (0, import_jsx_runtime.jsx)(CustomConnectionLineComponent, { connectionLineType, connectionLineStyle, fromNode, fromHandle, fromX, fromY, toX, toY, fromPosition, toPosition }) });
  }
  let dAttr = "";
  const pathParams = {
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition
  };
  if (connectionLineType === ConnectionLineType.Bezier) {
    [dAttr] = getBezierPath(pathParams);
  } else if (connectionLineType === ConnectionLineType.Step) {
    [dAttr] = getSmoothStepPath({
      ...pathParams,
      borderRadius: 0
    });
  } else if (connectionLineType === ConnectionLineType.SmoothStep) {
    [dAttr] = getSmoothStepPath(pathParams);
  } else if (connectionLineType === ConnectionLineType.SimpleBezier) {
    [dAttr] = getSimpleBezierPath(pathParams);
  } else {
    dAttr = `M${fromX},${fromY} ${toX},${toY}`;
  }
  return (0, import_jsx_runtime.jsx)("g", { className: "react-flow__connection", children: (0, import_jsx_runtime.jsx)("path", { d: dAttr, fill: "none", className: "react-flow__connection-path", style: connectionLineStyle }) });
};
ConnectionLine.displayName = "ConnectionLine";
var ArrowSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  return (0, import_jsx_runtime.jsx)("polyline", { stroke: color2, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth, fill: "none", points: "-5,-4 0,0 -5,4" });
};
var ArrowClosedSymbol = ({ color: color2 = "none", strokeWidth = 1 }) => {
  return (0, import_jsx_runtime.jsx)("polyline", { stroke: color2, strokeLinecap: "round", strokeLinejoin: "round", strokeWidth, fill: color2, points: "-5,-4 0,0 -5,4 -5,-4" });
};
var MarkerSymbols = {
  [MarkerType.Arrow]: ArrowSymbol,
  [MarkerType.ArrowClosed]: ArrowClosedSymbol
};
function useMarkerSymbol(type) {
  const symbol = (0, import_react2.useMemo)(() => {
    const symbolExists = Object.prototype.hasOwnProperty.call(MarkerSymbols, type);
    if (!symbolExists) {
      devWarn(`Marker type "${type}" doesn't exist. Help: https://reactflow.dev/error#900`);
      return null;
    }
    return MarkerSymbols[type];
  }, [type]);
  return symbol;
}
var Marker = ({ id: id2, type, color: color2, width = 12.5, height = 12.5, markerUnits = "strokeWidth", strokeWidth, orient = "auto-start-reverse" }) => {
  const Symbol2 = useMarkerSymbol(type);
  if (!Symbol2) {
    return null;
  }
  return (0, import_jsx_runtime.jsx)("marker", { className: "react-flow__arrowhead", id: id2, markerWidth: `${width}`, markerHeight: `${height}`, viewBox: "-10 -10 20 20", markerUnits, orient, refX: "0", refY: "0", children: (0, import_jsx_runtime.jsx)(Symbol2, { color: color2, strokeWidth }) });
};
var markerSelector = ({ defaultColor: defaultColor2, rfId }) => (s) => {
  const ids = [];
  return s.edges.reduce((markers, edge) => {
    [edge.markerStart, edge.markerEnd].forEach((marker) => {
      if (marker && typeof marker === "object") {
        const markerId = getMarkerId(marker, rfId);
        if (!ids.includes(markerId)) {
          markers.push({ id: markerId, color: marker.color || defaultColor2, ...marker });
          ids.push(markerId);
        }
      }
    });
    return markers;
  }, []).sort((a, b) => a.id.localeCompare(b.id));
};
var MarkerDefinitions = ({ defaultColor: defaultColor2, rfId }) => {
  const markers = useStore2(
    (0, import_react2.useCallback)(markerSelector({ defaultColor: defaultColor2, rfId }), [defaultColor2, rfId]),
    (a, b) => !(a.length !== b.length || a.some((m, i) => m.id !== b[i].id))
  );
  return (0, import_jsx_runtime.jsx)("defs", { children: markers.map((marker) => (0, import_jsx_runtime.jsx)(Marker, { id: marker.id, type: marker.type, color: marker.color, width: marker.width, height: marker.height, markerUnits: marker.markerUnits, strokeWidth: marker.strokeWidth, orient: marker.orient }, marker.id)) });
};
MarkerDefinitions.displayName = "MarkerDefinitions";
var MarkerDefinitions$1 = (0, import_react2.memo)(MarkerDefinitions);
var selector$3 = (s) => ({
  connectionNodeId: s.connectionNodeId,
  connectionHandleType: s.connectionHandleType,
  nodesConnectable: s.nodesConnectable,
  edgesFocusable: s.edgesFocusable,
  elementsSelectable: s.elementsSelectable,
  width: s.width,
  height: s.height,
  connectionMode: s.connectionMode,
  nodeInternals: s.nodeInternals
});
var EdgeRenderer = (props) => {
  const { connectionNodeId, connectionHandleType, nodesConnectable, edgesFocusable, elementsSelectable, width, height, connectionMode, nodeInternals } = useStore2(selector$3, shallow);
  const edgeTree = useVisibleEdges(props.onlyRenderVisibleElements, nodeInternals, props.elevateEdgesOnSelect);
  if (!width) {
    return null;
  }
  const { connectionLineType, defaultMarkerColor, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle } = props;
  const renderConnectionLine = connectionNodeId && connectionHandleType;
  return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [edgeTree.map(({ level, edges, isMaxLevel }) => (0, import_jsx_runtime.jsxs)("svg", { style: { zIndex: level }, width, height, className: "react-flow__edges react-flow__container", children: [isMaxLevel && (0, import_jsx_runtime.jsx)(MarkerDefinitions$1, { defaultColor: defaultMarkerColor, rfId: props.rfId }), (0, import_jsx_runtime.jsx)("g", { children: edges.map((edge) => {
    const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(nodeInternals.get(edge.source));
    const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(nodeInternals.get(edge.target));
    if (!sourceIsValid || !targetIsValid) {
      return null;
    }
    let edgeType = edge.type || "default";
    if (!props.edgeTypes[edgeType]) {
      devWarn(`Edge type "${edgeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`);
      edgeType = "default";
    }
    const EdgeComponent = props.edgeTypes[edgeType] || props.edgeTypes.default;
    const targetNodeHandles = connectionMode === ConnectionMode.Strict ? targetHandleBounds.target : targetHandleBounds.target || targetHandleBounds.source;
    const sourceHandle = getHandle(sourceHandleBounds.source, edge.sourceHandle || null);
    const targetHandle = getHandle(targetNodeHandles, edge.targetHandle || null);
    const sourcePosition = (sourceHandle == null ? void 0 : sourceHandle.position) || Position.Bottom;
    const targetPosition = (targetHandle == null ? void 0 : targetHandle.position) || Position.Top;
    const isFocusable = !!(edge.focusable || edgesFocusable && typeof edge.focusable === "undefined");
    if (!sourceHandle || !targetHandle) {
      devWarn(`Couldn't create edge for ${!sourceHandle ? "source" : "target"} handle id: ${!sourceHandle ? edge.sourceHandle : edge.targetHandle}; edge id: ${edge.id}. Help: https://reactflow.dev/error#800`);
      return null;
    }
    const { sourceX, sourceY, targetX, targetY } = getEdgePositions(sourceNodeRect, sourceHandle, sourcePosition, targetNodeRect, targetHandle, targetPosition);
    return (0, import_jsx_runtime.jsx)(EdgeComponent, { id: edge.id, className: cc([edge.className, props.noPanClassName]), type: edgeType, data: edge.data, selected: !!edge.selected, animated: !!edge.animated, hidden: !!edge.hidden, label: edge.label, labelStyle: edge.labelStyle, labelShowBg: edge.labelShowBg, labelBgStyle: edge.labelBgStyle, labelBgPadding: edge.labelBgPadding, labelBgBorderRadius: edge.labelBgBorderRadius, style: edge.style, source: edge.source, target: edge.target, sourceHandleId: edge.sourceHandle, targetHandleId: edge.targetHandle, markerEnd: edge.markerEnd, markerStart: edge.markerStart, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, elementsSelectable, onEdgeUpdate: props.onEdgeUpdate, onContextMenu: props.onEdgeContextMenu, onMouseEnter: props.onEdgeMouseEnter, onMouseMove: props.onEdgeMouseMove, onMouseLeave: props.onEdgeMouseLeave, onClick: props.onEdgeClick, edgeUpdaterRadius: props.edgeUpdaterRadius, onEdgeDoubleClick: props.onEdgeDoubleClick, onEdgeUpdateStart: props.onEdgeUpdateStart, onEdgeUpdateEnd: props.onEdgeUpdateEnd, rfId: props.rfId, ariaLabel: edge.ariaLabel, isFocusable, pathOptions: "pathOptions" in edge ? edge.pathOptions : void 0, interactionWidth: edge.interactionWidth }, edge.id);
  }) })] }, level)), renderConnectionLine && (0, import_jsx_runtime.jsx)("svg", { style: connectionLineContainerStyle, width, height, className: "react-flow__edges react-flow__connectionline react-flow__container", children: (0, import_jsx_runtime.jsx)(ConnectionLine, { connectionNodeId, connectionHandleType, connectionLineStyle, connectionLineType, isConnectable: nodesConnectable, CustomConnectionLineComponent: connectionLineComponent }) })] });
};
EdgeRenderer.displayName = "EdgeRenderer";
var EdgeRenderer$1 = (0, import_react2.memo)(EdgeRenderer);
var selector$2 = (s) => `translate(${s.transform[0]}px,${s.transform[1]}px) scale(${s.transform[2]})`;
function Viewport({ children: children2 }) {
  const transform2 = useStore2(selector$2);
  return (0, import_jsx_runtime.jsx)("div", { className: "react-flow__viewport react-flow__container", style: { transform: transform2 }, children: children2 });
}
function useOnInitHandler(onInit) {
  const rfInstance = useReactFlow();
  const isInitialized = (0, import_react2.useRef)(false);
  (0, import_react2.useEffect)(() => {
    if (!isInitialized.current && rfInstance.viewportInitialized && onInit) {
      setTimeout(() => onInit(rfInstance), 1);
      isInitialized.current = true;
    }
  }, [onInit, rfInstance.viewportInitialized]);
}
var GraphView = ({ nodeTypes, edgeTypes, onMove, onMoveStart, onMoveEnd, onInit, onNodeClick, onEdgeClick, onNodeDoubleClick, onEdgeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onSelectionContextMenu, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, multiSelectionKeyCode, zoomActivationKeyCode, deleteKeyCode, onlyRenderVisibleElements, elementsSelectable, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, defaultMarkerColor, zoomOnScroll, zoomOnPinch, panOnScroll, panOnScrollSpeed, panOnScrollMode, zoomOnDoubleClick, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, edgeUpdaterRadius, onEdgeUpdateStart, onEdgeUpdateEnd, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId }) => {
  useOnInitHandler(onInit);
  return (0, import_jsx_runtime.jsx)(FlowRenderer$1, { onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneContextMenu, onPaneScroll, deleteKeyCode, selectionKeyCode, multiSelectionKeyCode, zoomActivationKeyCode, elementsSelectable, onMove, onMoveStart, onMoveEnd, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, onSelectionContextMenu, preventScrolling, noDragClassName, noWheelClassName, noPanClassName, disableKeyboardA11y, children: (0, import_jsx_runtime.jsxs)(Viewport, { children: [(0, import_jsx_runtime.jsx)(EdgeRenderer$1, { edgeTypes, onEdgeClick, onEdgeDoubleClick, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, onEdgeUpdate, onlyRenderVisibleElements, onEdgeContextMenu, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdateStart, onEdgeUpdateEnd, edgeUpdaterRadius, defaultMarkerColor, noPanClassName, elevateEdgesOnSelect: !!elevateEdgesOnSelect, disableKeyboardA11y, rfId }), (0, import_jsx_runtime.jsx)("div", { className: "react-flow__edgelabel-renderer" }), (0, import_jsx_runtime.jsx)(NodeRenderer$1, { nodeTypes, onNodeClick, onNodeDoubleClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, selectNodesOnDrag, onlyRenderVisibleElements, noPanClassName, noDragClassName, disableKeyboardA11y, nodeOrigin, nodeExtent, rfId })] }) });
};
GraphView.displayName = "GraphView";
var GraphView$1 = (0, import_react2.memo)(GraphView);
var infiniteExtent = [
  [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
  [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
];
var initialState = {
  rfId: "1",
  width: 0,
  height: 0,
  transform: [0, 0, 1],
  nodeInternals: /* @__PURE__ */ new Map(),
  edges: [],
  onNodesChange: null,
  onEdgesChange: null,
  hasDefaultNodes: false,
  hasDefaultEdges: false,
  d3Zoom: null,
  d3Selection: null,
  d3ZoomHandler: void 0,
  minZoom: 0.5,
  maxZoom: 2,
  translateExtent: infiniteExtent,
  nodeExtent: infiniteExtent,
  nodesSelectionActive: false,
  userSelectionActive: false,
  connectionNodeId: null,
  connectionHandleId: null,
  connectionHandleType: "source",
  connectionPosition: { x: 0, y: 0 },
  connectionMode: ConnectionMode.Strict,
  domNode: null,
  paneDragging: false,
  noPanClassName: "nopan",
  nodeOrigin: [0, 0],
  snapGrid: [15, 15],
  snapToGrid: false,
  nodesDraggable: true,
  nodesConnectable: true,
  nodesFocusable: true,
  edgesFocusable: true,
  elementsSelectable: true,
  fitViewOnInit: false,
  fitViewOnInitDone: false,
  fitViewOnInitOptions: void 0,
  multiSelectionActive: false,
  connectionStartHandle: null,
  connectOnClick: true,
  ariaLiveMessage: ""
};
var createRFStore = () => createStore((set3, get3) => ({
  ...initialState,
  setNodes: (nodes) => {
    set3({ nodeInternals: createNodeInternals(nodes, get3().nodeInternals) });
  },
  setEdges: (edges) => {
    const { defaultEdgeOptions = {} } = get3();
    set3({ edges: edges.map((e) => ({ ...defaultEdgeOptions, ...e })) });
  },
  setDefaultNodesAndEdges: (nodes, edges) => {
    const hasDefaultNodes = typeof nodes !== "undefined";
    const hasDefaultEdges = typeof edges !== "undefined";
    const nodeInternals = hasDefaultNodes ? createNodeInternals(nodes, /* @__PURE__ */ new Map()) : /* @__PURE__ */ new Map();
    const nextEdges = hasDefaultEdges ? edges : [];
    set3({ nodeInternals, edges: nextEdges, hasDefaultNodes, hasDefaultEdges });
  },
  updateNodeDimensions: (updates) => {
    const { onNodesChange, nodeInternals, fitViewOnInit, fitViewOnInitDone, fitViewOnInitOptions, domNode, nodeOrigin } = get3();
    const viewportNode = domNode == null ? void 0 : domNode.querySelector(".react-flow__viewport");
    if (!viewportNode) {
      return;
    }
    const style2 = window.getComputedStyle(viewportNode);
    const { m22: zoom } = new window.DOMMatrixReadOnly(style2.transform);
    const changes = updates.reduce((res, update) => {
      const node = nodeInternals.get(update.id);
      if (node) {
        const dimensions = getDimensions(update.nodeElement);
        const doUpdate = !!(dimensions.width && dimensions.height && (node.width !== dimensions.width || node.height !== dimensions.height || update.forceUpdate));
        if (doUpdate) {
          nodeInternals.set(node.id, {
            ...node,
            [internalsSymbol]: {
              ...node[internalsSymbol],
              handleBounds: {
                source: getHandleBounds(".source", update.nodeElement, zoom, nodeOrigin),
                target: getHandleBounds(".target", update.nodeElement, zoom, nodeOrigin)
              }
            },
            ...dimensions
          });
          res.push({
            id: node.id,
            type: "dimensions",
            dimensions
          });
        }
      }
      return res;
    }, []);
    const nextFitViewOnInitDone = fitViewOnInitDone || fitViewOnInit && !fitViewOnInitDone && fitView(get3, { initial: true, ...fitViewOnInitOptions });
    set3({ nodeInternals: new Map(nodeInternals), fitViewOnInitDone: nextFitViewOnInitDone });
    if ((changes == null ? void 0 : changes.length) > 0) {
      onNodesChange == null ? void 0 : onNodesChange(changes);
    }
  },
  updateNodePositions: (nodeDragItems, positionChanged = true, dragging = false) => {
    const { onNodesChange, nodeInternals, hasDefaultNodes } = get3();
    if (hasDefaultNodes || onNodesChange) {
      const changes = nodeDragItems.map((node) => {
        const change = {
          id: node.id,
          type: "position",
          dragging
        };
        if (positionChanged) {
          change.positionAbsolute = node.positionAbsolute;
          change.position = node.position;
        }
        return change;
      });
      if (changes == null ? void 0 : changes.length) {
        if (hasDefaultNodes) {
          const nodes = applyNodeChanges(changes, Array.from(nodeInternals.values()));
          const nextNodeInternals = createNodeInternals(nodes, nodeInternals);
          set3({ nodeInternals: nextNodeInternals });
        }
        onNodesChange == null ? void 0 : onNodesChange(changes);
      }
    }
  },
  addSelectedNodes: (selectedNodeIds) => {
    const { multiSelectionActive, nodeInternals, edges } = get3();
    let changedNodes;
    let changedEdges = null;
    if (multiSelectionActive) {
      changedNodes = selectedNodeIds.map((nodeId) => createSelectionChange(nodeId, true));
    } else {
      changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), selectedNodeIds);
      changedEdges = getSelectionChanges(edges, []);
    }
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get3,
      set: set3
    });
  },
  addSelectedEdges: (selectedEdgeIds) => {
    const { multiSelectionActive, edges, nodeInternals } = get3();
    let changedEdges;
    let changedNodes = null;
    if (multiSelectionActive) {
      changedEdges = selectedEdgeIds.map((edgeId) => createSelectionChange(edgeId, true));
    } else {
      changedEdges = getSelectionChanges(edges, selectedEdgeIds);
      changedNodes = getSelectionChanges(Array.from(nodeInternals.values()), []);
    }
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get3,
      set: set3
    });
  },
  unselectNodesAndEdges: ({ nodes, edges } = {}) => {
    const { nodeInternals, edges: storeEdges } = get3();
    const nodesToUnselect = nodes ? nodes : Array.from(nodeInternals.values());
    const edgesToUnselect = edges ? edges : storeEdges;
    const changedNodes = nodesToUnselect.map((n) => {
      n.selected = false;
      return createSelectionChange(n.id, false);
    });
    const changedEdges = edgesToUnselect.map((edge) => createSelectionChange(edge.id, false));
    updateNodesAndEdgesSelections({
      changedNodes,
      changedEdges,
      get: get3,
      set: set3
    });
  },
  setMinZoom: (minZoom) => {
    const { d3Zoom, maxZoom } = get3();
    d3Zoom == null ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
    set3({ minZoom });
  },
  setMaxZoom: (maxZoom) => {
    const { d3Zoom, minZoom } = get3();
    d3Zoom == null ? void 0 : d3Zoom.scaleExtent([minZoom, maxZoom]);
    set3({ maxZoom });
  },
  setTranslateExtent: (translateExtent) => {
    const { d3Zoom } = get3();
    d3Zoom == null ? void 0 : d3Zoom.translateExtent(translateExtent);
    set3({ translateExtent });
  },
  resetSelectedElements: () => {
    const { nodeInternals, edges } = get3();
    const nodes = Array.from(nodeInternals.values());
    const nodesToUnselect = nodes.filter((e) => e.selected).map((n) => createSelectionChange(n.id, false));
    const edgesToUnselect = edges.filter((e) => e.selected).map((e) => createSelectionChange(e.id, false));
    updateNodesAndEdgesSelections({
      changedNodes: nodesToUnselect,
      changedEdges: edgesToUnselect,
      get: get3,
      set: set3
    });
  },
  setNodeExtent: (nodeExtent) => {
    const { nodeInternals } = get3();
    nodeInternals.forEach((node) => {
      node.positionAbsolute = clampPosition(node.position, nodeExtent);
    });
    set3({
      nodeExtent,
      nodeInternals: new Map(nodeInternals)
    });
  },
  cancelConnection: () => set3({
    connectionNodeId: initialState.connectionNodeId,
    connectionHandleId: initialState.connectionHandleId
  }),
  reset: () => set3({ ...initialState })
}));
var ReactFlowProvider = ({ children: children2 }) => {
  const storeRef = (0, import_react2.useRef)(null);
  if (!storeRef.current) {
    storeRef.current = createRFStore();
  }
  return (0, import_jsx_runtime.jsx)(Provider$1, { value: storeRef.current, children: children2 });
};
ReactFlowProvider.displayName = "ReactFlowProvider";
var Wrapper = ({ children: children2 }) => {
  let isWrapped = true;
  try {
    useStoreApi();
  } catch (e) {
    isWrapped = false;
  }
  if (isWrapped) {
    return (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: children2 });
  }
  return (0, import_jsx_runtime.jsx)(ReactFlowProvider, { children: children2 });
};
Wrapper.displayName = "ReactFlowWrapper";
function useNodeOrEdgeTypes(nodeOrEdgeTypes, createTypes) {
  const typesKeysRef = (0, import_react2.useRef)(null);
  const typesParsed = (0, import_react2.useMemo)(() => {
    if (true) {
      const typeKeys = Object.keys(nodeOrEdgeTypes);
      if (shallow(typesKeysRef.current, typeKeys)) {
        devWarn("It looks like you have created a new nodeTypes or edgeTypes object. If this wasn't on purpose please define the nodeTypes/edgeTypes outside of the component or memoize them. Help: https://reactflow.dev/error#200");
      }
      typesKeysRef.current = typeKeys;
    }
    return createTypes(nodeOrEdgeTypes);
  }, [nodeOrEdgeTypes]);
  return typesParsed;
}
var defaultNodeTypes = {
  input: InputNode$1,
  default: DefaultNode$1,
  output: OutputNode$1,
  group: GroupNode
};
var defaultEdgeTypes = {
  default: BezierEdge,
  straight: StraightEdge,
  step: StepEdge,
  smoothstep: SmoothStepEdge,
  simplebezier: SimpleBezierEdge
};
var initNodeOrigin = [0, 0];
var initSnapGrid = [15, 15];
var initDefaultViewport = { x: 0, y: 0, zoom: 1 };
var wrapperStyle = {
  width: "100%",
  height: "100%",
  overflow: "hidden",
  position: "relative",
  zIndex: 0
};
var ReactFlow = (0, import_react2.forwardRef)(({ nodes, edges, defaultNodes, defaultEdges, className, nodeTypes = defaultNodeTypes, edgeTypes = defaultEdgeTypes, onNodeClick, onEdgeClick, onInit, onMove, onMoveStart, onMoveEnd, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, onNodeDragStart, onNodeDrag, onNodeDragStop, onNodesDelete, onEdgesDelete, onSelectionChange, onSelectionDragStart, onSelectionDrag, onSelectionDragStop, onSelectionContextMenu, connectionMode = ConnectionMode.Strict, connectionLineType = ConnectionLineType.Bezier, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, deleteKeyCode = "Backspace", selectionKeyCode = "Shift", multiSelectionKeyCode = "Meta", zoomActivationKeyCode = "Meta", snapToGrid = false, snapGrid = initSnapGrid, onlyRenderVisibleElements = false, selectNodesOnDrag = true, nodesDraggable, nodesConnectable, nodesFocusable, nodeOrigin = initNodeOrigin, edgesFocusable, elementsSelectable, defaultViewport = initDefaultViewport, minZoom = 0.5, maxZoom = 2, translateExtent = infiniteExtent, preventScrolling = true, nodeExtent, defaultMarkerColor = "#b1b1b7", zoomOnScroll = true, zoomOnPinch = true, panOnScroll = false, panOnScrollSpeed = 0.5, panOnScrollMode = PanOnScrollMode.Free, zoomOnDoubleClick = true, panOnDrag = true, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, children: children2, onEdgeUpdate, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdateStart, onEdgeUpdateEnd, edgeUpdaterRadius = 10, onNodesChange, onEdgesChange, noDragClassName = "nodrag", noWheelClassName = "nowheel", noPanClassName = "nopan", fitView: fitView2 = false, fitViewOptions, connectOnClick = true, attributionPosition, proOptions, defaultEdgeOptions, elevateEdgesOnSelect = false, disableKeyboardA11y = false, style: style2, id: id2, ...rest }, ref) => {
  const nodeTypesWrapped = useNodeOrEdgeTypes(nodeTypes, createNodeTypes);
  const edgeTypesWrapped = useNodeOrEdgeTypes(edgeTypes, createEdgeTypes);
  const rfId = id2 || "1";
  return (0, import_jsx_runtime.jsx)("div", { ...rest, style: { ...style2, ...wrapperStyle }, ref, className: cc(["react-flow", className]), "data-testid": "rf__wrapper", id: id2, children: (0, import_jsx_runtime.jsxs)(Wrapper, { children: [(0, import_jsx_runtime.jsx)(GraphView$1, { onInit, onMove, onMoveStart, onMoveEnd, onNodeClick, onEdgeClick, onNodeMouseEnter, onNodeMouseMove, onNodeMouseLeave, onNodeContextMenu, onNodeDoubleClick, nodeTypes: nodeTypesWrapped, edgeTypes: edgeTypesWrapped, connectionLineType, connectionLineStyle, connectionLineComponent, connectionLineContainerStyle, selectionKeyCode, deleteKeyCode, multiSelectionKeyCode, zoomActivationKeyCode, onlyRenderVisibleElements, selectNodesOnDrag, defaultViewport, translateExtent, minZoom, maxZoom, preventScrolling, zoomOnScroll, zoomOnPinch, zoomOnDoubleClick, panOnScroll, panOnScrollSpeed, panOnScrollMode, panOnDrag, onPaneClick, onPaneMouseEnter, onPaneMouseMove, onPaneMouseLeave, onPaneScroll, onPaneContextMenu, onSelectionContextMenu, onEdgeUpdate, onEdgeContextMenu, onEdgeDoubleClick, onEdgeMouseEnter, onEdgeMouseMove, onEdgeMouseLeave, onEdgeUpdateStart, onEdgeUpdateEnd, edgeUpdaterRadius, defaultMarkerColor, noDragClassName, noWheelClassName, noPanClassName, elevateEdgesOnSelect, rfId, disableKeyboardA11y, nodeOrigin, nodeExtent }), (0, import_jsx_runtime.jsx)(StoreUpdater, { nodes, edges, defaultNodes, defaultEdges, onConnect, onConnectStart, onConnectEnd, onClickConnectStart, onClickConnectEnd, nodesDraggable, nodesConnectable, nodesFocusable, edgesFocusable, elementsSelectable, minZoom, maxZoom, nodeExtent, onNodesChange, onEdgesChange, snapToGrid, snapGrid, connectionMode, translateExtent, connectOnClick, defaultEdgeOptions, fitView: fitView2, fitViewOptions, onNodesDelete, onEdgesDelete, onNodeDragStart, onNodeDrag, onNodeDragStop, onSelectionDrag, onSelectionDragStart, onSelectionDragStop, noPanClassName, nodeOrigin, rfId }), (0, import_jsx_runtime.jsx)(Wrapper$1, { onSelectionChange }), children2, (0, import_jsx_runtime.jsx)(Attribution, { proOptions, position: attributionPosition }), (0, import_jsx_runtime.jsx)(A11yDescriptions, { rfId, disableKeyboardA11y })] }) });
});
ReactFlow.displayName = "ReactFlow";
var selector$1 = (s) => {
  var _a;
  return (_a = s.domNode) == null ? void 0 : _a.querySelector(".react-flow__edgelabel-renderer");
};
function EdgeLabelRenderer({ children: children2 }) {
  const edgeLabelRenderer = useStore2(selector$1);
  if (!edgeLabelRenderer) {
    return null;
  }
  return (0, import_react_dom.createPortal)(children2, edgeLabelRenderer);
}
function useUpdateNodeInternals() {
  const store = useStoreApi();
  return (0, import_react2.useCallback)((id2) => {
    const { domNode, updateNodeDimensions } = store.getState();
    const nodeElement = domNode == null ? void 0 : domNode.querySelector(`.react-flow__node[data-id="${id2}"]`);
    if (nodeElement) {
      requestAnimationFrame(() => updateNodeDimensions([{ id: id2, nodeElement, forceUpdate: true }]));
    }
  }, []);
}
var nodesSelector = (state) => Array.from(state.nodeInternals.values());
function useNodes() {
  const nodes = useStore2(nodesSelector);
  return nodes;
}
var edgesSelector = (state) => state.edges;
function useEdges() {
  const edges = useStore2(edgesSelector);
  return edges;
}
var viewportSelector = (state) => ({
  x: state.transform[0],
  y: state.transform[1],
  zoom: state.transform[2]
});
function useViewport() {
  const viewport = useStore2(viewportSelector, shallow);
  return viewport;
}
function createUseItemsState(applyChanges2) {
  return (initialItems) => {
    const [items, setItems] = (0, import_react2.useState)(initialItems);
    const onItemsChange = (0, import_react2.useCallback)((changes) => setItems((items2) => applyChanges2(changes, items2)), []);
    return [items, setItems, onItemsChange];
  };
}
var useNodesState = createUseItemsState(applyNodeChanges);
var useEdgesState = createUseItemsState(applyEdgeChanges);
function useOnViewportChange({ onStart, onChange, onEnd }) {
  const store = useStoreApi();
  (0, import_react2.useEffect)(() => {
    store.setState({ onViewportChangeStart: onStart });
  }, [onStart]);
  (0, import_react2.useEffect)(() => {
    store.setState({ onViewportChange: onChange });
  }, [onChange]);
  (0, import_react2.useEffect)(() => {
    store.setState({ onViewportChangeEnd: onEnd });
  }, [onEnd]);
}
function useOnSelectionChange({ onChange }) {
  const store = useStoreApi();
  (0, import_react2.useEffect)(() => {
    store.setState({ onSelectionChange: onChange });
  }, [onChange]);
}
var selector = (s) => {
  if (s.nodeInternals.size === 0) {
    return false;
  }
  return Array.from(s.nodeInternals.values()).every((n) => {
    var _a;
    return ((_a = n[internalsSymbol]) == null ? void 0 : _a.handleBounds) !== void 0;
  });
};
function useNodesInitialized() {
  const initialized = useStore2(selector);
  return initialized;
}

// node_modules/.deno/@reactflow+minimap@11.2.0/node_modules/@reactflow/minimap/dist/esm/index.js
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var import_react3 = __toESM(require_react());
var MiniMapNode = ({ id: id2, x, y, width, height, style: style2, color: color2, strokeColor, strokeWidth, className, borderRadius, shapeRendering, onClick }) => {
  const { background, backgroundColor } = style2 || {};
  const fill = color2 || background || backgroundColor;
  return (0, import_jsx_runtime2.jsx)("rect", { className: cc(["react-flow__minimap-node", className]), x, y, rx: borderRadius, ry: borderRadius, width, height, fill, stroke: strokeColor, strokeWidth, shapeRendering, onClick: onClick ? (event) => onClick(event, id2) : void 0 });
};
MiniMapNode.displayName = "MiniMapNode";
var MiniMapNode$1 = (0, import_react3.memo)(MiniMapNode);
var defaultWidth = 200;
var defaultHeight = 150;
var selector2 = (s) => {
  const nodes = Array.from(s.nodeInternals.values());
  const viewBB = {
    x: -s.transform[0] / s.transform[2],
    y: -s.transform[1] / s.transform[2],
    width: s.width / s.transform[2],
    height: s.height / s.transform[2]
  };
  return {
    nodes: nodes.filter((node) => !node.hidden && node.width && node.height),
    viewBB,
    boundingRect: nodes.length > 0 ? getBoundsOfRects(getRectOfNodes(nodes, s.nodeOrigin), viewBB) : viewBB,
    rfId: s.rfId,
    nodeOrigin: s.nodeOrigin
  };
};
var getAttrFunction = (func) => func instanceof Function ? func : () => func;
var ARIA_LABEL_KEY = "react-flow__minimap-desc";
function MiniMap({ style: style2, className, nodeStrokeColor = "transparent", nodeColor = "#e2e2e2", nodeClassName = "", nodeBorderRadius = 5, nodeStrokeWidth = 2, maskColor = "rgb(240, 240, 240, 0.6)", maskStrokeColor = "none", maskStrokeWidth = 1, position = "bottom-right", onClick, onNodeClick, pannable = false, zoomable = false, ariaLabel = "React Flow mini map" }) {
  var _a, _b;
  const store = useStoreApi();
  const svg = (0, import_react3.useRef)(null);
  const { boundingRect, viewBB, nodes, rfId, nodeOrigin } = useStore2(selector2, shallow);
  const elementWidth = (_a = style2 == null ? void 0 : style2.width) != null ? _a : defaultWidth;
  const elementHeight = (_b = style2 == null ? void 0 : style2.height) != null ? _b : defaultHeight;
  const nodeColorFunc = getAttrFunction(nodeColor);
  const nodeStrokeColorFunc = getAttrFunction(nodeStrokeColor);
  const nodeClassNameFunc = getAttrFunction(nodeClassName);
  const scaledWidth = boundingRect.width / elementWidth;
  const scaledHeight = boundingRect.height / elementHeight;
  const viewScale = Math.max(scaledWidth, scaledHeight);
  const viewWidth = viewScale * elementWidth;
  const viewHeight = viewScale * elementHeight;
  const offset = 5 * viewScale;
  const x = boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset;
  const y = boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset;
  const width = viewWidth + offset * 2;
  const height = viewHeight + offset * 2;
  const shapeRendering = typeof window === "undefined" || !!window.chrome ? "crispEdges" : "geometricPrecision";
  const labelledBy = `${ARIA_LABEL_KEY}-${rfId}`;
  const viewScaleRef = (0, import_react3.useRef)(0);
  viewScaleRef.current = viewScale;
  (0, import_react3.useEffect)(() => {
    if (svg.current) {
      const selection2 = select_default2(svg.current);
      const zoomHandler = (event) => {
        const { transform: transform2, d3Selection, d3Zoom } = store.getState();
        if (event.sourceEvent.type !== "wheel" || !d3Selection || !d3Zoom) {
          return;
        }
        const pinchDelta = -event.sourceEvent.deltaY * (event.sourceEvent.deltaMode === 1 ? 0.05 : event.sourceEvent.deltaMode ? 1 : 2e-3) * 10;
        const zoom = transform2[2] * Math.pow(2, pinchDelta);
        d3Zoom.scaleTo(d3Selection, zoom);
      };
      const panHandler = (event) => {
        const { transform: transform2, d3Selection, d3Zoom } = store.getState();
        if (event.sourceEvent.type !== "mousemove" || !d3Selection || !d3Zoom) {
          return;
        }
        const position2 = {
          x: transform2[0] - event.sourceEvent.movementX * viewScaleRef.current * Math.max(1, transform2[2]),
          y: transform2[1] - event.sourceEvent.movementY * viewScaleRef.current * Math.max(1, transform2[2])
        };
        const nextTransform = identity2.translate(position2.x, position2.y).scale(transform2[2]);
        d3Zoom.transform(d3Selection, nextTransform);
      };
      const zoomAndPanHandler = zoom_default2().on("zoom", pannable ? panHandler : null).on("zoom.wheel", zoomable ? zoomHandler : null);
      selection2.call(zoomAndPanHandler);
      return () => {
        selection2.on("zoom", null);
      };
    }
  }, [pannable, zoomable]);
  const onSvgClick = onClick ? (event) => {
    const rfCoord = pointer_default(event);
    onClick(event, { x: rfCoord[0], y: rfCoord[1] });
  } : void 0;
  const onSvgNodeClick = onNodeClick ? (event, nodeId) => {
    const node = store.getState().nodeInternals.get(nodeId);
    onNodeClick(event, node);
  } : void 0;
  return (0, import_jsx_runtime2.jsx)(Panel, { position, style: style2, className: cc(["react-flow__minimap", className]), children: (0, import_jsx_runtime2.jsxs)("svg", { width: elementWidth, height: elementHeight, viewBox: `${x} ${y} ${width} ${height}`, role: "img", "aria-labelledby": labelledBy, ref: svg, onClick: onSvgClick, children: [ariaLabel && (0, import_jsx_runtime2.jsx)("title", { id: labelledBy, children: ariaLabel }), nodes.map((node) => {
    var _a2, _b2, _c, _d, _e, _f;
    return (0, import_jsx_runtime2.jsx)(MiniMapNode$1, { x: ((_b2 = (_a2 = node.positionAbsolute) == null ? void 0 : _a2.x) != null ? _b2 : 0) - nodeOrigin[0] * ((_c = node.width) != null ? _c : 0), y: ((_e = (_d = node.positionAbsolute) == null ? void 0 : _d.y) != null ? _e : 0) - nodeOrigin[1] * ((_f = node.height) != null ? _f : 0), width: node.width, height: node.height, style: node.style, className: nodeClassNameFunc(node), color: nodeColorFunc(node), borderRadius: nodeBorderRadius, strokeColor: nodeStrokeColorFunc(node), strokeWidth: nodeStrokeWidth, shapeRendering, onClick: onSvgNodeClick, id: node.id }, node.id);
  }), (0, import_jsx_runtime2.jsx)("path", { className: "react-flow__minimap-mask", d: `M${x - offset},${y - offset}h${width + offset * 2}v${height + offset * 2}h${-width - offset * 2}z
        M${viewBB.x},${viewBB.y}h${viewBB.width}v${viewBB.height}h${-viewBB.width}z`, fill: maskColor, fillRule: "evenodd", stroke: maskStrokeColor, strokeWidth: maskStrokeWidth })] }) });
}
MiniMap.displayName = "MiniMap";
var MiniMap$1 = (0, import_react3.memo)(MiniMap);

// node_modules/.deno/@reactflow+controls@11.0.5/node_modules/@reactflow/controls/dist/esm/index.js
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var import_react4 = __toESM(require_react());
function PlusIcon() {
  return (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 32", children: (0, import_jsx_runtime3.jsx)("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }) });
}
function MinusIcon() {
  return (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 5", children: (0, import_jsx_runtime3.jsx)("path", { d: "M0 0h32v4.2H0z" }) });
}
function FitViewIcon() {
  return (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 32 30", children: (0, import_jsx_runtime3.jsx)("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0027.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94c-.531 0-.939-.4-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }) });
}
function LockIcon() {
  return (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: (0, import_jsx_runtime3.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }) });
}
function UnlockIcon() {
  return (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 32", children: (0, import_jsx_runtime3.jsx)("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 000 13.714v15.238A3.056 3.056 0 003.048 32h18.285a3.056 3.056 0 003.048-3.048V13.714a3.056 3.056 0 00-3.048-3.047zM12.19 24.533a3.056 3.056 0 01-3.047-3.047 3.056 3.056 0 013.047-3.048 3.056 3.056 0 013.048 3.048 3.056 3.056 0 01-3.048 3.047z" }) });
}
var ControlButton = ({ children: children2, className, ...rest }) => (0, import_jsx_runtime3.jsx)("button", { type: "button", className: cc(["react-flow__controls-button", className]), ...rest, children: children2 });
ControlButton.displayName = "ControlButton";
var isInteractiveSelector = (s) => s.nodesDraggable && s.nodesConnectable && s.elementsSelectable;
var Controls = ({ style: style2, showZoom = true, showFitView = true, showInteractive = true, fitViewOptions, onZoomIn, onZoomOut, onFitView, onInteractiveChange, className, children: children2, position = "bottom-left" }) => {
  const store = useStoreApi();
  const [isVisible, setIsVisible] = (0, import_react4.useState)(false);
  const isInteractive = useStore2(isInteractiveSelector);
  const { zoomIn, zoomOut, fitView: fitView2 } = useReactFlow();
  (0, import_react4.useEffect)(() => {
    setIsVisible(true);
  }, []);
  if (!isVisible) {
    return null;
  }
  const onZoomInHandler = () => {
    zoomIn();
    onZoomIn == null ? void 0 : onZoomIn();
  };
  const onZoomOutHandler = () => {
    zoomOut();
    onZoomOut == null ? void 0 : onZoomOut();
  };
  const onFitViewHandler = () => {
    fitView2(fitViewOptions);
    onFitView == null ? void 0 : onFitView();
  };
  const onToggleInteractivity = () => {
    store.setState({
      nodesDraggable: !isInteractive,
      nodesConnectable: !isInteractive,
      elementsSelectable: !isInteractive
    });
    onInteractiveChange == null ? void 0 : onInteractiveChange(!isInteractive);
  };
  return (0, import_jsx_runtime3.jsxs)(Panel, { className: cc(["react-flow__controls", className]), position, style: style2, children: [showZoom && (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [(0, import_jsx_runtime3.jsx)(ControlButton, { onClick: onZoomInHandler, className: "react-flow__controls-zoomin", title: "zoom in", "aria-label": "zoom in", children: (0, import_jsx_runtime3.jsx)(PlusIcon, {}) }), (0, import_jsx_runtime3.jsx)(ControlButton, { onClick: onZoomOutHandler, className: "react-flow__controls-zoomout", title: "zoom out", "aria-label": "zoom out", children: (0, import_jsx_runtime3.jsx)(MinusIcon, {}) })] }), showFitView && (0, import_jsx_runtime3.jsx)(ControlButton, { className: "react-flow__controls-fitview", onClick: onFitViewHandler, title: "fit view", "aria-label": "fit view", children: (0, import_jsx_runtime3.jsx)(FitViewIcon, {}) }), showInteractive && (0, import_jsx_runtime3.jsx)(ControlButton, { className: "react-flow__controls-interactive", onClick: onToggleInteractivity, title: "toggle interactivity", "aria-label": "toggle interactivity", children: isInteractive ? (0, import_jsx_runtime3.jsx)(UnlockIcon, {}) : (0, import_jsx_runtime3.jsx)(LockIcon, {}) }), children2] });
};
Controls.displayName = "Controls";
var Controls$1 = (0, import_react4.memo)(Controls);

// node_modules/.deno/@reactflow+background@11.0.5/node_modules/@reactflow/background/dist/esm/index.js
var import_jsx_runtime4 = __toESM(require_jsx_runtime());
var import_react5 = __toESM(require_react());
var BackgroundVariant;
(function(BackgroundVariant2) {
  BackgroundVariant2["Lines"] = "lines";
  BackgroundVariant2["Dots"] = "dots";
  BackgroundVariant2["Cross"] = "cross";
})(BackgroundVariant || (BackgroundVariant = {}));
function LinePattern({ color: color2, dimensions, lineWidth }) {
  return (0, import_jsx_runtime4.jsx)("path", { stroke: color2, strokeWidth: lineWidth, d: `M${dimensions[0] / 2} 0 V${dimensions[1]} M0 ${dimensions[1] / 2} H${dimensions[0]}` });
}
function DotPattern({ color: color2, radius }) {
  return (0, import_jsx_runtime4.jsx)("circle", { cx: radius, cy: radius, r: radius, fill: color2 });
}
var defaultColor = {
  [BackgroundVariant.Dots]: "#91919a",
  [BackgroundVariant.Lines]: "#eee",
  [BackgroundVariant.Cross]: "#e2e2e2"
};
var defaultSize = {
  [BackgroundVariant.Dots]: 1,
  [BackgroundVariant.Lines]: 1,
  [BackgroundVariant.Cross]: 6
};
var selector3 = (s) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });
function Background({
  variant = BackgroundVariant.Dots,
  gap = 20,
  size,
  lineWidth = 1,
  color: color2,
  style: style2,
  className
}) {
  const ref = (0, import_react5.useRef)(null);
  const { transform: transform2, patternId } = useStore2(selector3, shallow);
  const patternColor = color2 || defaultColor[variant];
  const patternSize = size || defaultSize[variant];
  const isDots = variant === BackgroundVariant.Dots;
  const isCross = variant === BackgroundVariant.Cross;
  const gapXY = Array.isArray(gap) ? gap : [gap, gap];
  const scaledGap = [gapXY[0] * transform2[2] || 1, gapXY[1] * transform2[2] || 1];
  const scaledSize = patternSize * transform2[2];
  const patternDimensions = isCross ? [scaledSize, scaledSize] : scaledGap;
  const patternOffset = isDots ? [scaledSize / 2, scaledSize / 2] : [patternDimensions[0] / 2, patternDimensions[1] / 2];
  return (0, import_jsx_runtime4.jsxs)("svg", { className: cc(["react-flow__background", className]), style: {
    ...style2,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  }, ref, children: [(0, import_jsx_runtime4.jsx)("pattern", { id: patternId, x: transform2[0] % scaledGap[0], y: transform2[1] % scaledGap[1], width: scaledGap[0], height: scaledGap[1], patternUnits: "userSpaceOnUse", patternTransform: `translate(-${patternOffset[0]},-${patternOffset[1]})`, children: isDots ? (0, import_jsx_runtime4.jsx)(DotPattern, { color: patternColor, radius: scaledSize / 2 }) : (0, import_jsx_runtime4.jsx)(LinePattern, { dimensions: patternDimensions, color: patternColor, lineWidth }) }), (0, import_jsx_runtime4.jsx)("rect", { x: "0", y: "0", width: "100%", height: "100%", fill: `url(#${patternId})` })] });
}
Background.displayName = "Background";
var Background$1 = (0, import_react5.memo)(Background);

// node_modules/.deno/@reactflow+node-toolbar@1.0.0/node_modules/@reactflow/node-toolbar/dist/esm/index.js
var import_jsx_runtime5 = __toESM(require_jsx_runtime());
var import_react6 = __toESM(require_react());
var import_react_dom2 = __toESM(require_react_dom());
var selector4 = (state) => {
  var _a;
  return (_a = state.domNode) == null ? void 0 : _a.querySelector(".react-flow__renderer");
};
function NodeToolbarPortal({ children: children2 }) {
  const wrapperRef = useStore2(selector4);
  if (!wrapperRef) {
    return null;
  }
  return (0, import_react_dom2.createPortal)(children2, wrapperRef);
}
var nodeEqualityFn = (a, b) => {
  var _a, _b, _c, _d, _e, _f;
  return ((_a = a == null ? void 0 : a.positionAbsolute) == null ? void 0 : _a.x) === ((_b = b == null ? void 0 : b.positionAbsolute) == null ? void 0 : _b.x) && ((_c = a == null ? void 0 : a.positionAbsolute) == null ? void 0 : _c.y) === ((_d = b == null ? void 0 : b.positionAbsolute) == null ? void 0 : _d.y) && (a == null ? void 0 : a.width) === (b == null ? void 0 : b.width) && (a == null ? void 0 : a.height) === (b == null ? void 0 : b.height) && (a == null ? void 0 : a.selected) === (b == null ? void 0 : b.selected) && ((_e = a == null ? void 0 : a[internalsSymbol]) == null ? void 0 : _e.z) === ((_f = b == null ? void 0 : b[internalsSymbol]) == null ? void 0 : _f.z);
};
var storeSelector = (state) => ({
  transform: state.transform,
  nodeOrigin: state.nodeOrigin,
  selectedNodesCount: Array.from(state.nodeInternals.values()).filter((node) => node.selected).length
});
function getTransform(nodeRect, transform2, position, offset) {
  let xPos = (nodeRect.x + nodeRect.width / 2) * transform2[2] + transform2[0];
  let yPos = nodeRect.y * transform2[2] + transform2[1] - offset;
  let xShift = -50;
  let yShift = -100;
  switch (position) {
    case Position.Right:
      xPos = (nodeRect.x + nodeRect.width) * transform2[2] + transform2[0] + offset;
      yPos = (nodeRect.y + nodeRect.height / 2) * transform2[2] + transform2[1];
      xShift = 0;
      yShift = -50;
      break;
    case Position.Bottom:
      yPos = (nodeRect.y + nodeRect.height) * transform2[2] + transform2[1] + offset;
      yShift = 0;
      break;
    case Position.Left:
      xPos = nodeRect.x * transform2[2] + transform2[0] - offset;
      yPos = (nodeRect.y + nodeRect.height / 2) * transform2[2] + transform2[1];
      xShift = -100;
      yShift = -50;
      break;
  }
  return `translate(${xPos}px, ${yPos}px) translate(${xShift}%, ${yShift}%)`;
}
function NodeToolbar({ nodeId, children: children2, className, style: style2, isVisible, position = Position.Top, offset = 10, ...rest }) {
  var _a;
  const nodeSelector = (0, import_react6.useCallback)((state) => state.nodeInternals.get(nodeId), [nodeId]);
  const node = useStore2(nodeSelector, nodeEqualityFn);
  const { transform: transform2, nodeOrigin, selectedNodesCount } = useStore2(storeSelector, shallow);
  const isActive = typeof isVisible === "boolean" ? isVisible : (node == null ? void 0 : node.selected) && selectedNodesCount === 1;
  if (!isActive || !node) {
    return null;
  }
  const nodeRect = getRectOfNodes([node], nodeOrigin);
  const wrapperStyle2 = {
    position: "absolute",
    transform: getTransform(nodeRect, transform2, position, offset),
    zIndex: (((_a = node[internalsSymbol]) == null ? void 0 : _a.z) || 1) + 1,
    ...style2
  };
  return (0, import_jsx_runtime5.jsx)(NodeToolbarPortal, { children: (0, import_jsx_runtime5.jsx)("div", { style: wrapperStyle2, className: cc(["react-flow__node-toolbar", className]), ...rest, children: children2 }) });
}
export {
  Background$1 as Background,
  BackgroundVariant,
  BaseEdge,
  BezierEdge,
  ConnectionLineType,
  ConnectionMode,
  ControlButton,
  Controls$1 as Controls,
  EdgeLabelRenderer,
  EdgeText$1 as EdgeText,
  Handle$1 as Handle,
  MarkerType,
  MiniMap$1 as MiniMap,
  NodeToolbar,
  PanOnScrollMode,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  SimpleBezierEdge,
  SmoothStepEdge,
  StepEdge,
  StraightEdge,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  boxToRect,
  ReactFlow as default,
  getBezierPath,
  getBoundsOfRects,
  getConnectedEdges,
  getIncomers,
  getMarkerEnd,
  getOutgoers,
  getRectOfNodes,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  getTransformForBounds,
  internalsSymbol,
  isEdge,
  isNode,
  rectToBox,
  updateEdge,
  useEdges,
  useEdgesState,
  useKeyPress,
  useNodes,
  useNodesInitialized,
  useNodesState,
  useOnSelectionChange,
  useOnViewportChange,
  useReactFlow,
  useStore2 as useStore,
  useStoreApi,
  useUpdateNodeInternals,
  useViewport
};
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
//# sourceMappingURL=reactflow.js.map
