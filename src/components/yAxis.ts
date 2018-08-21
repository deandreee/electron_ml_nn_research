import styles from "./styles";

export const yAxis = [
  {
    min: "dataMin",
    max: "dataMax",
    // max: 10000,
    // nameTextStyle: { fontSize: 24, color: 'red' },
    axisLabel: {
      color: styles.colors.axis,
      fontFamily: styles.fontFamily
    },
    splitLine: { show: false },
    axisLine: { lineStyle: { color: styles.colors.axis } }
  },
  {
    scale: true,
    gridIndex: 1,
    // splitNumber: 2,
    axisLabel: { show: false },
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: true, interval: 20 } // either this or splitNumber, cant have both
  }
];
