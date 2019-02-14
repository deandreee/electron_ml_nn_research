import styles from "./styles";

export const itemTooltip = {
  show: true,
  trigger: "item", // [ default: 'item' ]
  triggerOn: "mousemove", // click mousemove // [ default: 'mousemove|click' ]
  borderColor: styles.colors.primary,
  borderWidth: 3,
  textStyle: { fontFamily: styles.fontFamily },
  backgroundColor: "rgba(55,55,55,0.9)", // default opacity 0.7, let's make a bit more dark
  // position: positionDesktop,

  enterable: true, // need this so mouseover stops working while inside tooltip
  // showDelay: 500,
  hideDelay: 1000 // doesn't really change anything
};
