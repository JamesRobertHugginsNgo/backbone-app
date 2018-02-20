$(() => {
  console.log('DOCUMENT READY');

  $.ajax({
    error: (...args) => {
      console.log('ERROR', ...args);
    },
    method: 'GET',
    success: (data) => {
      console.log('DATA', data);
    },
    url: '/data/sample.json'
  });
})
