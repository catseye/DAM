/* dam-plus-widgets-web.js version 0.1. This file is in the public domain. */

/* This file is recommended if you just want to use DAM and its standard
   widget library on an HTML page without bothering with JS build stuff.
   It consists of dam.js followed by dam-widgets.js, both with only small
   hand modifications to make them load as-is in ES5. */

var DAM = (function() {
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
  return DAM;
})();

(function(DAM) { // ENTER-SCOPE

/*
 * A labelled checkbox, where the checkbox appears to the left of the label.
 * Arguments after the first (config) argument will be applied to the label element.
 */
DAM.makeCheckbox = function(config) {
  if (typeof DAM.makeCheckboxCounter === 'undefined') DAM.makeCheckboxCounter = 0;
  var checkboxId = 'cfzzzb_' + (DAM.makeCheckboxCounter++);

  var onchange = config.onchange || function(b) {};

  // config label: make copy of arguments, replace first with a bespoke config
  var args = new Array(arguments.length);
  for(var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  args[0] = { 'for': checkboxId, 'class': "dam-widget dam-checkbox" }

  return DAM.makeElem('span', [
    DAM.makeElem('input', [
      {
        type: 'checkbox',
        id: checkboxId,
        onchange: function(e) {
          onchange(e.target.checked);
        }
      },
      config.checkboxAttrs || {}
    ]),
    DAM.makeElem('label', args)
  ]);
};

/*
 * A collapsible panel.
 * Arguments after the first (config) argument will be applied to the inner container div element.
 */
DAM.makePanel = function(config) {
  var isOpen = !!(config.isOpen);
  var title = config.title || "";

  function getLabel() {
    return (isOpen ? "∇" : "⊳") + " " + title;
  }

  // config inner container
  var args = new Array(arguments.length);
  for(var i = 0; i < args.length; ++i) {
    args[i] = arguments[i];
  }
  args[0] = {}

  var innerContainer = DAM.makeElem('div', args);
  innerContainer.style.display = isOpen ? "block" : "none";

  var button = DAM.makeElem('button', [
    getLabel(),
    {
      onclick: function(e) {
        isOpen = !isOpen;
        button.textContent = getLabel();
        innerContainer.style.display = isOpen ? "block" : "none";
      }
    }
  ]);

  return DAM.makeElem("div", [{ 'class': "dam-widget dam-panel" }, button, innerContainer]);
};

/*
 * A select dropdown.
 */
DAM.makeSelect = function(config) {
  var title = config.title || "";
  var options = config.options || [];
  var onchange = config.onchange || function(v) {};

  var select = DAM.makeElem('select');
  for (var i = 0; i < options.length; i++) {
    var op = DAM.makeElem('option');
    op.value = options[i].value;
    op.text = options[i].text;
    op.selected = !!(options[i].selected);
    select.options.add(op);
  }
  select.addEventListener('change', function(e) {
    onchange(options[select.selectedIndex]);
  });
  return DAM.makeElem('label', [{ 'class': "dam-widget dam-select" }, title, select]);
};

/*
 * A range control.
 */
DAM.makeRange = function(config) {
  var title = config.title || "";
  var min_ = config['min'];
  var max_ = config['max'];
  var value = config.value || min_;
  var onchange = config.onchange || function(v) {};
  var textInputSize = config.textInputSize || 5;

  var textInput; var slider;

  slider = DAM.makeElem('input', [
    {
      type: "range", min: min_, max: max_, value: value,
      onchange: function(e) {
        var v = parseInt(slider.value, 10);
        if (!isNaN(v)) {
          textInput.value = "" + v;
          onchange(v);
        }
      }
    }
  ]);

  textInput = DAM.makeElem('input', [
    {
      size: "" + textInputSize,
      value: "" + value,
      onchange: function(e) {
        var v = parseInt(textInput.value, 10);
        if (!isNaN(v) && v >= min_ && v <= max_) {
          slider.value = "" + v;
          onchange(v);
        }
      }
    }
  ]);

  var incButton = DAM.makeElem('button', ['+',
    {
      onclick: function(e) {
        var v = parseInt(textInput.value, 10);
        if ((!isNaN(v)) && v < max_) {
          v++;
          textInput.value = "" + v;
          slider.value = "" + v;
          onchange(v);
        }
      }
    }
  ]);

  var decButton = DAM.makeElem('button', ['-',
    {
      onclick: function(e) {
        var v = parseInt(textInput.value, 10);
        if ((!isNaN(v)) && v > min_) {
          v--;
          textInput.value = "" + v;
          slider.value = "" + v;
          onchange(v);
        }
      }
    }
  ]);

  return DAM.makeElem('span', [{ 'class': "dam-widget dam-range" }, DAM.makeElem('label', [title, slider]), textInput, decButton, incButton]);
};

})(DAM); // EXIT-SCOPE

if (typeof module !== 'undefined') module.exports = DAM;
