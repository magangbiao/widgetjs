define(["widgetjs/htmlCanvas", "jquery", "chai"], function(htmlCanvas, jQuery, chai) {

    var assert = chai.assert;

    // Helper

    var withCanvas = function(callback) {
        $("BODY").append("<div id=\"sandbox\"></div>");
        var sandbox = jQuery("#sandbox");

        var html = htmlCanvas(sandbox);
        callback(html);

        sandbox.remove();
    };

    suite("htmlCanvas");

    test("htmlCanvas library", function() {
        assert.ok(htmlCanvas, "exported correcly.");
    });

    test("can be created on a jQuery", function() {
        // Arrange: a canvas on BODY
        var html = htmlCanvas("BODY");

        // Assert that:
        assert.ok(html, "canvas was created");
        assert.ok(html.root, "have a root");
        assert.ok(html.root.element(), "have an element");
        assert.ok($("BODY").is(html.root.element()), "element is BODY.");
    });

    test("throws exception if jQuery dont match element", function() {
        assert.throws(
            function() { htmlCanvas("#notfound"); },
            Error,
            "htmlTagBrush requires an element",
            "throws exception if no matching element"
        );
    });

    test("can render HTML tags", function() {
        withCanvas(function(html) {
            // Arrange: a Hello World! H1
            html.h1("Hello World!");

            // Assert: that H1 was rendered
            var h1El = jQuery("#sandbox > H1");
            assert.ok(h1El.get(0), "element rendered");

            // and class was set
            assert.equal(h1El.text(), "Hello World!", "text rendered");
        });
    });

    test("standard attributes are supported", function() {
        withCanvas(function(html) {
            // Arrange: a Google link
            html.a("Google").id("test_id").href("http://www.google.se");

            // Assert: that A was rendered
            var linkEl = jQuery("#test_id");
            assert.ok(linkEl.get(0), "element rendered");

            // and href was set
            assert.equal(linkEl.attr("href"), "http://www.google.se", "href attribute rendered");
        });
    });

    test("render object literal attributes", function() {
        withCanvas(function(html) {
            // Arrange: a div with attributes
            html.div({id: "test_div", klass : "test_class", "special_attribute" : "test"}, "content");

            // Assert: that DIV was rendered
            var divEl = jQuery("#test_div");
            assert.ok(divEl.get(0), "element rendered");

            // and class was set
            assert.equal(divEl.attr("class"), "test_class", "attribute class rendered");

            // and class was set
            assert.ok(divEl.is("[special_attribute]"), "attribute special_attribute rendered");
        });
    });

    test("can omit attributes", function() {
        withCanvas(function(html) {
            // Arrange: a div with attributes
            html.div({id: "test_div", "special_attribute" : html.omit()}, "content");

            // Assert: that DIV was rendered
            var divEl = jQuery("#test_div");
            assert.ok(divEl.get(0), "element rendered");

            // and class was set
            assert.ok(!divEl.is("[special_attribute]"), "attribute special_attribute not rendered");
        });
    });

    test("callbacks can be attached to events", function() {
        withCanvas(function(html) {
            var clicked = false;

            // Arrange: a link with a click callback
            html.a({
					id: "test_link",
					click: function() { clicked = true; }
				},
				"Click me!"
			);

            // Assert: that link was rendered
            var linkEl = jQuery("#test_link");
            assert.ok(linkEl.get(0), "element rendered");

            // and click triggers callback
            linkEl.click(); // execute click
            assert.equal(clicked, true, "click callback executed");
        });
    });

	test("callbacks can be attached using attributes", function() {
		withCanvas(function(html) {
			var clicked = false;

			// Arrange: a link with a click callback
			html.a("Click me!").id("test_link").click(function() { clicked = true; });

			// Assert: that link was rendered
			var linkEl = jQuery("#test_link");
			assert.ok(linkEl.get(0), "element rendered");

			// and click triggers callback
			linkEl.click(); // execute click
			assert.equal(clicked, true, "click callback executed");
		});
	});


	test("tags can be nested", function() {
        withCanvas(function(html) {
            // Arrange: a inner and outer div with a span as inner child
            html.div({"id" : "outer_div"},
                html.div({"id" : "inner_div"},
                    html.span("Some text")
                )
            );

            // Assert: that outer div rendered
            assert.ok(jQuery("#outer_div").get(0), "outer div rendered");
            assert.ok(jQuery("#inner_div").get(0), "inner div rendered");
            assert.ok(jQuery("#inner_div > SPAN").get(0), "inner SPAN rendered");
        });
    });

    test("can omit nested tags", function() {
        withCanvas(function(html) {
            // Arrange: a inner and outer div with a span as inner child
            // where the child is omited based on a flag
            var hasSomeText = false;
            html.div({"id" : "outer_div"},
                html.div({"id" : "inner_div"},
                    hasSomeText ? html.span("Some text") : html.omit()
                )
            );

            // Assert: that outer div rendered
            assert.ok(jQuery("#outer_div").get(0), "outer div rendered");
            assert.ok(jQuery("#inner_div").get(0), "inner div rendered");
            assert.ok(!jQuery("#inner_div > SPAN").get(0), "inner SPAN not rendered");
        });
    });

    test("parts can be assigned to variables", function() {
        withCanvas(function(html) {
            // Arrange a button, assign to variable and then set class
            var button = html.a("Home").id("test_button").href("/");
            button.addClass("button");

            // Assert:
            assert.ok(jQuery("#test_button").get(0), "button rendered");
            assert.equal(jQuery("#test_button").attr("class"), "button", "attribute class rendered");
        });
    });

    test("render() can append objects to brush", function() {
        withCanvas(function(html) {
            // Arrange: a DIV
            var div = html.div().id("aDiv");

            // Act: render a SPAN in it
            div.render(html.span("test").addClass("aSpan"));


            // Assert:
            assert.ok(jQuery("#aDiv > .aSpan").get(0), "SPAN rendered inside DIV");
        });
    });


    test("can render arrays", function() {
        withCanvas(function(html) {
            // Arrange a div with10 sub span supplied to DIV as an array
            var div = html.div($.map([1,2,3,4,5,6,7,8,9,10], function(num) {
                return html.span(num.toString());
            })).id("test_div");

            // Assert:
            assert.equal(jQuery("#test_div > SPAN").length, 10, "div rendered with children from array");

        });
    });

    test("can render several objects using html.render", function() {
        withCanvas(function(html) {
            // Arrange
            var div = html.div(function(html) {
				html.render(html.span("hello"), html.span("world"));
			}).id("test_div");

            // Assert:
            assert.equal(jQuery("#test_div > SPAN").length, 2, "div rendered with children from arguments");

        });
    });


    test("throws error if object to append is null or undefined", function () {
        withCanvas(function(html) {
            assert.throws(
                function() { html.render(null); },
                Error,
                "cannot append null or undefined to brush",
                "throws error if null"
            );
            assert.throws(
                function() { html.render(undefined); },
                Error,
                "cannot append null or undefined to brush",
                "throws error if undefined"
            );
        });
    });

    test("can render with html function", function() {
        withCanvas(function(html) {
            // Arrange a function that take a canvas as argument.
            var htmlFn = function(html2) {
                html2.span("Test").addClass("aSpan");
            };

            // and render a DIV with function as argument
            html.div({id : "aDiv"}, htmlFn);

            // Assert
            assert.ok(jQuery("#aDiv").get(0), "div was rendered");
            assert.ok(jQuery("#aDiv > .aSpan").get(0), "child div from function was rendered inside div");
        });
    });

    test("delegates rendering to objects implementing appendToBrush()", function() {
        withCanvas(function(html) {
            var appendableObject = function() {
                var that = {};

                that.appendToBrush = function(aTagBrush) {
                    aTagBrush.render("content");
                };

                return that;
            };

            // Act: render object
            html.render(appendableObject());

            // Assert
            assert.equal(jQuery("#sandbox").html(), "content",  "div was rendered");
        });
    });

    test("delegates rendering to objects implementing appendToBrush()", function() {
        withCanvas(function(html) {
            var appendableObject = function() {
                var that = {};

                that.appendToBrush = function(aTagBrush) {
                    aTagBrush.render("content");
                };

                return that;
            };

            // Act: render object
            html.render(appendableObject());

            // Assert
            assert.equal(jQuery("#sandbox").html(), "content",  "div was rendered");
        });
    });

    test("rendering html strings not allowed by default", function() {
        withCanvas(function(html) {
			// Arrange:
			var htmlString = "<div id=\"unescaped\">foo</div>";

            // Act: render the string
			var result = html.render(htmlString);

            // Assert
            assert.notOk(jQuery("#unescaped").get(0), "div was not injected");
		});
    });

    test("rendering of strings is escaped ", function() {
        withCanvas(function(html) {
			// Arrange:
			var htmlString = "<>&foo";

            // Act: render the string
			var result = html.render(htmlString);

            // Assert
            assert.equal(jQuery("#sandbox").html(), "&lt;&gt;&amp;foo", "content was escaped");
		});
    });

    test("rendering using `html()` does not escape ", function() {
        withCanvas(function(html) {
			// Arrange:
			var htmlString = "<div>hello</div>";

            // Act: render the string
			var result = html.div({id: "not-escaped"}).html(htmlString);

            // Assert
            assert.equal(jQuery("#not-escaped").html(), htmlString, "content was not escaped");
		});
    });


    test("element() returns brush element", function() {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id("aHeading");

            // Assert
            assert.equal(h1.element(), jQuery("#aHeading").get(0), "element acessor returns correct element.");
        });
    });


    test("setAttribute() get/set style using key/value", function () {
        withCanvas(function(html) {
            // Arrange: a heading with id
            var h1 = html.h1().setAttribute("id", "aHeading");

            // Assert: id set
            assert.equal(h1.asJQuery().attr("id"), ("aHeading"), "attribute set");
        });
    });


    test("css() get/set style", function () {
        withCanvas(function(html) {
            // Arrange: a div
            var div = html.div();

            div.css("width", "100px");
            assert.equal(div.asJQuery().css("width"), "100px");
        });
    });

    test("attr() get/set style", function () {
        withCanvas(function(html) {
            // Arrange: a heading with id (set using map)
            var h1 = html.h1().attr({id : "aHeading"});

            // Assert: that id is set
            assert.equal(h1.asJQuery().attr("id"), "aHeading", "attribute set");
        });
    });

    test("addClass()/removeClass() add/remove class", function () {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id("aHeading");

            // addClass()
            h1.addClass("foo");
            assert.ok(h1.asJQuery().hasClass("foo"));

            // removeClass()
            h1.removeClass("foo");
            assert.ok(!h1.asJQuery().hasClass("foo"));
        });
    });

    test("asJQuery() returns jQuery that match brush element", function() {
        withCanvas(function(html) {
            // Arrange: a heading
            var h1 = html.h1().id("aHeading");

            // Assert
            assert.equal(h1.asJQuery().get(0), jQuery("#aHeading").get(0), "asJQuery() acessor returns hquery that match element.");
        });
    });


    //TODO: allow or throw exception?
    test("can render almost everything", function () {
        withCanvas(function(html) {
            html.render(0); // toString()
            html.render(3.14159265359); // toString()
            html.render("<div>test</div>"); // => DIV element
            html.render(true); // => nothing
            html.render(false); // => nothing
            html.render({}); // as attributes but since it have no keys => nothing
            html.render([]); // as array but since empty => nothing

            assert.ok(true);
        });
    });
});
