define(["src/events"], function(events) {
	describe("events", function() {

		it("Bind callback to event", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback
			anEvent(spy);

			// and execute
			anEvent.trigger();

			// Assert
			expect(spy).toHaveBeenCalled();
		});

		it("Bind multiple callbacks to an event", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind two callbacks and trigger event
			anEvent(spy);
			anEvent(spy);

			anEvent.trigger();

			// Assert: that both where executed
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it("Trigger pass values to callbacks", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy1 = jasmine.createSpy("callback1");
			var spy2 = jasmine.createSpy("callback2");

			// Act: bind two callbacks and trigger event
			anEvent(spy1);
			anEvent(spy2);

			anEvent.trigger(2, "text");

			// Assert: that both where executed
			expect(spy1).toHaveBeenCalledWith(2, "text");
			expect(spy2).toHaveBeenCalledWith(2, "text");
		});

		it("Bind callback to event using on", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// bind a callback using on
			anEvent.on(spy);

			anEvent.trigger();

			expect(spy).toHaveBeenCalled();
		});

		it("Un-Bind callback using off", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// bind a callback using on
			var eventBinding = anEvent.on(spy);

			// unbind using off
			anEvent.off(eventBinding);

			anEvent.trigger();

			expect(spy).not.toHaveBeenCalled();
		});

		it("Un-Bind callback using unbind", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// bind a callback using on
			var eventBinding = anEvent.on(spy);

			// Unbind
			eventBinding.unbind();

			anEvent.trigger();
			expect(spy).not.toHaveBeenCalled();
		});

		it("Bind and trigger callback only once using onceOn", function() {
			// Arrange: an event
			var anEvent = events.event();
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback using on
			anEvent.onceOn(spy);

			// and trigger twice
			anEvent.trigger();
			anEvent.trigger();

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("Event dispose unbinds all callbacks", function() {
			// Arrange: an event
			var anEvent = events.event();

			// Act: bind two callbacks and trigger event
			var firstBinding = anEvent(function() {});
			var secondBinding = anEvent(function() {});

			anEvent.dispose();

			// Assert: that both where unbound
			expect(firstBinding.isBound()).toBeFalsy();
			expect(secondBinding.isBound()).toBeFalsy();
		});

		it("Event Category keeps a list of events", function() {
			// Act: create an event handler ans some events
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent();
			var anotherEvent = someEvents.createEvent();

			// Assert: events created
			expect(anEvent.on).toBeTruthy();
			expect(anotherEvent.on).toBeTruthy();
		});

		it("Event Category can keep named events", function() {
			// Act: create an event handler ans some events
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");

			// Assert: events created
			expect(anEvent.on).toBeTruthy();
		});

		it("Event Category can bind callback to named event using on", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");

			// bind a callback using on
			someEvents.on("namedEvent", function() {
				expect(true).toBeTruthy();
			});

			// Act: trigger named event
			anEvent.trigger("namedEvent");
		});

		it("Event Category can un-bind named event callbacks using off", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var spy = jasmine.createSpy("callback");

			// bind a callback using on
			var eventBinding = someEvents.on("namedEvent", spy);

			// unbind using off
			someEvents.off("namedEvent", eventBinding);

			anEvent.trigger("namedEvent");
			expect(spy).not.toHaveBeenCalled();
		});

		it("Event Category can bind and trigger named event callback only once using onceOn", function() {
			// Arrange: an event
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var spy = jasmine.createSpy("callback");

			// Act: bind a callback
			someEvents.onceOn("namedEvent", spy);

			// and trigger twice
			anEvent.trigger("namedEvent");
			anEvent.trigger("namedEvent");

			expect(spy).toHaveBeenCalledTimes(1);
		});

		it("Event Category can bind dispose unbinds all events and there callbacks", function() {
			// Arrange: two events in a event handler
			var someEvents = events.eventCategory();
			var anEvent = someEvents.createEvent("namedEvent");
			var anotherEvent = someEvents.createEvent("namedEvent");

			// Act: bind two callbacks and trigger event
			var firstBinding = anEvent(function() {});
			var secondBinding = anEvent(function() {});
			var thirdBinding = anotherEvent(function() {});
			var fourthBinding = anotherEvent(function() {});

			someEvents.dispose();

			// Assert: that all where unbound
			expect(firstBinding.isBound()).toBeFalsy();
			expect(secondBinding.isBound()).toBeFalsy();
			expect(thirdBinding.isBound()).toBeFalsy();
			expect(fourthBinding.isBound()).toBeFalsy();
		});

		it("Event Manager is a singleton", function() {
			expect(events).toBe(events);
		});

		it("Event Manager keeps list of named event categories", function() {
			var triggered = false;

			events.at("c1").on("foo", function() {
				triggered = true;
			});
			expect(!triggered).toBeTruthy();

			events.at("c1").trigger("bar");
			expect(!triggered).toBeTruthy();

			events.at("c2").trigger("foo");
			expect(!triggered).toBeTruthy();

			events.at("c1").trigger("foo");
			expect(triggered).toBeTruthy();
		});
	});
});
