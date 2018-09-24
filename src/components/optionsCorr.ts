import { EChartOption } from "echarts";
import styles from "./styles";

export const optionsCorr: EChartOption = {
  backgroundColor: styles.colors.background,

  animation: false, // performance !!!

  grid: {
    left: "50px",
    right: "10px",
    top: "10px"
  },

  yAxis: {
    type: "value",
    min: "dataMin",
    max: "dataMax",
    axisLabel: {
      color: styles.colors.axis,
      fontFamily: styles.fontFamily
    },
    splitLine: { show: false },
    axisLine: { lineStyle: { color: styles.colors.axis } }
  },
  xAxis: {
    type: "value",
    min: "dataMin",
    max: "dataMax",
    axisLabel: {
      color: styles.colors.axis,
      fontFamily: styles.fontFamily
    }
  },

  series: [
    {
      color: styles.colors.primary,
      symbolSize: 1,
      data: [],
      type: "scatter",
      snap: false,
      large: true,
      sampling: "average"
    }
  ]
};
