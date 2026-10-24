// Generic no-op stand-in for native-only packages (test environment only).
// Every named export is a no-op function component; `default` is the same.
const Stub = function NativeStub() { return null; };
module.exports = new Proxy(Stub, {
  get(target, key) {
    if (key === '__esModule') return true;
    if (key === 'then') return undefined;
    if (key === 'default') return Stub;
    if (key in target) return target[key];
    return Stub;
  },
});
