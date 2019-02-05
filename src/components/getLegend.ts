import styles from "./styles";
import { CorrCandles } from "../strat/corr/CorrCandles";
import { uniq } from "lodash";

interface Hash {
  [name: string]: boolean;
}

export const getLegend = (coin: CorrCandles, seriesInd: any, seriesPreictions: any) => {
  let coinNames = [coin.coin.name];
  let indNames = seriesInd.map((x: any) => x.name);
  let predNames = uniq(seriesPreictions.map((x: any) => x.name));

  let legendSelected: Hash = {};
  [...coinNames, ...indNames, ...predNames].forEach(k => {
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
    data: [...coinNames, ...indNames, ...predNames],
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
