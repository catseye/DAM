/* dam-widgets.js version 0.0. This file is in the public domain. */

/* dam.js should be included before this source. */

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
  args[0] = { 'for': checkboxId }

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
        button.innerHTML = getLabel();
        innerContainer.style.display = isOpen ? "block" : "none";
      }
    }
  ]);

  return DAM.makeElem("div", [
    button,
    innerContainer
  ]);
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
  return DAM.makeElem('label', [title, select]);
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

  return DAM.makeElem('span', [DAM.makeElem('label', [title, slider]), textInput, decButton, incButton]);
};
