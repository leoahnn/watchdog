$(function () {
  let content = $('#content');
  let history = $('#history');
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;
  // if browser doesn't support WebSocket
  if (!window.WebSocket) {
    content.html($('<p>', {
      text: 'Sorry, but your browser doesn\'t support WebSocket.'
    }));
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

  // cache for storing datapoints
  let store = []
  let baseline = []

  // on a message from the websocket, process the data
  connection.onmessage = function (message) {
    try {
      var json = JSON.parse(message.data);
    } catch (e) {
      console.log('Invalid JSON: ', message.data);
      return;
    }
    if (json.timestamp && json.val) {
      process(json)
      baseline = [{
        value: json.threshold,
        label: 'threshold'
      }]
      generate()
    }
  };

  // converts strings in json to Date objects for graph consumption
  let process = json => {
    if (json.warnTime && json.warnTime === json.timestamp) {
      json.warnTime = new Date(parseInt(json.warnTime))
      let alert = {
        'timestamp': json.warnTime,
        'text': 'High load generated an alert - load: ' + json.val,
        'label': 'High Load Alert'
      }
      markers.push(alert)
      refreshHistory(alert)
    } else if (json.coolTime && json.coolTime === json.timestamp) {
      json.coolTime = new Date(parseInt(json.coolTime))
      let alert = {
        'timestamp': json.coolTime,
        'text': 'All Clear! CPU back to normal',
        'label': 'All Clear'
      }
      markers.push(alert)
      refreshHistory(alert)
    }
    json.timestamp = new Date(parseInt(json.timestamp))
    if (store.length >= 60) {
      store = store.slice(1)
    }
    store.push(json)
  }

  let markers = [];

  // generate graph with MetricsGraphics
  let generate = () => {
    MG.data_graphic({
      title: "CPU Load Over Time",
      data: store,
      interpolate: d3.curveLinear,
      width: 600,
      height: 400,
      right: 40,
      left: 90,
      bottom: 50,
      markers: markers,
      baselines: baseline,
      missing_is_hidden: true,
      target: '#graph',
      x_accessor: 'timestamp',
      y_accessor: 'val',
      x_label: 'time',
      y_label: 'CPU Load',
      xax_count: 4
    });
  }

  let refreshHistory = (alert) => {
    let color = ""
    if (alert.text == 'All Clear! CPU back to normal') {
      color = "table-info"
    } else {
      color = "table-danger"
    }
    let html = `<tr class=${color}>
                <td>${alert.text}</td>
                <td>${alert.timestamp}</td>
                </tr>`
    history.prepend(html)
  }
});