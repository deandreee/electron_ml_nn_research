// no required indicators
// Bollinger Bands - Okibcn implementation 2018-01-02

interface BBandsSettings {
  TimePeriod: number;
  NbDevDn: number;
  NbDevUp: number;
}

export class BBands {
  settings: BBandsSettings;
  prices: number[];
  diffs: number[];
  age: number;
  sum: number;
  sumsq: number;
  upper: number;
  middle: number;
  lower: number;

  constructor(settings: BBandsSettings) {
    this.settings = settings;
    // Settings:
    //    TimePeriod: The amount of samples used for the average.
    //    NbDevUp: The distance in stdev of the upper band from the SMA.
    //    NbDevDn: The distance in stdev of the lower band from the SMA.
    this.prices = [];
    this.diffs = [];
    this.age = 0;
    this.sum = 0;
    this.sumsq = 0;
    this.upper = 0;
    this.middle = 0;
    this.lower = 0;
  }

  update(price: number) {
    var tail = this.prices[this.age] || 0; // oldest price in window
    var diffsTail = this.diffs[this.age] || 0; // oldest average in window

    this.prices[this.age] = price;
    this.sum += price - tail;
    this.middle = this.sum / this.prices.length; // SMA value

    this.diffs[this.age] = price - this.middle;
    this.sumsq += this.diffs[this.age] ** 2 - diffsTail ** 2;
    var stdev = Math.sqrt(this.sumsq) / this.prices.length;

    this.upper = this.middle + this.settings.NbDevUp * stdev;
    this.lower = this.middle - this.settings.NbDevDn * stdev;

    this.age = (this.age + 1) % this.settings.TimePeriod;

    return { upper: this.upper, lower: this.lower };
  }
}
