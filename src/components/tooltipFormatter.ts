import styles from "./styles";
import * as access from "safe-access";

type Cb = (ticker: string, res: string) => null;

export const tooltipFormatter = function(
  params: any,
  ticket: string,
  callback: Cb
) {
  const extra = access(params, "data[2]");
  let seriesIndex = params.seriesIndex;
  if (!extra) {
    return "Extra not found";
  }

  setTimeout(function() {
    const res = extra.reason;
    callback(ticket, res);
  }, 50);

  return "loading";
};
