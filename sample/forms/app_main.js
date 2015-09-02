requirejs.config({
    baseUrl: '.',
    paths:   {
        'jquery':   '../../bower_components/jquery/jquery',
        'widgetjs': '../../src/',
        'bootstrap': 'http://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min',
        'lodash' : 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min'
    },
    shim:    {
        bootstrap: { deps: ['jquery'], exports: 'jQuery' }
    }
});

define(['./forms', 'jquery'], function(forms, jQuery) {
    jQuery(document).ready(function() {
        forms().appendTo('body');
    });
});
