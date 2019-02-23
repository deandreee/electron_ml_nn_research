import * as React from "react";
import ReactEcharts from "echarts-for-react";
import styles from "./styles";
import { CorrCandles } from "../strat/corr/CorrCandles";
import * as distrCounter from "./distrCounter";

interface Props {
  coin: CorrCandles;
}

export class DistrCharts extends React.Component<Props> {
  render() {
    const { coin } = this.props;

    if (!coin) {
      return "loading...";
    }

    const _1d = coin.candlesActual.map(x => x.pctChange._1d).sort();
    const _2d = coin.candlesActual.map(x => x.pctChange._2d).sort();
    const _5d = coin.candlesActual.map(x => x.pctChange._5d).sort();
    const _7d = coin.candlesActual.map(x => x.pctChange._7d).sort();

    const counts1d = distrCounter.getLine(_1d);
    const counts2d = distrCounter.getLine(_2d);
    const counts5d = distrCounter.getLine(_5d);
    const counts7d = distrCounter.getLine(_7d);

    const options = {
      backgroundColor: styles.colors.background,
      animation: false, // performance !!!
      xAxis: {
        type: "value"
      },
      yAxis: {
        type: "value"
      },
      series: [
        {
          data: counts1d,
          name: "_1d",
          type: "bar",
          large: true,
          sampling: "average"
        },
        {
          data: counts2d,
          name: "_2d",
          type: "bar",
          large: true,
          sampling: "average"
        },
        {
          data: counts5d,
          name: "_5d",
          type: "bar",
          large: true,
          sampling: "average"
        },
        {
          data: counts7d,
          name: "_7d",
          type: "bar",
          large: true,
          sampling: "average"
        }
      ],
      legend: {
        type: "scroll", // plain | scroll,
        orient: "horizontal",
        left: 5,
        top: 5,
        // bottom: 0,
        // width: 1000,
        height: "auto",
        data: ["_1d", "_2d", "_5d", "_7d"],
        selected: [{ _1d: true }],
        inactiveColor: "#777",
        textStyle: {
          // color: styles.colors.primary,
          fontFamily: styles.fontFamily,
          color: "#fff"
        }
      }
    };

    return (
      <ReactEcharts
        option={options}
        style={{ height: "300px", width: "100%" }}
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
