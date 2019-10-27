module.exports.getDiffPercent = (candle, _prevCandle) => {
  let diff = candle.close / _prevCandle.close;

  if (diff >= 1) {
    let perc = (diff - 1) * 100
    let percRounded = Math.round(perc * 100) / 100;
    return `( + ${percRounded} % )`
  }
  else {
    let perc = (1 - diff) * 100
    let percRounded = Math.round(perc * 100) / 100;
    return `( - ${percRounded} % )`
  }
}
