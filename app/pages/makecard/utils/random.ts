/**
 * Implementation of Java's String.hashCode()
 */
export const hashString = (s: string): number =>
  s
    .split('')
    .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);

const mungeString = (s: string, prime: number, coprime: number) =>
  s
    .split('')
    .reduce(
      (hash, char, i) =>
        ((hash << 5) - hash + ((coprime * (i + 1) * char.charCodeAt(0)) % prime)) | 0,
      0
    ) % coprime;

const SEEDED_RANDOM_CACHE: Record<string, number> = {};
/**
 * A string is hashed (NOT GUARANTEED TO BE UNIQUE, also only up to 32 bits)
 * and then we do some simple modulo stuff to genererate a barely-even-pseudo-
 * random random number.
 */
export const seededRandom = (seed: string, prime = 65_537, coprime = 33_391) => {
  if (!Number.isFinite(SEEDED_RANDOM_CACHE[seed])) {
    const rand = ~~Math.abs(mungeString(seed, prime, coprime)) / coprime;
    SEEDED_RANDOM_CACHE[seed] ||= rand;
  }

  return SEEDED_RANDOM_CACHE[seed];
};

/**
 * Shuffles an array.
 */
export const shuffle = <T>(arr: T[], seed?: string): T[] => {
  if (!seed) return arr.toSorted(() => Math.random() - 0.5);

  let index = 0;
  return arr.toSorted(() => seededRandom(`${index++}${seed}`) - 0.5);
};
