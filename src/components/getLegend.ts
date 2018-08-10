import { CoinList } from "../strat/types";
import styles from "./styles";

interface Hash {
  [name: string]: boolean;
}

export const getLegend = (coins: CoinList) => {
  let legendSelected: Hash = {};
  Object.keys(coins).forEach(k => {
    legendSelected[k] = false;
  });

  legendSelected["BTC"] = true;
  legendSelected["EOS"] = true;

  const legend = {
    type: "plain", // 'scroll',
    orient: "horizontal",
    textStyle: {
      color: styles.colors.primary,
      fontFamily: styles.fontFamily
    },
    left: 5,
    top: 5,
    // bottom: 0,
    // width: 1000,
    height: 200,
    data: Object.keys(coins),
    selected: legendSelected
  };

  return legend;
};
