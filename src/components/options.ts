import { EChartOption } from "echarts";
import styles from "./styles";
import xAxis from "./xAxis";
// import tooltip from "chart/tooltip";

export const options: EChartOption = {
  backgroundColor: styles.colors.background,

  grid: {
    left: "50px",
    right: "10px",
    top: "30px"
  },

  xAxis: { ...xAxis, axisLabel: { ...xAxis.axisLabel, formatter: null } },

  yAxis: {
    min: 9500,
    max: 11000,
    // nameTextStyle: { fontSize: 24, color: 'red' },
    axisLabel: {
      color: styles.colors.primary,
      fontFamily: styles.fontFamily
    }
  },
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
