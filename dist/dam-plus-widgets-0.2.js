(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _dam = _interopRequireDefault(require("./dam.js"));

var _damWidgets = require("./dam-widgets.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* dam-plus-widgets.js version 0.2. This file is in the public domain. */
window.DAM = _dam["default"];
_dam["default"].makeCheckbox = _damWidgets.makeCheckbox;
_dam["default"].makePanel = _damWidgets.makePanel;
_dam["default"].makeSelect = _damWidgets.makeSelect;
_dam["default"].makeRange = _damWidgets.makeRange;

},{"./dam-widgets.js":2,"./dam.js":3}],2:[function(require,module,exports){
"use strict";

var _dam = _interopRequireDefault(require("./dam.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* dam-widgets.js version 0.2. This file is in the public domain. */

/* if you want to use this file in an ES5 context, either remove the following line
   and ensure dam.js has already been loaded, or just use `dam-plus-widgets-web.js`
   instead of this file, it's probably easier to do that, just do that instead. */

/*
 * A labelled checkbox, where the checkbox appears to the left of the label.
 * Arguments after the first (config) argument will be applied to the label element.
 */
function makeCheckbox(config) {
  if (typeof _dam["default"].makeCheckboxCounter === 'undefined') _dam["default"].makeCheckboxCounter = 0;
  var checkboxId = 'cfzzzb_' + _dam["default"].makeCheckboxCounter++;

  var _onchange = config.onchange || function (b) {}; // config label: make copy of arguments, replace first with a bespoke config


  var args = new Array(arguments.length);

  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  args[0] = {
    'for': checkboxId,
    'class': "dam-widget dam-checkbox"
  };
  return _dam["default"].makeElem('span', [_dam["default"].makeElem('input', [{
    type: 'checkbox',
    id: checkboxId,
    onchange: function onchange(e) {
      _onchange(e.target.checked);
    }
  }, config.checkboxAttrs || {}]), _dam["default"].makeElem('label', args)]);
}

;
/*
 * A collapsible panel.
 * Arguments after the first (config) argument will be applied to the inner container div element.
 */

function makePanel(config) {
  var isOpen = !!config.isOpen;
  var title = config.title || "";

  function getLabel() {
    return (isOpen ? "∇" : "⊳") + " " + title;
  } // config inner container


  var args = new Array(arguments.length);

  for (var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }

  args[0] = {};

  var innerContainer = _dam["default"].makeElem('div', args);

  innerContainer.style.display = isOpen ? "block" : "none";

  var button = _dam["default"].makeElem('button', [getLabel(), {
    onclick: function onclick(e) {
      isOpen = !isOpen;
      button.textContent = getLabel();
      innerContainer.style.display = isOpen ? "block" : "none";
    }
  }]);

  return _dam["default"].makeElem("div", [{
    'class': "dam-widget dam-panel"
  }, button, innerContainer]);
}

;
/*
 * A select dropdown.
 */

function makeSelect(config) {
  var title = config.title || "";
  var options = config.options || [];

  var onchange = config.onchange || function (v) {};

  var select = _dam["default"].makeElem('select');

  for (var i = 0; i < options.length; i++) {
    var op = _dam["default"].makeElem('option');

    op.value = options[i].value;
    op.text = options[i].text;
    op.selected = !!options[i].selected;
    select.options.add(op);
  }

  select.addEventListener('change', function (e) {
    onchange(options[select.selectedIndex]);
  });
  return _dam["default"].makeElem('label', [{
    'class': "dam-widget dam-select"
  }, title, select]);
}

;
/*
 * A range control.
 */

function makeRange(config) {
  var title = config.title || "";
  var min_ = config['min'];
  var max_ = config['max'];
  var value = config.value || min_;

  var _onchange2 = config.onchange || function (v) {};

  var textInputSize = config.textInputSize || 5;
  var textInput;
  var slider;
  slider = _dam["default"].makeElem('input', [{
    type: "range",
    min: min_,
    max: max_,
    value: value,
    onchange: function onchange(e) {
      var v = parseInt(slider.value, 10);

      if (!isNaN(v) && v >= min_ && v <= max_) {
        textInput.value = "" + v;

        _onchange2(v);
      }
    }
  }]);
  textInput = _dam["default"].makeElem('input', [{
    size: "" + textInputSize,
    value: "" + value,
    onchange: function onchange(e) {
      var v = parseInt(textInput.value, 10);

      if (!isNaN(v) && v >= min_ && v <= max_) {
        slider.value = "" + v;

        _onchange2(v);
      }
    }
  }]);

  var incButton = _dam["default"].makeElem('button', ['+', {
    onclick: function onclick(e) {
      var v = parseInt(textInput.value, 10);

      if (!isNaN(v) && v < max_) {
        v++;
        textInput.value = "" + v;
        slider.value = "" + v;

        _onchange2(v);
      }
    }
  }]);

  var decButton = _dam["default"].makeElem('button', ['-', {
    onclick: function onclick(e) {
      var v = parseInt(textInput.value, 10);

      if (!isNaN(v) && v > min_) {
        v--;
        textInput.value = "" + v;
        slider.value = "" + v;

        _onchange2(v);
      }
    }
  }]);

  var range = _dam["default"].makeElem('span', [{
    'class': "dam-widget dam-range"
  }, _dam["default"].makeElem('label', [title, slider]), textInput, decButton, incButton]);

  range.setValue = function (v) {
    if (!isNaN(v) && v >= min_ && v <= max_) {
      textInput.value = "" + v;
      slider.value = "" + v;

      _onchange2(v);
    }
  };

  return range;
}

;
if (typeof module !== 'undefined') module.exports = {
  'makeCheckbox': makeCheckbox,
  'makePanel': makePanel,
  'makeSelect': makeSelect,
  'makeRange': makeRange
};

},{"./dam.js":3}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* dam.js version 0.2. This file is in the public domain. */
(function () {
  var DAM = {};

  DAM.makeElem = function (tag, args) {
    args = args || [];
    var elem = document.createElement(tag);

    for (var i = 0; i < args.length; i++) {
      var arg = args[i];

      if (arg instanceof Element) {
        elem.appendChild(arg);
      } else if (typeof arg === 'string' || arg instanceof String) {
        elem.appendChild(document.createTextNode(arg));
      } else if (_typeof(arg) === 'object' && arg !== null) {
        Object.keys(arg).forEach(function (key) {
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

  DAM.maker = function (tag) {
    return function () {
      return DAM.makeElem(tag, arguments);
    };
  };

  if (typeof module !== 'undefined') {
    module.exports = DAM;
  } else if (typeof window !== 'undefined') {
    window.DAM = DAM;
  }
})();

},{}]},{},[1]);
