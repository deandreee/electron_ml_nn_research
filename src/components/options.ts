import { EChartOption } from "echarts";
import styles from "./styles";
import xAxis from "./xAxis";
// import tooltip from "chart/tooltip";

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
      left: "10%",
      right: "8%",
      top: "75%"
      // height: '16%'
    }
  ],

  xAxis: [
    {
      ...xAxis,
      axisLabel: { ...xAxis.axisLabel, formatter: null }
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
  ],

  yAxis: [
    {
      min: 5000,
      max: 10000,
      // nameTextStyle: { fontSize: 24, color: 'red' },
      axisLabel: {
        color: styles.colors.primary,
        fontFamily: styles.fontFamily
      }
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }
    }
  ],
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
  ]

  //   tooltip: { ...tooltip }
};
