/* dam.js version 0.1. This file is in the public domain. */

(function() {
  var DAM = {};
  DAM.makeElem = function(tag, args) {
    args = args || [];
    var elem = document.createElement(tag);
    for (var i = 0; i < args.length; i++) {
      var arg = args[i];
      if (arg instanceof Element) {
        elem.appendChild(arg);
      } else if (typeof arg === 'string' || arg instanceof String) {
        elem.appendChild(document.createTextNode(arg));
      } else if (typeof arg === 'object' && arg !== null) {
        Object.keys(arg).forEach(function(key) {
          if (key.substring(0, 2) === 'on') {
            elem.addEventListener(key.substring(2), arg[key]);
          } else if (arg[key] === null) {
            elem.removeAttribute(key);
          } else {
            elem.setAttribute(key, arg[key]);
          }
        });
      } else {
        console.log(arg);
      }
    }
    return elem;
  };
  DAM.maker = function(tag) {
    return function() {
      return DAM.makeElem(tag, arguments);
    };
  };
  if (typeof module !== 'undefined') {
    module.exports = DAM;
  } else if (typeof window !== 'undefined') {
    window.DAM = DAM;
  }
})();
