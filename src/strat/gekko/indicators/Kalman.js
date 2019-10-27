// just a wrapper so can be used in XmBase
const KalmanFilter = require("kalmanjs").default;

let Kalman = function(settings, props) {
  this.props = props || {};
  this.km = new KalmanFilter(settings);
  this.resultHistory = [];
};

Kalman.prototype.update = function(price) {
  const res = this.km.filter(price);

  if (this.props.resultHistory) {
    this.resultHistory.push(res);
  }

  return res;
};

module.exports = Kalman;
