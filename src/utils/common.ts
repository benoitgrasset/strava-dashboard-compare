import moment from 'moment';

export const orange = 'rgb(252 82 0)';
export const green = 'rgb(54 197 151)';
export const blue = 'rgb(1 104 255)';
export const black = 'rgb(31 31 33)';
export const red = 'rgb(255 0 0)';
export const yellow = 'rgb(255 230 0)';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const shortMonthNames = monthNames.map((month) =>
  month.slice(0, 3).toUpperCase()
);

// moment().week():
// moment().isoWeek():
export const getWeekNumber = (date: string) => {
  return moment(date).week();
};

export const getTimeStamp = (date: string) => {
  return moment(date).unix();
};

export const roundNumber = (num: number) => Math.round(num * 100) / 100;

// colors from here: https://www.schemecolor.com/red-orange-green-gradient.php
export const colors = [
  '#69B34C',
  '#ACB334',
  '#FAB733',
  '#FF8E15',
  '#FF4E11',
  '#FF0D0D',
];

const maxSufferScore = 300;
const nbColors = colors.length;
const interval = maxSufferScore / nbColors;
export const ranges = colors.map((_color, index) => [
  index * interval,
  (index + 1) * interval,
]);

const inRange = (val: number, min: number, max: number) => {
  return val >= min && val <= max;
};

export const getSufferScoreColor = (score: number) => {
  let color = black;
  for (let i = 0; i < ranges.length; i++) {
    if (inRange(score, ranges[i][0], ranges[i][1])) {
      color = colors[i];
    }
  }

  return color;
};

export const cleanUpAuthToken = (string: string) => {
  return string.split('&')[1].slice(5);
};
