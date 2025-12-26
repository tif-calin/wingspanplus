/**
 * @example
 * toTitleCase('black-winged stilt') // 'Black-Winged Stilt'
 */
export const toTitleCase = (phrase: string) => {
  return phrase.replace(/(\b\w)/g, char => char.toUpperCase());
};

/**
 * @example
 * fromCamelCaseToTitleCase('blackWingedStilt') // 'Black Winged Stilt'
 */
export const fromCamelCaseToTitleCase = (phrase: string) => {
  return phrase.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
};

export const RE_SPECIES_NAME = /^(?<genus>[A-Z][a-z]+) (?<speciesEpitaph>[a-z]+(-[a-z]+)?)$/;
