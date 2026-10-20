export const formatStringNumber = number => String(Number(number));

export const convertFractionToPercent = (fraction, decimalPoints = 1) => {
  const number = convertNumberToDecimal(Number(fraction) * 100, decimalPoints);
  return Math.min(number, 100);
};

export const convertNumberToDecimal = (number, decimalPoints = 1) => {
  return Number(
    (typeof number === 'string' ? Number(number) : number).toFixed(
      decimalPoints,
    ),
  );
};
export const getPageNumberFromIndexAndPerPage = (index, perPage) => {
  return Math.ceil((index + 1) / perPage);
};
