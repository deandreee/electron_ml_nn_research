export interface DateRange {
  name: string;
  from: Date;
  to: Date;
  isTrain?: boolean;
}

export const Jan: DateRange = {
  name: "Jan",
  from: new Date("2018-01-01T00:00:00Z"),
  to: new Date("2018-02-01T00:00:00Z")
};

export const Feb: DateRange = {
  name: "Feb",
  from: new Date("2018-02-01T00:00:00Z"),
  to: new Date("2018-03-01T00:00:00Z")
};

export const Mar: DateRange = {
  name: "Mar",
  from: new Date("2018-03-01T00:00:00Z"),
  to: new Date("2018-04-01T00:00:00Z")
};

export const JunJul: DateRange = {
  name: "JunJul",
  from: new Date("2018-06-01T00:00:00Z"),
  to: new Date("2018-08-01T00:00:00Z")
};

export const JunJulAugSep: DateRange = {
  name: "JJAS",
  from: new Date("2018-06-01T00:00:00Z"),
  to: new Date("2018-10-01T00:00:00Z")
};

export const JunJulAug: DateRange = {
  name: "JunJulAug",
  from: new Date("2018-06-01T00:00:00Z"),
  to: new Date("2018-09-01T00:00:00Z")
};

export const MayWhipsaw: DateRange = {
  name: "MayWhipsaw",
  from: new Date("2018-05-10T00:00:00Z"),
  to: new Date("2018-06-08T00:00:00Z")
};

export const JulPump: DateRange = {
  name: "JulPump",
  from: new Date("2018-07-10T00:00:00Z"),
  to: new Date("2018-07-30T00:00:00Z")
};

export const Apr: DateRange = {
  name: "Apr",
  from: new Date("2018-04-01T00:00:00Z"),
  to: new Date("2018-05-01T00:00:00Z")
};

export const May: DateRange = {
  name: "May",
  from: new Date("2018-05-01T00:00:00Z"),
  to: new Date("2018-06-01T00:00:00Z")
};

export const Jun: DateRange = {
  name: "Jun",
  from: new Date("2018-06-01T00:00:00Z"),
  to: new Date("2018-07-01T00:00:00Z")
};

export const Jul: DateRange = {
  name: "Jul",
  from: new Date("2018-07-01T00:00:00Z"),
  to: new Date("2018-08-01T00:00:00Z")
};

export const AugSep: DateRange = {
  name: "AugSep",
  from: new Date("2018-08-01T00:00:00Z"),
  to: new Date("2018-10-01T00:00:00Z")
};

export const Aug: DateRange = {
  name: "Aug",
  from: new Date("2018-08-01T00:00:00Z"),
  to: new Date("2018-09-01T00:00:00Z")
};

export const Sep: DateRange = {
  name: "Sep",
  from: new Date("2018-09-01T00:00:00Z"),
  to: new Date("2018-10-01T00:00:00Z")
};

export const SepHalf: DateRange = {
  name: "SepHalf",
  from: new Date("2018-09-01T00:00:00Z"),
  to: new Date("2018-09-15T00:00:00Z")
};

export const SepWeek: DateRange = {
  name: "SepWeek",
  from: new Date("2018-09-08T00:00:00Z"),
  to: new Date("2018-09-15T00:00:00Z")
};

export const Oct: DateRange = {
  name: "Oct",
  from: new Date("2018-10-01T00:00:00Z"),
  to: new Date("2018-11-01T00:00:00Z")
};

export const Nov: DateRange = {
  name: "Nov",
  from: new Date("2018-11-01T00:00:00Z"),
  to: new Date("2018-12-01T00:00:00Z")
};

export const NovDump: DateRange = {
  name: "NovDump",
  from: new Date("2018-11-14T00:00:00Z"),
  to: new Date("2018-11-26T00:00:00Z")
};

export const Dec: DateRange = {
  name: "Dec",
  from: new Date("2018-12-01T00:00:00Z"),
  to: new Date("2019-01-01T00:00:00Z")
};

export const JunDec: DateRange = {
  name: "JunDec",
  from: new Date("2018-06-01T00:00:00Z"),
  to: new Date("2019-01-01T00:00:00Z")
};
