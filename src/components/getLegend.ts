import styles from "./styles";
import { CorrCandles } from "../strat/corr/CorrCandles";

interface Hash {
  [name: string]: boolean;
}

export const getLegend = (coin: CorrCandles, seriesInd: any) => {
  let coinNames = [coin.coin.name];
  let indNames = seriesInd.map((x: any) => x.name);

  let legendSelected: Hash = {};
  [...coinNames, ...indNames].forEach(k => {
    legendSelected[k] = false;
  });

  legendSelected["BTC"] = true;
  // legendSelected["EOS"] = true;

  const legend = {
    type: "scroll", // plain | scroll,
    orient: "horizontal",
    left: 5,
    top: 5,
    // bottom: 0,
    // width: 1000,
    height: "auto",
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
