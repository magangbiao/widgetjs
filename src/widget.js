// Base for all widgets. A widget uses a HTML canvas (see [htmlCanvas.js](htmlCanvas.html)) to render itself using `renderContentOn()`.
//
// _Usage:_
//
//      var titleWidget = function(spec) {
//          var that = widget(spec);
//
//          var title = spec.title;
//
//          that.renderContentOn = function(html) {
//              html.h1('Hello World')
//          }
//          return that;
//      }
//
//      var helloWorldWidget = titleWidget({title: 'Hello Widget!'});
//
//      $(document).ready(function() {
//          helloWorldWidget.appendTo('BODY');
//      });
//
// Widgets can also be rendered on a HTML canvas (since widget implements `appendToBrush()`). Eg.
//
//      html.div(helloWorldWidget)
//
// It is therefor easy to compose widgets from other widgets.
//
// _Note:_ Widgets composed by other widgets must
// expose sub widgets using `widgets()` to make it possible to traverse widget tree.
//


define(
    [
        './widget-extensions',
        './router',
        './events',
        './htmlCanvas',
        'jquery'
    ],

    function (ext, router, events, htmlCanvas, jQuery) {

        // - - -

        // ### Widget
        // _Usage:_
        //
        //      widget();
        //      widget({ id : 'unique_identifier'});
        //
        var widget = function (spec, my) {
            my = my || {};
            spec = spec || {};

            var that = {};

            // Unique **widget id**. Provided by id argument or auto generated.
            var id = spec.id || idGenerator.newId();

            // #### Public/Protected API

            // **Mix in Events** (See [events.js](events.html))
            //
            // Trigger events using:
            //
            //      that.trigger('event_id', event_data)
            //
            // Listen for events:
            //
            //      that.on('event_id', function(event_data) { });
            //
            // or more commonly:
            //
            //      var w = widget();
            //      w.on('event_id', function(event_data) { });
            //
            jQuery.extend(that, events.eventhandler());

            // **Third party protected extensions** added to `my`.
            // See [widget-extensions.js](widget-extensions.html)
            for (var extProperty in ext) {
                if (ext.hasOwnProperty(extProperty)) {
                    my[extProperty] = ext[extProperty];
                }
            }

            // Returns sub widgets of the widget. Needed
            // to traverse widget tree. Override in concrete widgets!
            that.widgets = function () {
                return [];
            };
           
            // Expose widget id
            that.getId = function () {
                return id;
            };
            that.id = function () {
                return id;
            };

            
            // #### Route / Controller extensions

            // Returns link to route/path
            my.linkTo = function (path) {
                return router.router.linkTo(path);
            };

            // Redirects to route/path
            my.redirectTo = function (path) {
                router.router.redirectTo(path);
            };

            
            // #### Render extensions

            // Append widget to DOM-element matched by aJQuery
            that.appendTo = function (aJQuery) {
                that.renderOn(htmlCanvas(aJQuery));
            };

            // Same as `that.appendTo()` except it first empties the element.
            that.replace = function (aJQuery) {
                var canvas = htmlCanvas(aJQuery);
                canvas.root.asJQuery().empty();
                that.renderOn(canvas);
            };

            // Implemention for `appendToBrush()` to allow a widget to be
            // appended to a brush. See [htmlCanvas.js](htmlCanvas.html).
            //
            // Basicly it allows us to do:
            //
            //      html.div(widget);
            //
            that.appendToBrush = function (aTagBrush) {
                that.appendTo(aTagBrush.asJQuery());
            };

            // Return JQuery that match root element (div).
            that.asJQuery = function () {
                return jQuery('#' + that.getId());
            };

            // #### Update support
            // makes it possible to do `widget.update()` to re-render widget.
            //
            // `renderOn()` wrapps content rendered by `renderContentOn()` inside a
            // root element rendered by `renderRootOn`.
            //
            // `update()` empties the root element and re-render content using `renderContentOn()`
            //
            // If you decide to override `renderOn()` you should also override `isRendered` and `update()`.
            // Also override `asJQuery()` if the root elements id is not the widget id.
            //

            // True if widget have rendered content.
            that.isRendered = function () {
                return that.asJQuery().length > 0;
            };

            // Renders a wrapper/root for widget - a div as default
            my.renderRootOn = function (html) {
                return html.div().id(id);
            };

            // Renders the acctual content inside the wrapper div. Override in concrete widgets!
            that.renderContentOn = function (html) {
            };

            // Renders widget by wrapping `renderContentOn()` in a root element.
            that.renderOn = function (html) {
                my.renderRootOn(html).render(that.renderContentOn);
            };

            // `update()` is a general purpose function that will re-render the widget
            // completely inside its root div.
            that.update = function () {
                if (!that.isRendered()) {
                    return;
                }

                // clear content of root
                that.asJQuery().empty();

                // re-render content on root
                var html = htmlCanvas(that.asJQuery());
                that.renderContentOn(html);
            };

            return that;
        };

        // - - -

        // ### idGenerator
        // Creates unique ids used by widgets to identify their root div.
        var idGenerator = (function () {
            var that = {};
            var id = 0;

            that.newId = function () {
                id += 1;
                return id.toString();
            };

            return that;
        })();


        // ### Exports
        // widget function
        return widget;
    }
);