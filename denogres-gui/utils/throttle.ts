// basic function to create throttled version of CRUD handlers
// can use deno lodash or other option if compat can be resolved
export default (f: any, t: number): any => {
  let throttled = false;
  return () => {
    if (throttled) {
      return;
    }
    throttled = true;
    f();
    setTimeout(() => {
      throttled = false;
    }, t);
  }
};