const express = require('express')
const ws = require('ws')
const http = require('http')
const Monitor = require('./monitor')

const app = express()
const server = http.createServer(app)

const INTERVAL = 10000 // length of one update cycle (10 sec)
const THRESHOLD = 1 // threshold for warning (>1)
const SPAN = 12 // number of intervals before warning triggers (12 ten second intervals)
const wss = new ws.Server({
    server
});
let monitor = new Monitor(THRESHOLD, SPAN)

wss.on('connection', (ws) => {
    let timer = setInterval(function () {
        var avg = monitor.update()
        ws.send(avg)
    }, INTERVAL);
    ws.onerror = (event) => {
        clearInterval(timer)
        console.log(event)
    }
    ws.on('close', function close() {
        clearInterval(timer)
        console.log('disconnected');
    });
})

// setup static files
app.use(express.static('assets'))

app.get('/', function (req, res) {
    res.sendFile('index.html', {
        root: __dirname + "/"
    });
});

server.listen(8080, "127.0.0.1", () => {
    console.log(`Server started on http://${server.address().address}:${server.address().port}`);
});