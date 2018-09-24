import * as moment from "moment";
import * as access from "safe-access";

type Cb = (ticker: string, res: string) => null;

export const tooltipFormatter = function(
  params: any,
  ticket: string,
  callback: Cb
) {
  const extra = access(params, "data[2]");
  if (!extra) {
    return "Extra not found";
  }

  setTimeout(function() {
    const date = moment(params.data[0]).format("DD MMM   HH:mm");
    // const date = new Date(params.data[0]).toISOString();
    const res = `${date} | ${extra.reason}`;
    callback(ticket, res);
  }, 50);

  return "loading";
};
