export interface Allocable {
  value: number;
}

export type Prorated<T> = T & {
  proratedValue: number;
  percentage: number;
};

export interface ProrateOptions<T extends Allocable> {
  items: T[];
  amountToDistribute: number;
  throwOnError?: boolean;
}

export const prorate = <T extends Allocable>({
  items,
  amountToDistribute,
  throwOnError = false,
}: ProrateOptions<T>): Prorated<T>[] => {
  if (items.length === 0) {
    return [];
  }

  const totalBaseValue = items.reduce((sum, item) => sum + item.value, 0);

  if (totalBaseValue <= 0) {
    if (throwOnError) {
      throw new Error('The total value of the items must be greater than 0; cannot calculate proration.');
    }
    return [];
  }

  if (items.some((item) => item.value < 0)) {
    if (throwOnError) {
      throw new Error('Negative values are not allowed in the items to be prorated.');
    }
    return [];
  }

  let remainingPercentage = 1;
  let remainingAmount = amountToDistribute;

  return items.map((item, index) => {
    const isLastItem = index === items.length - 1;

    const percentage = isLastItem ? remainingPercentage : item.value / totalBaseValue;
    const proratedValue = isLastItem ? remainingAmount : percentage * amountToDistribute;

    remainingPercentage -= percentage;
    remainingAmount -= proratedValue;

    return { ...item, percentage, proratedValue };
  });
};
