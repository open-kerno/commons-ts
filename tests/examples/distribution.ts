import { Allocable } from '../../src/math/distribution';

export const allocableItemExample = ({ id = 1, value = 10 } = {}): { id: number } & Allocable => ({
  id,
  value,
});
