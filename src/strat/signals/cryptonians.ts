// https://web.telegram.org/#/im?p=@cryptofreesignal

export interface Signal {
  asset: "BTC" | "ETH" | "TRX" | "XRP" | "IOT" | "ADA";
  date: Date;
  advice: "short" | "long";
  comment?: string;
  startAt: number[];
  target: number[];
  stoploss?: number;
}

export const cryptonians: Signal[] = [
  {
    asset: "BTC",
    date: new Date("2018-08-22T20:03:52+03:00"),
    advice: "short",
    comment: "5x or 10x leverage",
    startAt: [6660, 6700],
    target: [6580, 6520, 6450],
    stoploss: 6801
  },
  {
    asset: "BTC",
    date: new Date("2018-08-14T14:40:48+03:00"),
    advice: "long",
    comment: "5x or 10x leverage",
    startAt: [5950, 6020],
    target: [6200, 6300, 6420, 6550],
    stoploss: 5720
  },
  {
    asset: "ETH",
    date: new Date("2018-08-12T14:19:43+03:00"),
    advice: "short",
    comment: "5x or 10x leverage",
    startAt: [321, 324],
    target: [302, 285, 270, 260],
    stoploss: 332
  },
  {
    asset: "TRX",
    date: new Date("2018-08-10T15:00:52+03:00"),
    advice: "short",
    comment: "5x or 10x leverage",
    startAt: [391, 395],
    target: [380, 365, 350],
    stoploss: 410
  },
  {
    asset: "IOT",
    date: new Date("2018-07-18T21:47:06+03:00"),
    advice: "long",
    startAt: [15100],
    target: [15800, 16500, 17700, 18200]
  },
  {
    asset: "IOT",
    date: new Date("2018-07-06T19:04:32+03:00"),
    advice: "long",
    startAt: [15900],
    target: [16400, 16900, 17500, 18400]
  },
  {
    asset: "XRP",
    date: new Date("2018-07-03T14:48:05+03:00"),
    advice: "long",
    startAt: [7500],
    comment: "below 7500",
    target: [8000, 11000]
  },
  {
    asset: "ADA",
    date: new Date("2018-07-02T22:12:50+03:00"),
    advice: "long",
    startAt: [2250],
    comment: "below 2250",
    target: [2400, 2450, 2750]
  },
  {
    asset: "ADA",
    date: new Date("2018-06-25T13:17:45+03:00"),
    advice: "long",
    startAt: [2150],
    comment: "below 2150",
    target: [2260, 2380, 2590]
  },
  {
    asset: "IOT",
    date: new Date("2018-06-24T20:38:48+03:00"),
    advice: "long",
    startAt: [15900],
    comment: "below 15900",
    target: [16700, 17600, 18900, 22000, 25000]
  }
];
