var expect = require('chai').expect;
var Monitor = require('../monitor');

describe('Monitor.checkWarn()', function () {
  const THRESHOLD = 1 // threshold for warning
  const SPAN = 12 // number of intervals before warning triggers
  let monitor = new Monitor(THRESHOLD, SPAN)
  it('should alert after high CPU for 12 intervals', function () {
    
    let test = []
    for (i = 0; i < 13; i ++) {
      var timeObject = new Date(); 
      timeObject = new Date(timeObject.getTime() + 10000*i);
      test.push([1.1, new Date()])
    }
    expect(monitor.warnStatus()).to.be.false;
    test.forEach((val) => {
      monitor.checkWarn(val)
    })
    expect(monitor.warnStatus()).to.be.true;
  });
  it('should signal cooldown after CPU is low for 12 intervals after an alert', function () {
    
    let test = []
    for (i = 0; i < 13; i ++) {
      var timeObject = new Date(); 
      timeObject = new Date(timeObject.getTime() + 10000*i);
      test.push([0.1, new Date()])
    }
    expect(monitor.warnStatus()).to.be.true;
    test.forEach((val) => {
      monitor.checkWarn(val)
    })
    expect(monitor.warnStatus()).to.be.false;

  });
});