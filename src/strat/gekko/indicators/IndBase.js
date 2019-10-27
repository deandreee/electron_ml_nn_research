// should contain:
// props.resultHistory check and resultHistory push logic
// update wrapping (update() here and updateCore in Ind itself, so from outside update() get's called?)
//      sheet update here doesn't see base
// rounding from props.round
class IndBase {
  constructor(props) {
    this.props = props || {};
    this.resultHistory = [];
    this.age = 0;
  }

  // is candle is price, need to avoid skipping 0 which is ok result for RSI etc
  isNotNullLike(candle) {
    return candle !== null && candle !== undefined;
  }

  // yeah and now we have a problem for Inds that use value not {} ...
  // well, we could just reformat everything here ... if number create objs
  // or maybe prop on Ind to check what it needs
  update(candle) {
    this.age++;

    if (!this.input) {
      throw new Error(
        "IndBase: this.input (candle|price|indicator) not defined"
      );
    }

    if (["price", "candle", "indicator"].includes(this.input) === false) {
      throw new Error(
        "IndBase: this.input should be one of (candle|price|indicator) but is " +
          this.input
      );
    }

    if (this.input === "price" && isNaN(candle) && candle !== null) {
      // null is ok in the beginning
      throw new Error("IndBase: update value not number => " + candle);
    }

    if (this.input === "candle") {
      // let's skip for now, valueToOHLC does return null actually
      // if (!candle) {
      //   throw new Error("IndBase: candle not defined");
      // }
      if (typeof candle !== "object") {
        throw new Error("IndBase: typeof candle not an object");
      }
    }

    // was not working, skip for now
    // if (this.input === "indicator" && !(candle.prototype instanceof IndBase)) {
    //   throw new Error("IndBase: typeof candle not an IndBase");
    // }

    if (!this.updateCore) {
      throw new Error("IndBase: updateCore() is not implemented");
    }

    const result = this.isNotNullLike(candle) ? this.updateCore(candle) : null;

    if (this.props.resultHistory) {
      // should round here but what to do when result is object? also, we need separate resultHistory for strat that is still running (because precision matters) and in the end ...
      // maybe finish function where we round everything ? but that is on Ind itself, IndBase can only round simple number[]
      // oh, we can have IndBase as default and Ind itself override if needed
      this.resultHistory.push(result);
    }

    return result;
  }

  // let's comment this so we can see if/when not implemented
  // updateCore() {} // will be overridden by child
}

module.exports = IndBase;
