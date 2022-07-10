/**
 * Color formats a string.
 *
 * @param {string} s A string to format.
 * @param {number} fg A value between 30-37 and 90-97 inclusive.
 *  Defaults to the current terminal forground color.
 * 30 - Black      90 - Bright Black
 * 31 - Red        91 - Bright Red
 * 32 - Green      92 - Bright Green
 * 33 - Yellow     93 - Bright Yellow
 * 34 - Blue       94 - Bright Blue
 * 35 - Magenta    95 - Bright Magenta
 * 36 - Cyan       96 - Bright Cyan
 * 37 - White      97 - Bright White
 * @param {number} bg A value between 40-47 and 100-107 inclusive.
 *  Defaults to the current terminal background color
 * 40 - Black      100 - Bright Black
 * 41 - Red        101 - Bright Red
 * 42 - Green      102 - Bright Green
 * 43 - Yellow     103 - Bright Yellow
 * 44 - Blue       104 - Bright Blue
 * 45 - Magenta    105 - Bright Magenta
 * 46 - Cyan       106 - Bright Cyan
 * 47 - White      107 - Bright White
 * @param {boolean} underline Underlines the text. Default false
 * @param {boolean} bold Bolds the text. Default false
 *
 * @return {string}
 */
const formatValue = (
  s: string,
  fg = 39,
  bg = 49,
  underline = false,
  bold = false
): string => {
  const formatters = `${fg};${bg};${underline ? 4 : 24};${bold ? 1 : 22}`;
  return fg ? `\x1b[${formatters}m${s}\x1b[0m` : s;
};
export default formatValue;
