import { EChartOption } from "echarts";
import styles from "./styles";
import { xAxis } from "./xAxis";
import { yAxis } from "./yAxis";
// import tooltip from "chart/tooltip";
import { dataZoom } from "./dataZoom";

export const options: EChartOption = {
  backgroundColor: styles.colors.background,

  grid: [
    {
      left: "50px",
      right: "10px",
      top: "30px",
      height: "70%"
    },
    {
      left: "50px",
      right: "10px",
      top: "75%",
      height: 80
    }
  ],

  yAxis,

  xAxis: [
    {
      ...xAxis,
      axisLabel: { ...xAxis.axisLabel, formatter: null },
      axisLine: { lineStyle: { color: styles.colors.axis } },
      splitLine: { show: false }
    },
    {
      type: "category",
      gridIndex: 1,
      scale: true,
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      // splitNumber: 20,
      min: "dataMin",
      max: "dataMax"
    }
  ] as object[],

  // yAxis: // moved to separate file because @types different (array vs object) [

  dataZoom,

  series: [
    {
      color: styles.colors.primary,
      symbolSize: 1,
      data: [],
      type: "line",
      snap: false
    },
    {
      symbolSize: 15,
      data: [],
      // color: 'rgb(37, 140, 249)',
      // color: styles.colors.primary,
      color: styles.colors.primary,
      // color: 'orange',
      type: "scatter",
      snap: true
    }
  ],

  tooltip: {
    // https://ecomfe.github.io/echarts-examples/public/editor.html?c=candlestick-sh-2015
    trigger: "axis",
    axisPointer: {
      animation: false,
      // type: "cross", // removes that label at the bottom of axis that makes it hard to read, very good
      lineStyle: {
        color: "#376df4",
        width: 2,
        opacity: 1
      }
    }
  }

  //   tooltip: { ...tooltip }
};
