import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { flatten } from "lodash";
import { EChartOption } from "echarts";
import styles from "./styles";
import { options } from "./options";
import * as strat from "../strat";
// import * as chartUtils from "./chartUtils";
import { CoinList } from "../strat/types";
import { getLegend } from "./getLegend";
import { Profits } from "./Profits";
import { Roundtrips } from "./Roundtrips";
import { seriesSignals, seriesTrades } from "./series";

interface State {
  isLoading: boolean;
  options: EChartOption;
  coins: CoinList;
}

export class App extends React.Component {
  readonly state: State = {
    isLoading: true,
    options: options,
    coins: {}
  };

  async componentWillMount() {
    const { coins, labelsPredicted } = strat.run();

    // const currentProp = "percentChange";
    const currentProp = "close";

    const series = Object.keys(coins).map(k => {
      return {
        ...this.state.options.series[0],
        color: coins[k].color || "white",
        data: coins[k].candles.map(x => x && [x.start * 1000, x[currentProp]]),
        name: k,
        large: true,
        sampling: "average"
      };
    });

    const seriesPsar = {
      ...this.state.options.series[0],
      color: "lightblue",
      data: coins.BTC.candles.map(x => x && [x.start * 1000, x.ind.psar]),
      name: "PSAR",
      large: true,
      sampling: "average",
      lineStyle: {
        type: "dotted"
      }
    };

    const seriesRsi = {
      ...this.state.options.series[0],
      color: "red",
      data: coins.BTC.candles.map(x => x && [x.start * 1000, x.ind.rsi]),
      name: "RSI",
      xAxisIndex: 1,
      yAxisIndex: 1,
      large: true,
      sampling: "average"
    };

    // const seriesVolume = {
    //   type: "bar",
    //   color: "red",
    //   data: coins.BTC.candles.map(x => [x.start * 1000, x.volume]),
    //   name: "Volume",
    //   xAxisIndex: 1,
    //   yAxisIndex: 1,
    //   large: true,
    //   sampling: "average"
    // };

    const labelsFiltered = labelsPredicted
      // const labelsFiltered = coins.BTC.candles
      // .map(x => x.label)
      .map((x, i) => ({ x, i }))
      .filter(x => x.x === 1);

    const seriesLabelsPredicted = {
      symbolSize: 5,
      data: labelsFiltered.map(x => [
        coins.BTC.candles[x.i].start * 1000,
        coins.BTC.candles[x.i][currentProp]
      ]),
      color: "green",
      type: "scatter",
      large: true
    };

    const legend = getLegend(coins);

    this.setState({
      options: {
        ...this.state.options,
        legend,
        series: [
          ...series,
          seriesPsar,
          ...seriesTrades(currentProp, coins),
          ...seriesSignals(currentProp, coins),
          // seriesLabelsPredicted,
          seriesRsi
          // seriesVolume
        ]
      },
      isLoading: false,
      coins
    });
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  render() {
    return (
      <div style={this.style}>
        <ReactEcharts
          option={this.state.options}
          style={{ height: "500px", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
          theme={"dark"}
          onEvents={{}}
          showLoading={this.state.isLoading}
          loadingOption={{
            color: styles.colors.primary,
            maskColor: styles.colors.background
          }}
        />
        <Profits coins={this.state.coins} />
        <Roundtrips coin={this.state.coins.BTC} />
      </div>
    );
  }
}
