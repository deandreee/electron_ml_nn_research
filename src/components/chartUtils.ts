export function getMinMax(values: number[]) {
  let min = Math.min(...values);
  let max = Math.max(...values);
  // console.log('minmax', min, max);

  min = min - 0.005 * max;
  max = max + 0.005 * max;

  return { min, max };
}

export function formatDateShort(value: number) {
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let date = new Date(value);
  return date.getDate() + " " + months[date.getMonth()];
}
