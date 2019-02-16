import * as React from "react";
import ReactEcharts from "echarts-for-react";
// import { EChartOption } from "echarts";
import { options } from "./options";
// import * as chartUtils from "./chartUtils";
import { getLegend } from "./getLegend";
import { seriesInd, seriesPredicted } from "./series";
// import { CorrChart } from "./CorrChart";
import styles from "./styles";
import { CorrCandles } from "../strat/corr/CorrCandles";
import { Prediction } from "../strat/types";

interface Props {
  coin: CorrCandles;
  labelsPredicted: Prediction[];
}

interface State {
  // isLoading: boolean;
  // options: EChartOption;
}

export class AppCharts extends React.Component<Props, State> {
  readonly state: State = {
    isLoading: true,
    options: options
  };

  render() {
    const { coin, labelsPredicted } = this.props;

    if (!coin) {
      return "loading...";
    }

    const currentProp = "close";

    const series = [
      {
        ...options.series[0],
        color: coin.coin.color,
        data: coin.candlesActual.map(x => x && [x.start * 1000, x[currentProp]]),
        name: coin.coin.name,
        large: true,
        sampling: "average",
        symbol: "none"
      }
    ];

    const seriesInd_ = seriesInd(currentProp, coin);
    const seriesPredicted_ = seriesPredicted(coin, labelsPredicted);

    const legend = getLegend(coin, seriesInd_, seriesPredicted_);
    const optionsMod = {
      ...options,
      legend,
      series: [
        ...series,
        ...seriesInd_,

        // ...seriesTrades(currentProp, coins),
        // ...seriesSignals(currentProp, coins),
        ...seriesPredicted_
      ]
    };

    return (
      <ReactEcharts
        option={optionsMod}
        style={{ height: "700px", width: "100%" }}
        notMerge={true}
        lazyUpdate={true}
        theme={"dark"}
        onEvents={{}}
        showLoading={false}
        loadingOption={{
          color: styles.colors.primary,
          maskColor: styles.colors.background
        }}
      />
    );
  }
}

{
  /* <Profits coins={this.state.coins} /> */
}
{
  /* <Roundtrips coin={this.state.coins[config.leadCoin]} /> */
}
