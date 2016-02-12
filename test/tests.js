require.config({
    paths: {
		'objectjs': '../bower_components/objectjs/src/object',
        'jquery': '../bower_components/jquery/jquery',
        'widgetjs': '../src/',
        'chai': '../bower_components/chai/chai',
        'chai-jquery': '../bower_components/chai-jquery/chai-jquery'
    },
    shim: {
        'jquery': {
            exports: '$'
        },
        'chai-jquery': ['jquery', 'chai']
    }
    //, urlArgs: 'bust=' + (new Date()).getTime()
});

var testModules = [
    'htmlCanvasTest',
    'widgetTest',
    'eventsTest',
    'router/hashLocationTest',
    'router/routerTest',
    'router/routeTest'
];

require(testModules, function () {
    if (window.mochaPhantomJS) {
        window.mochaPhantomJS.run();
    }
    else {
        //mocha.checkLeaks();
        mocha.run();
    }
});
