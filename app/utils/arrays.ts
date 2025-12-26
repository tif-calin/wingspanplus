import { objectEntries } from './objects';

export const tally = <T extends PropertyKey>(arr: T[]) => {
  const counts = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);

  // sort tallies
  return Object.fromEntries(
    objectEntries(counts).toSorted(([, a], [, b]) => b - a)
  ) as typeof counts;
};
