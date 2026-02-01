function curry(fn) {
  if (typeof fn !== "function") {
    throw Error("fn must be a Function");
  }
  const fnNeedArgs = fn.length;
  function curred(...args) {
    if (args.length >= fnNeedArgs) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curred.apply(this, [...args, ...nextArgs]);
    };
  }

  return curred;
}

function sum3(a, b, c) {
  return a + b + c;
}

const curriedSum3 = curry(sum3);

curriedSum3(1, 2, 3); // 6
curriedSum3(1)(2)(3); // 6
curriedSum3(1, 2)(3); // 6
curriedSum3(1)(2, 3); // 6
