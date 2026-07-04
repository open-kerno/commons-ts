import { roundWithPrecision } from '../../../src/math/rounding';

describe('given a roundWithPrecision function', () => {
  describe.each([
    {
      description: 'should round number ending in 5 up to nearest decimal',
      value: 1.005,
      precision: 2,
      expected: 1.01,
    },
    {
      description: 'should round number ending in 4 down to nearest decimal',
      value: 1.004,
      precision: 2,
      expected: 1,
    },
    {
      description: 'should correctly round repeating floating point arithmetic to exactly precision length',
      value: 1.123456789,
      precision: 6,
      expected: 1.123457,
    },
    {
      description: "should correctly handle numbers that don't need rounding",
      value: 10.5,
      precision: 6,
      expected: 10.5,
    },
    {
      description: 'should correctly handle zero precision (round to integer)',
      value: 10.5,
      precision: 0,
      expected: 11,
    },
    {
      description: 'should correctly handle a zero value',
      value: 0,
      precision: 2,
      expected: 0,
    },
    {
      description: 'should round up correctly on x.015 with precision 2',
      value: 1.015,
      precision: 2,
      expected: 1.02,
    },
    {
      description: 'should correctly round a large number',
      value: 1234567.895,
      precision: 2,
      expected: 1234567.9,
    },
  ])('given value and precision', ({ description, value, precision, expected }) => {
    it(description, () => {
      const result = roundWithPrecision({ value, precision });
      expect(result).toEqual(expected);
    });
  });
});
