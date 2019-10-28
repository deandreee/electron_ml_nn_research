import * as React from "react";
import ReactEcharts from "echarts-for-react";
import styles from "./styles";
import * as distrCounter from "./distrCounter";
import { CorrCandleMonths } from "../strat/db/queryCorrCandlesMonths";

interface Props {
  months: CorrCandleMonths;
}

export class DistrCharts extends React.Component<Props> {
  render() {
    const { months } = this.props;

    if (!months) {
      return "loading...";
    }

    if (!months["JJASON"]) {
      // temp fix for RL
      return null;
    }

    const candlesActual = months["JJASON"].candlesActual;
    const _1d = candlesActual.map(x => x.pctChange._1d).sort();
    const _2d = candlesActual.map(x => x.pctChange._2d).sort();
    const _5d = candlesActual.map(x => x.pctChange._5d).sort();
    const _7d = candlesActual.map(x => x.pctChange._7d).sort();

    const counts1d = distrCounter.getLine(_1d);
    const counts2d = distrCounter.getLine(_2d);
    const counts5d = distrCounter.getLine(_5d);
    const counts7d = distrCounter.getLine(_7d);

    const serie = {
      // type: "line"
      type: "bar"
    };

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
          ...serie,
          data: counts1d,
          name: "_1d"
        },
        {
          ...serie,
          data: counts2d,
          name: "_2d"
        },
        {
          ...serie,
          data: counts5d,
          name: "_5d"
        },
        {
          ...serie,
          data: counts7d,
          name: "_7d"
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
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: { show: false },
          animation: false,
          lineStyle: {
            color: "#376df4",
            width: 2,
            opacity: 1
          }
        }
      },
      axisPointer: {
        link: { xAxisIndex: "all" } // sync tooltip/line between both grids
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
