import { CoinData } from "../../types";
import { getCoinPctChange } from "../../utils";

export interface PctLimit {
  mins: number;
  pct: number;
}

export const pctChange = (
  coin: CoinData,
  i: number,
  limits: PctLimit[]
): string | null => {
  for (let x of limits) {
    const changeXmin = getCoinPctChange(coin, i, i - x.mins);
    if (x.pct < 0 && changeXmin < x.pct) {
      return `${x.pct}% in ${x}m`;
    }
    if (x.pct > 0 && changeXmin > x.pct) {
      return `${x.pct}% in ${x.mins}m`;
    }
  }
  return null;
};
