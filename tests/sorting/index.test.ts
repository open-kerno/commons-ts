import { sortByCriteria, SortOrder } from '../../src/sorting';

describe.each([
  {
    description: 'should sort numbers ascending by default',
    items: [{ value: 3 }, { value: 1 }, { value: 2 }],
    criteria: [{ callback: (item: { value: number }) => item.value }],
    expected: [{ value: 1 }, { value: 2 }, { value: 3 }],
  },
  {
    description: 'should sort numbers descending when requested',
    items: [{ value: 3 }, { value: 1 }, { value: 2 }],
    criteria: [{ callback: (item: { value: number }) => item.value, sortOrder: SortOrder.Desc }],
    expected: [{ value: 3 }, { value: 2 }, { value: 1 }],
  },
  {
    description: 'should sort strings using locale-aware comparison',
    items: [{ name: 'Zebra' }, { name: 'Ávila' }, { name: 'apple' }],
    criteria: [{ callback: (item: { name: string }) => item.name }],
    expected: [{ name: 'apple' }, { name: 'Ávila' }, { name: 'Zebra' }],
  },
  {
    description: 'should push null and undefined values to the end regardless of order',
    items: [{ value: 2 }, { value: null }, { value: 1 }, { value: undefined }],
    criteria: [{ callback: (item: { value: number | null | undefined }) => item.value }],
    expected: [{ value: 1 }, { value: 2 }, { value: null }, { value: undefined }],
  },
  {
    description: 'should fall back to the next criterion when values are equal',
    items: [
      { group: 'b', value: 2 },
      { group: 'a', value: 2 },
      { group: 'a', value: 1 },
    ],
    criteria: [
      { callback: (item: { group: string; value: number }) => item.group },
      { callback: (item: { group: string; value: number }) => item.value },
    ],
    expected: [
      { group: 'a', value: 1 },
      { group: 'a', value: 2 },
      { group: 'b', value: 2 },
    ],
  },
  {
    description: 'should return an empty array when given an empty array',
    items: [],
    criteria: [{ callback: (item: never) => item }],
    expected: [],
  },
])('given a sortByCriteria function', ({ description, items, criteria, expected }) => {
  it(description, () => {
    const result = sortByCriteria(items as never[], criteria as never[]);
    expect(result).toEqual(expected);
  });
});

it('should not mutate the original array', () => {
  const items = [{ value: 3 }, { value: 1 }];
  sortByCriteria(items, [{ callback: (item) => item.value }]);
  expect(items).toEqual([{ value: 3 }, { value: 1 }]);
});
