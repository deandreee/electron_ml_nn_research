import { CoinList } from "../strat/types";
import styles from "./styles";

interface Hash {
  [name: string]: boolean;
}

export const getLegend = (coins: CoinList, seriesInd: any) => {
  let coinNames = Object.keys(coins);
  let indNames = seriesInd.map((x: any) => x.name);

  let legendSelected: Hash = {};
  [...coinNames, ...indNames].forEach(k => {
    legendSelected[k] = false;
  });

  legendSelected["BTC"] = true;
  // legendSelected["EOS"] = true;

  const legend = {
    type: "plain", // 'scroll',
    orient: "horizontal",
    left: 5,
    top: 5,
    // bottom: 0,
    // width: 1000,
    height: 200,
    data: [...coinNames, ...indNames],
    selected: legendSelected,
    inactiveColor: "#777",
    textStyle: {
      // color: styles.colors.primary,
      fontFamily: styles.fontFamily,
      color: "#fff"
    }
  };

  return legend;
};
