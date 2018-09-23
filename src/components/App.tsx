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
import { seriesSignals, seriesTrades, seriesInd } from "./series";
import { config } from "../strat/config";
import { CorrChart } from "./CorrChart";

interface State {
  isLoading: boolean;
  options: EChartOption;
  coins: CoinList;
  x: number[];
  y: number[];
  regEquation: number[];
}

export class App extends React.Component {
  readonly state: State = {
    isLoading: true,
    options: options,
    coins: {},
    x: [],
    y: [],
    regEquation: []
  };

  async componentWillMount() {
    const { coins, labelsPredicted, x, y, regEquation } = strat.run();

    // const currentProp = "percentChange";
    const currentProp = "close";

    const series = Object.keys(coins).map(k => {
      return {
        ...this.state.options.series[0],
        color: coins[k].color || "white",
        data: coins[k].candles.map(x => x && [x.start * 1000, x[currentProp]]),
        name: k,
        large: true,
        sampling: "average",
        symbol: "none"
      };
    });

    const labelsFiltered = labelsPredicted
      .map((x, i) => ({ x, i }))
      .filter(x => x.x === 1);

    const seriesLabelsPredicted = {
      symbolSize: 5,
      data: labelsFiltered.map(x => [
        coins[config.leadCoin].candles[x.i].start * 1000,
        coins[config.leadCoin].candles[x.i][currentProp]
      ]),
      color: "green",
      type: "scatter",
      large: true
    };

    const seriesInd_ = seriesInd(currentProp, coins);

    const legend = getLegend(coins, seriesInd_);

    this.setState({
      options: {
        ...this.state.options,
        legend,
        series: [
          ...series,

          // ...seriesTrades(currentProp, coins),
          // ...seriesSignals(currentProp, coins),
          // seriesLabelsPredicted,
          ...seriesInd_
        ]
      },
      isLoading: false,
      coins,
      x,
      y,
      regEquation
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
          style={{ height: "300px", width: "100%" }}
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
        <CorrChart
          x={this.state.x}
          y={this.state.y}
          regEquation={this.state.regEquation}
        />
        {/* <Profits coins={this.state.coins} /> */}
        {/* <Roundtrips coin={this.state.coins[config.leadCoin]} /> */}
      </div>
    );
  }
}
