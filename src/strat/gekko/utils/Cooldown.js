class Cooldown {
  constructor() {
    this.counter = 0;
  }

  canTrade() {
    return this.counter === 0;
  }

  start(minutes) {
    this.counter = minutes;
  }

  decrease() {
    if (this.counter > 0) {
      this.counter--;
    }
  }
}

module.exports.Cooldown = Cooldown;

class CooldownXm {
  constructor(batchSize) {
    if (!batchSize) {
      throw new Error("CooldownXm: batchSize not defined");
    }
    this.counter = 0;
    this.batchSize = batchSize;
  }

  canTrade() {
    return this.counter <= 0;
  }

  start(minutes) {
    this.counter = minutes;
  }

  decrease() {
    if (this.counter > 0) {
      this.counter -= this.batchSize;
    }
  }
}

module.exports.CooldownXm = CooldownXm;
