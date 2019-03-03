const os = require('os')

class Monitor {
    constructor(threshold, interval) {
        this.warnCounter = 0;
        this.coolCounter = 0;
        this.warnTime = null;
        this.coolTime = null
        this.warn = false
        this.threshold = threshold
        this.interval = interval
    }
    getAvg() {
        let cpus = os.cpus().length
        let avg = os.loadavg()[0] / cpus
        let timestamp = Date.now()
        return [avg, timestamp]
    }

    checkWarn(data) {
        // detrigger warning if load is less than 1
        // for more than 2 min
        if (this.warn) {
            if (data[0] < this.threshold) {
                this.coolCounter++;
            } else {
                this.coolCounter = 0;
            }
            if (this.coolCounter > this.interval) {
                this.coolTime = data[1]
                this.warn = false
            } else {
                this.warn = true
            }
        } else {
            if (data[0] > this.threshold) {
                this.warnCounter++;
            } else {
                this.warnCounter = 0;
            }
            if (this.warnCounter > this.interval) {
                this.warnTime = data[1]
                this.warn = true
            } else {
                this.warn = false
            }
        }
    }

    warnStatus() {
        return this.warn
    }

    // queries for CPU load, checks warning status and returns a JSON object
    update() {
        let data = this.getAvg()
        this.checkWarn(data)
        return JSON.stringify({
            "val": data[0],
            "timestamp": data[1],
            "coolTime": this.coolTime,
            "warnTime": this.warnTime,
            "warn": this.warn,
            "threshold": this.threshold
        })
    }
}


module.exports = Monitor