import { Allocable, prorate } from '../../../src/math/distribution';
import { allocableItemExample } from '../../examples/distribution';

type AllocableRecord = Allocable & Record<string, unknown>;

describe('given a prorate function', () => {
  describe.each([
    {
      description: 'should return an empty array when the items array is empty',
      items: [] as ({ id: number; value: number } & Allocable)[],
      amountToDistribute: 100,
      throwOnError: false,
      expected: [],
    },
    {
      description: 'should assign the full amount and 100% percentage to a single item',
      items: [allocableItemExample({ id: 1, value: 100 })],
      amountToDistribute: 200,
      throwOnError: false,
      expected: [{ id: 1, value: 100, percentage: 1, proratedValue: 200 }],
    },
    {
      description: 'should split equally between two items with the same value',
      items: [allocableItemExample({ id: 1, value: 50 }), allocableItemExample({ id: 2, value: 50 })],
      amountToDistribute: 100,
      throwOnError: false,
      expected: [
        { id: 1, value: 50, percentage: 0.5, proratedValue: 50 },
        { id: 2, value: 50, percentage: 0.5, proratedValue: 50 },
      ],
    },
    {
      description: 'should distribute proportionally with clean fractions (25%, 25%, 50%)',
      items: [
        allocableItemExample({ id: 1, value: 25 }),
        allocableItemExample({ id: 2, value: 25 }),
        allocableItemExample({ id: 3, value: 50 }),
      ],
      amountToDistribute: 100,
      throwOnError: false,
      expected: [
        { id: 1, value: 25, percentage: 0.25, proratedValue: 25 },
        { id: 2, value: 25, percentage: 0.25, proratedValue: 25 },
        { id: 3, value: 50, percentage: 0.5, proratedValue: 50 },
      ],
    },
    {
      description: 'should return zero proratedValue for all items when amountToDistribute is 0',
      items: [allocableItemExample({ id: 1, value: 1 }), allocableItemExample({ id: 2, value: 1 })],
      amountToDistribute: 0,
      throwOnError: false,
      expected: [
        { id: 1, value: 1, percentage: 0.5, proratedValue: 0 },
        { id: 2, value: 1, percentage: 0.5, proratedValue: 0 },
      ],
    },
    {
      description: 'should assign zero percentage and proratedValue to an item with value 0 when total is positive',
      items: [allocableItemExample({ id: 1, value: 0 }), allocableItemExample({ id: 2, value: 100 })],
      amountToDistribute: 50,
      throwOnError: false,
      expected: [
        { id: 1, value: 0, percentage: 0, proratedValue: 0 },
        { id: 2, value: 100, percentage: 1, proratedValue: 50 },
      ],
    },
    {
      description:
        'should distribute proportionally across three items with unequal values using exact fractions (50%, 25%, 25%)',
      items: [
        allocableItemExample({ id: 1, value: 50 }),
        allocableItemExample({ id: 2, value: 25 }),
        allocableItemExample({ id: 3, value: 25 }),
      ],
      amountToDistribute: 100,
      throwOnError: false,
      expected: [
        { id: 1, value: 50, percentage: 0.5, proratedValue: 50 },
        { id: 2, value: 25, percentage: 0.25, proratedValue: 25 },
        { id: 3, value: 25, percentage: 0.25, proratedValue: 25 },
      ],
    },
    {
      description: 'should return a correct result when throwOnError is true and all inputs are valid',
      items: [allocableItemExample({ id: 1, value: 50 }), allocableItemExample({ id: 2, value: 50 })],
      amountToDistribute: 100,
      throwOnError: true,
      expected: [
        { id: 1, value: 50, percentage: 0.5, proratedValue: 50 },
        { id: 2, value: 50, percentage: 0.5, proratedValue: 50 },
      ],
    },
    {
      description: 'should distribute proportionally with a large amountToDistribute',
      items: [allocableItemExample({ id: 1, value: 1 }), allocableItemExample({ id: 2, value: 1 })],
      amountToDistribute: 1_000_000,
      throwOnError: false,
      expected: [
        { id: 1, value: 1, percentage: 0.5, proratedValue: 500_000 },
        { id: 2, value: 1, percentage: 0.5, proratedValue: 500_000 },
      ],
    },
    {
      description: 'should distribute a negative amountToDistribute proportionally',
      items: [allocableItemExample({ id: 1, value: 50 }), allocableItemExample({ id: 2, value: 50 })],
      amountToDistribute: -100,
      throwOnError: false,
      expected: [
        { id: 1, value: 50, percentage: 0.5, proratedValue: -50 },
        { id: 2, value: 50, percentage: 0.5, proratedValue: -50 },
      ],
    },
  ])('given valid or non-throwing inputs', ({ description, items, amountToDistribute, throwOnError, expected }) => {
    it(description, () => {
      const result = prorate({ items, amountToDistribute, throwOnError });
      expect(result).toEqual(expected);
    });
  });

  describe.each([
    {
      description: 'should preserve all original item properties alongside the prorated fields',
      items: [
        { id: 1, label: 'alpha', value: 60 },
        { id: 2, label: 'beta', value: 40 },
      ] as AllocableRecord[],
      amountToDistribute: 100,
      expected: [
        { id: 1, label: 'alpha', value: 60, percentage: 0.6, proratedValue: 60 },
        { id: 2, label: 'beta', value: 40, percentage: 0.4, proratedValue: 40 },
      ],
    },
    {
      description: 'should preserve nested-like string properties on items',
      items: [
        { id: 1, department: 'IT', costCenter: 'CC-001', value: 10 },
        { id: 2, department: 'Marketing', costCenter: 'CC-002', value: 20 },
        { id: 3, department: 'Sales', costCenter: 'CC-003', value: 20 },
      ] as AllocableRecord[],
      amountToDistribute: 100,
      expected: [
        { id: 1, department: 'IT', costCenter: 'CC-001', value: 10, percentage: 0.2, proratedValue: 20 },
        { id: 2, department: 'Marketing', costCenter: 'CC-002', value: 20, percentage: 0.4, proratedValue: 40 },
        { id: 3, department: 'Sales', costCenter: 'CC-003', value: 20, percentage: 0.4, proratedValue: 40 },
      ],
    },
  ])('given items with extra properties', ({ description, items, amountToDistribute, expected }) => {
    it(description, () => {
      const result = prorate({ items, amountToDistribute });
      expect(result).toEqual(expected);
    });
  });

  describe.each([
    {
      description: 'should return an empty array when all item values are 0',
      items: [allocableItemExample({ id: 1, value: 0 }), allocableItemExample({ id: 2, value: 0 })],
      amountToDistribute: 100,
    },
    {
      description: 'should return an empty array when a single item has value 0',
      items: [allocableItemExample({ id: 1, value: 0 })],
      amountToDistribute: 100,
    },
    {
      description: 'should return an empty array when all item values are negative (total < 0)',
      items: [allocableItemExample({ id: 1, value: -10 }), allocableItemExample({ id: 2, value: -20 })],
      amountToDistribute: 100,
    },
    {
      description: 'should return an empty array when item values cancel out to zero (10 and -10)',
      items: [allocableItemExample({ id: 1, value: 10 }), allocableItemExample({ id: 2, value: -10 })],
      amountToDistribute: 100,
    },
    {
      description: 'should return an empty array when one item has a negative value even if total is positive',
      items: [allocableItemExample({ id: 1, value: 100 }), allocableItemExample({ id: 2, value: -5 })],
      amountToDistribute: 100,
    },
  ])('given invalid input with throwOnError disabled', ({ description, items, amountToDistribute }) => {
    it(description, () => {
      expect(prorate({ items, amountToDistribute })).toEqual([]);
    });
  });

  describe.each([
    {
      description: 'should throw when all item values are 0',
      items: [allocableItemExample({ id: 1, value: 0 }), allocableItemExample({ id: 2, value: 0 })],
      amountToDistribute: 100,
      expectedErrorMessage: 'The total value of the items must be greater than 0; cannot calculate proration.',
    },
    {
      description: 'should throw when a single item has value 0',
      items: [allocableItemExample({ id: 1, value: 0 })],
      amountToDistribute: 100,
      expectedErrorMessage: 'The total value of the items must be greater than 0; cannot calculate proration.',
    },
    {
      description: 'should throw when all item values are negative (total < 0)',
      items: [allocableItemExample({ id: 1, value: -10 }), allocableItemExample({ id: 2, value: -20 })],
      amountToDistribute: 100,
      expectedErrorMessage: 'The total value of the items must be greater than 0; cannot calculate proration.',
    },
    {
      description:
        'should throw the total-value error first when items cancel out to zero (takes priority over negative-value check)',
      items: [allocableItemExample({ id: 1, value: 10 }), allocableItemExample({ id: 2, value: -10 })],
      amountToDistribute: 100,
      expectedErrorMessage: 'The total value of the items must be greater than 0; cannot calculate proration.',
    },
    {
      description: 'should throw the negative-value error when total is positive but one item is negative',
      items: [allocableItemExample({ id: 1, value: 100 }), allocableItemExample({ id: 2, value: -5 })],
      amountToDistribute: 100,
      expectedErrorMessage: 'Negative values are not allowed in the items to be prorated.',
    },
  ])(
    'given invalid input with throwOnError enabled',
    ({ description, items, amountToDistribute, expectedErrorMessage }) => {
      it(description, () => {
        expect(() => prorate({ items, amountToDistribute, throwOnError: true })).toThrow(expectedErrorMessage);
      });
    },
  );

  describe.each([
    {
      description: 'should guarantee the sum of proratedValues and percentages is exact for three equal items (thirds)',
      items: [
        allocableItemExample({ id: 1, value: 1 }),
        allocableItemExample({ id: 2, value: 1 }),
        allocableItemExample({ id: 3, value: 1 }),
      ],
      amountToDistribute: 100,
    },
    {
      description: 'should guarantee exact sums for seven equal items (sevenths)',
      items: Array.from({ length: 7 }, (_, i) => allocableItemExample({ id: i + 1, value: 1 })),
      amountToDistribute: 100,
    },
    {
      description: 'should guarantee exact sums for ten equal items with a non-round amount',
      items: Array.from({ length: 10 }, (_, i) => allocableItemExample({ id: i + 1, value: 1 })),
      amountToDistribute: 33,
    },
    {
      description: 'should guarantee exact sums when amountToDistribute is a large integer',
      items: [
        allocableItemExample({ id: 1, value: 1 }),
        allocableItemExample({ id: 2, value: 1 }),
        allocableItemExample({ id: 3, value: 1 }),
      ],
      amountToDistribute: 999_999,
    },
  ])('given inputs that produce floating-point rounding', ({ description, items, amountToDistribute }) => {
    it(description, () => {
      const result = prorate({ items, amountToDistribute });
      const totalProratedValue = result.reduce((sum, item) => sum + item.proratedValue, 0);
      const totalPercentage = result.reduce((sum, item) => sum + item.percentage, 0);
      expect(totalProratedValue).toBe(amountToDistribute);
      expect(totalPercentage).toBe(1);
    });
  });
});
