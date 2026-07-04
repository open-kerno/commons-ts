export interface RoundingOptions {
  value: number;
  precision: number;
}

export const roundWithPrecision = ({ value, precision }: RoundingOptions): number => {
  const factor = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * factor) / factor;
};
