import { EChartOption } from "echarts";
import styles from "./styles";
import { xAxis } from "./xAxis";
import { yAxis } from "./yAxis";
import { dataZoom } from "./dataZoom";

export const options: EChartOption = {
  backgroundColor: styles.colors.background,

  animation: false, // performance !!!

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
      top: "80%",
      height: 80
    }
  ],

  yAxis,

  xAxis: [
    {
      ...xAxis,
      axisLabel: { ...xAxis.axisLabel },
      axisLine: { lineStyle: { color: styles.colors.axis } },
      splitLine: { show: false }
    },
    {
      type: "time",
      gridIndex: 1,
      scale: true,
      color: styles.colors.axis,
      fontFamily: styles.fontFamily,
      boundaryGap: false,
      // this is to show bar negative values downside
      // ... although this could break rsi and similar
      // ... although lot if indicators are either 0-1 or -1 +1
      // maybe we just need grid3 ...
      axisLine: { onZero: true },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      // splitNumber: 20,
      min: "dataMin",
      max: "dataMax"
    }
  ] as object[],

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
