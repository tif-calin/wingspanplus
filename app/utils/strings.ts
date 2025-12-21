/**
 * @example
 * toTitleCase('black-winged stilt') // 'Black-Winged Stilt'
 */
export const toTitleCase = (phrase: string) => {
  return phrase.replace(/(\b\w)/g, char => char.toUpperCase());
};
