const express = require('express')
const ws = require('ws')
const http = require('http')
const Monitor = require('./monitor')

const app = express()
const server = http.createServer(app)

const INTERVAL = 1000
const wss = new ws.Server({ server });
let monitor = new Monitor(.3, 12)

wss.on('connection', (ws) => {
    // update avg every second
    let timer = setInterval(function() {
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


server.listen(8080, () => {
    console.log(`Server started on port ${server.address().port}`);
});