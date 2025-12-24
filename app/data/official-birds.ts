import Papa from 'papaparse';
import type { ComponentProps } from 'react';
import WingspanCard from '~/pages/makecard/components/WingspanCard';
import type { FoodString } from '~/pages/makecard/components/WingspanCard/HabitatInfo';
import type { FoodEnum } from '~/pages/makecard/types';

export type OfficialBirdRow = {
  'Common name': string;
  'Scientific name': string;
  'Color': 'brown' | 'pink' | 'teal' | 'yellow' | 'white';
  'Power text': string;
  'Flavor text': string;
  'Predator': 'X' | '';
  'Flocking': 'X' | '';
  'Bonus card': 'X' | '';
  'Victory points': string;
  'Nest type': 'bowl' | 'cavity' | 'ground' | 'platform' | 'wild';
  'Egg limit': `${number}`;
  'Wingspan': string;
  'Forest': 'X' | '';
  'Grassland': 'X' | '';
  'Wetland': 'X' | '';
  'Invertebrate': `${number}` | '';
  'Seed': `${number}` | '';
  'Fish': `${number}` | '';
  'Fruit': `${number}` | '';
  'Rodent': `${number}` | '';
  'Nectar': `${number}` | '';
  'Wild (food)': `${number}` | '';
  '/ (food cost)': 'X' | '';
  '* (food cost)': 'X' | '';

  acceptedName: string;
  family: string;
  order: string;
  colId: string;
  wingsearchLink: string;
  'inFanArtPack?': 'TRUE' | 'FALSE';
};

export const OFFICIAL_BIRDS_DATA = await fetch('/assets/cards-official.csv')
  .then((response) => response.text())
  .then((csv) => {
    const { data } = Papa.parse<OfficialBirdRow>(csv, { header: true });

    return data;
  })
;

const makeFoodCost = (
  row: Partial<OfficialBirdRow>
): FoodString => {
  let foodCost = ([
    'Invertebrate',
    'Seed',
    'Fish',
    'Fruit',
    'Rodent',
    'Nectar',
    'Wild (food)',
  ] as const).reduce((acc, column) => {
    const keyword = column.split(' ')[0].toLocaleLowerCase() as `${FoodEnum}`;
    Array.from({ length: Number(row[column]) }).forEach(_ => acc.push(`[${keyword}]`));

    return acc;
  }, [] as `[${FoodEnum}]`[]).join(' + ');

  if (row['/ (food cost)'] === 'X') foodCost = foodCost.replaceAll('+', '/');
  if (row['* (food cost)'] === 'X') foodCost = `*${foodCost}`;

  return foodCost as FoodString;
};

type Card = ComponentProps<typeof WingspanCard>;
export const officialRowToCard = (row: OfficialBirdRow): Card => {
  let nestKind: Card['nestKind'] = row['Nest type'] === 'wild' ? 'star' : row['Nest type'];
  nestKind ||= null;

  const powerKind = ({
    brown: 'WHEN ACTIVATED',
    pink: 'ONCE BETWEEN TURNS',
    teal: 'ROUND END',
    yellow: 'GAME END',
    white: 'WHEN PLAYED',
  } as const)[row['Color']];
  const power: Card['power'] = row['Power text'] ? { kind: powerKind, text: row['Power text'] } : undefined;
  if (power && row['Predator'] === 'X') power.tag = 'predator';
  if (power && row['Flocking'] === 'X') power.tag = 'flocking';
  if (power && row['Bonus card'] === 'X') power.tag = 'bonus';

  return {
    eggCapacity: Number(row['Egg limit']),
    flavor: row['Flavor text'],
    foodCost: makeFoodCost(row),
    forest: row['Forest'] === 'X',
    grassland: row['Grassland'] === 'X',
    wetland: row['Wetland'] === 'X',
    nameCommon: row['Common name'],
    nameLatin: row['Scientific name'],
    nestKind,
    photo: undefined,
    power,
    victoryPoints: Number(row['Victory points']),
    wingspan: Number(row['Wingspan']),
  };
};

export type FanmadeBirdRow = {
  common: string;
  latin: string;
  source: string;
  author: string;
  date: string;
  'meta:tags': string;
  'meta:lang': string;
};

export const FANMADE_BIRDS_DATA = await fetch('/assets/cards-fanmade.csv')
  .then((response) => response.text())
  .then((csv) => {
    const { data } = Papa.parse<FanmadeBirdRow>(csv, { header: true });

    return data;
  })
;

// ———————————————————————————————————— //
// #region __TESTS__                    //

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  describe('makeFoodCost', () => {
    test('it works', () => {
      const expected = '*[invertebrate] / [fish]';

      expect(
        makeFoodCost({
          Invertebrate: '1',
          Fish: '1',
          '/ (food cost)': 'X',
          '* (food cost)': 'X',
        })
      ).toBe(expected);
    });
  });
}

// #endregion __TESTS__                 //
// ———————————————————————————————————— //
