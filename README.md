DAM
===

You've tried the Document Object Model, now try the Document *Awesome* Model!

(FIXME TODO put twee picture of cartoon beaver mascot here)

What is this
------------

**DAM** is a tiny library for creating bits of an HTML5 document.
(I'd say "for creating UIs" but that may be overstating it a tad.)
It's written in ES5 Javascript (so it can be used directly by most
modern web browsers) and it's about 1K in size (uncompressed).

*NOTE: this is version 0.0: everything is subject to change*

Basic usage
-----------

Basically you can use it like this:

    <script src="dam.js"></script>
    <script>
      var div=DAM.maker('div'), p=DAM.maker('p'), span=DAM.maker('span'), button=DAM.maker('button');
      var d = div(
        p(
          "Hello, ", span("world"), "."
        ),
        button({ onclick: function(e) { alert(e); } }, "Alert!")
      );
      document.getElementById('container').appendChild(d);
    </script>

`DAM.maker` is a function that takes a tag string and returns a function that
creates and returns a DOM Element with that tag.

The returned function also takes any number of arguments.  Each argument
influences the DOM Element that is created:

*   A string argument will create a child text node inside the Element.
*   A DOM Element argument will insert that Element as a child of the Element.
*   A `null` or `undefined` argument will be ignored.
*   A plain Javascript object argument will configure the created Element;
    each key in the object sets one attribute of the created Element.
    In this case, some keys and values are treated specially:
    *   Keys must always be strings.
    *   A key that starts with `on` will set up an event handler.
    *   A `null` value will unset the attribute.

Widgets
-------

If you have a pattern of elements that you create over and over, you can
package that up in a function that creates those elements.  DAM calls this
package a _widget_, and the function that creates it a _widget maker_.
The names of DAM widget makers usually begin with `make`.

A simple example based on the code above:

    <script src="dam.js"></script>
    <script>
      var div=DAM.maker('div'), p=DAM.maker('p'), span=DAM.maker('span'), button=DAM.maker('button');
      function makeGreeting(config) {
        return div(
          p(
            "Hello, ", span(config.who), "."
          ),
          button({ onclick: function(e) { alert(e); } }, "Alert!")
        );
      )
      var greets = div(
        makeGreeting({ who: "world" }),
        makeGreeting({ who: "Earthlings" }),
        makeGreeting({ who: "there" })
      );
      document.getElementById('container').appendChild(greets);
    </script>

By convention, the first argument of a widget maker is a configuration
object which configures the widget; it is completely widget-specific.

If the widget supports it, the remaining arguments will then be applied to
the widget, in the same manner as the arguments passed to the function
returned by `DAM.maker` are applied to the new element it creates.

If the widget is a "container widget" then it should definitely support this,
as a means of letting the caller add children to the widget.

"Applied to the widget" might mean "applied to one of the elements of the
widget", if the widget is composed of several elements.

### Supplied widget library

`dam-widgets.js` defines a number of widgets built on top of DAM.  Having
these widgets readily available so that I could re-use them across my projects
is one of the main reasons I bothered to put this DAM thing together.  All
the same, you can just treat these as examples or starting points for new widgets.

*   [Checkbox widget](demo/checkbox.html)
*   [Panel widget](demo/panel.html)
*   [Select widget](demo/select.html)
*   [Range widget](demo/range.html)

### Advanced widget creation

The function returned by `DAM.maker` is simply `DAM.makeElem` with some
arguments pre-set and transformed.  The tag passed to `DAM.maker` is passed
as the first argument to `DAM.makeElem`, and the argument list received by
the function returned by `DAM.maker` is passed as the second argument to
`DAM.makeElem`, as a plain Javascript array.

But `DAM.makeElem` can be called directly, and calling it directly allows
more explicit access to its arguments.  Thus it is often called directly in
widget makers.

Some projects DAM is used in
----------------------------

*   [Cyclobots](https://catseye.tc/installation/Cyclobots)
*   [Chzrxl](https://catseye.tc/installation/Chzrxl)
*   [Maze Clouds](https://catseye.tc/installation/Maze_Clouds)

Related work
------------

You can think of DAM as something like [hyperscript][] except:

*   It has [hyperscript-helpers][] built-in (sort of)
*   It has no dependencies
*   It doesn't try to parse what you want (you have spell out what you want)
*   It doesn't make as many promises about what it can do
*   It doesn't have an ecosystem, only a convention for widget makers
*   It's in the public domain

I was only peripherally aware of hyperscript when I wrote this; any
similarities are probably because certain solutions (such as setting
attributes from an object) are "obvious".  (But I saw no need for e.g.
`htmlFor` when you can just put `'for'` in single quotes...)

[hyperscript]: https://github.com/hyperhype/hyperscript
[hyperscript-helpers]: https://github.com/ohanhi/hyperscript-helpers

TODO
----

Function to set the value of a DAM range control in an orderly fashion
