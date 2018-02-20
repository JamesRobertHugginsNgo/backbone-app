'use strict';

$(function () {
  console.log('DOCUMENT READY');

  $.ajax({
    error: function error() {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).log.apply(_console, ['ERROR'].concat(args));
    },
    method: 'GET',
    success: function success(data) {
      console.log('DATA', data);
    },
    url: '/data/sample.json'
  });
});