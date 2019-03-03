$(function () {
  var content = $('#content');
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket, just show
  // some notification and exit
  if (!window.WebSocket) {
    content.html($('<p>',
      { text:'Sorry, but your browser doesn\'t support WebSocket.'}
    ));
    $('span').hide();
    return;
  }
  // open connection
  var connection = new WebSocket('ws://127.0.0.1:8080');
  connection.onerror = function (error) {
    content.html($('<p>', {
      text: 'something went wrong'
    }));
  };

  connection.onmessage = function (message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('Invalid JSON: ', message.data);
      return;
    }
    if (json.timestamp && json.val) {
      store.push(json)
      generate()
      console.log("store", store)
    }
  };
  
  let store = []

  function generate() {
      var markers = [{
          'timestamp': store[store.length - 1].timestamp,
          'label': 'End'
      }];
      // console.log(store)
      MG.data_graphic({
          title: "CPU Load Over Time",
          data: store,
          interpolate: d3.curveLinear,
          width: 600,
          height: 400,
          right: 40,
          markers: markers,
          missing_is_hidden: true,
          target: '#graph',
          x_accessor: 'timestamp',
          y_accessor: 'val'
      });
  }
});