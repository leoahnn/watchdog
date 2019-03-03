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
    get_avg() {
        let cpus = os.cpus().length
        let avg = os.loadavg()[0] / cpus
        let timestamp = Date.now()
        return [avg, timestamp]
    }

    check_warn(data) {
        // detrigger warning if load is less than 1
        // for more than 2 min
        if (this.warn) {
            if (data < this.threshold) {
                this.coolCounter++;
            } else {
                this.coolCounter = 0;
            }
            if (this.coolCounter > this.interval) {
                this.coolTime = Date.now()  
                this.warn = false
            } else {
                this.warn = true
            }
        } else {
            if (data > this.threshold) {
                this.warnCounter++;
            } else {
                this.warnCounter = 0;
            }
            if (this.warnCounter > this.interval) {
                this.warnTime = Date.now()  
                this.warn = true
            } else {
                this.warn = false
            }
        }
    }

    warn_status() {
        return this.warn
    }

    update() {
        let data = this.get_avg()
        this.check_warn(data)
        return JSON.stringify({
            "val": data[0],
            "timestamp": data[1],
            "coolCount": this.coolCounter, 
            "coolTime": this.coolTime,
            "warnCount": this.warnCounter, 
            "warnTime": this.warnTime,
            "warn": this.warn
        })
    }
}


module.exports = Monitor