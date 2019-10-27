class XmBase {
  // indArr => instances of indicators, need to be created previously, too much manual/custom logic for each one
  // only chance => create callback maybe and then inside ctor go times(...) ?
  //yeah let's try that, otherwise we have to make sure lengths match outside
  constructor(waveManager, fnCreateInd) {
    this.waveManager = waveManager; // passing as instance for better access to wave idx

    this.indArr = [];
    for (let i = 0; i < this.waveManager.waveCount; i++) {
      this.indArr.push(fnCreateInd());
    }

    this.result = null;
    this.resultHistory = [];
  }

  getPrev(i) {
    if (this.resultHistory.length < i) {
      throw new Error(
        `XmBase: getPrev(${i}) not enough candles (${this.resultHistory.length})`
      );
    }

    return this.resultHistory[this.resultHistory.length - 1 - i]; // -1 because if checking after update, -1 is current and -2 is prev
  }

  getCurrentWaveInd() {
    const idx = this.waveManager.getCurrentWaveIdx(); // should start with 0
    return this.indArr[idx];
  }

  update(value) {
    const idx = this.waveManager.getCurrentWaveIdx(); // should start with 0

    // const updateVal = this.updateProp ? bigCandle[this.updateProp] : bigCandle; // use candle or specific prop (open,close) ?

    // sanity check
    // sep 16 can't really use this anymore with all the nulls ... :/
    if (value === null || value === undefined) {
      // throw new Error("XmBase update: updateVal is not defined!");
      this.resultHistory.push(null);
      this.result = null;
      return null;
    }

    const res = this.indArr[idx].update(value);
    this.resultHistory.push(res);
    this.result = res;
    return res;
  }
}

module.exports = XmBase;
