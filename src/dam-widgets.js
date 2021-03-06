/* dam-widgets.js version 0.2. This file is in the public domain. */

/* if you want to use this file in an ES5 context, either remove the following line
   and ensure dam.js has already been loaded, or just use `dam-plus-widgets-web.js`
   instead of this file, it's probably easier to do that, just do that instead. */

import DAM from './dam.js'

/*
 * A labelled checkbox, where the checkbox appears to the left of the label.
 * Arguments after the first (config) argument will be applied to the label element.
 */
function makeCheckbox(config) {
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
function makePanel(config) {
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
function makeSelect(config) {
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
function makeRange(config) {
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
        if (!isNaN(v) && v >= min_ && v <= max_) {
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

  var range = DAM.makeElem('span', [
    { 'class': "dam-widget dam-range" },
    DAM.makeElem('label', [title, slider]),
    textInput,
    decButton,
    incButton
  ]);
  range.setValue = function(v) {
    if (!isNaN(v) && v >= min_ && v <= max_) {
      textInput.value = "" + v;
      slider.value = "" + v;
      onchange(v);
    }
  };
  return range;
};

if (typeof module !== 'undefined') module.exports = {
    'makeCheckbox': makeCheckbox,
    'makePanel': makePanel,
    'makeSelect': makeSelect,
    'makeRange': makeRange
};
