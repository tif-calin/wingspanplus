import type { ComponentProps } from 'react';
import type WingspanCard from '../../components/WingspanCard';
import { matchLatinName } from '../../utils/http/checklistbank';
import { filterObject, groupItemsByFunction, objectFromEntries } from '~/utils/objects';
import getAvibase from '~/utils/http/getAvibase';
import { notEmpty } from '~/utils/notEmpty';

const groupAvibaseData = (data: Record<string, string | number | null>[]) =>
  groupItemsByFunction(data, (item) => `${item['categ']}::${item['subcateg']}` as string)
;

const parseAvibaseData = (data: ReturnType<typeof groupAvibaseData>): Record<string, { values: string[] } | { sample: number; avg: number }> => {
  return Object.fromEntries(
    [
      ['DISTRIB::MIGRATION', 'string'],
      ['HABITAT::DENSITY', 'string'],
      ['HABITAT::DESCR', 'string'],
      ['HABITAT::LIFESTYLE', 'string'],
      ['FOOD::DESCR', 'string'],
      ['FOOD::FORAGINGNICHE', 'string'],
      ['FOOD::TROPHICLEVEL', 'string'],
      ['FOOD::TROPHICNICHE', 'string'],
      ['REPROD::SYSTEM', 'string'],
      ['REPROD::PARASITIC', 'string'],
      ['REPROD::NESTSTRUCT', 'string'],
      ['REPROD::NESTSITE', 'string'],
      ['REPROD::NESTATTACHM', 'string'],
      ['BODY::MASS', 'weight'],
      ['BODY::MASS_F', 'weight'],
      ['BODY::MASS_M', 'weight'],
      ['BODY::MASS_U', 'weight'],
      ['BODY::BILL_F', 'length'],
      ['BODY::BILL_M', 'length'],
      ['BODY::BILL_U', 'length'],
      ['BODY::TARSUS_F', 'length'],
      ['BODY::TARSUS_M', 'length'],
      ['BODY::TARSUS_U', 'length'],
      ['BODY::WING_F', 'length'],
      ['BODY::WING_M', 'length'],
      ['BODY::WING_U', 'length'],
      ['SURVIVAL::MAXAGE', 'index'],
      ['REPROD::AGE1ST', 'index'],
      ['REPROD::CLUTCHSZ', 'index'],
      ['REPROD::INCUBATION', 'index'],
      ['EGGS::MASS', 'weight'],
    ].map(([key, kind]) => {
      const values = data[key];

      if (!values?.length) return null;

      switch (kind) {
        case 'string':
          return [key, { values: (values.map(val => val.value) as string[]) }] as const;
        case 'index':
        case 'weight':
        case 'length': {
          const sample = values.reduce((acc, val) => acc + (Number(val.samplesize) || 1), 0);
          const totalVal = values
            .map(val => {
              let value = val.value;
              if (typeof value === 'string' && /[\d.]+-[\d.]/.test(value)) {
                value = value.split('-').map(Number).reduce((a, b) => a + b, 0) / 2;
              } else value = Number(value);

              const unit = val.units;
              switch (unit) {
                case 'in':
                case 'inches':
                  value *= 2.54;
                  break;
                case 'cm':
                case 'centimeters':
                case 'g':
                case 'grams':
                  break;
                default:
                  console.error(`Unknown unit: ${unit} for ${key}`);
              }

              return value * (Number(val.samplesize) || 1);
            })
            .reduce((acc, val) => acc + val, 0);
          let avg = totalVal / sample;
          if (!sample) avg ||= Number(values[0].value);

          return [key, { sample, avg }] as const;
        }
        default:
          return null as never;
      }
    }).filter(notEmpty)
  );
};

/**
 * I took all the official species and ran some simple linear regressions. The x here is various
 * Avibase properties while the y is the official values for [wingspan | egg capacity].
 *
 * TODO: take into account orders for improved accuracy
 * TODO: utilize muliple linear regressions for more complex relationships
 * TODO: make a simple neural network to predict other features
 */
const REGRESSION_VALUES = [
  // Passeriformes (263)
  // 233 birds have all of these features.
  // wingspan = 0.37 + -7.189×BODY::TARSUS_F + 6.848×BODY::TARSUS_M + 2.97×BODY::WING_F + 0.805×BODY::BILL_F
  // Error: 4.498
  {
    coeffs: [0.37, -7.189, 6.848, 2.97, 0.805],
    count: 233,
    error: 4.498,
    ihave: ['BODY::TARSUS_F', 'BODY::TARSUS_M', 'BODY::WING_F', 'BODY::BILL_F'],
    imTryingToEstimate: 'wingspan',
    order: 'Passeriformes',
  },
  {
    coeffs: [-0.268, 3.16],
    error: 4.6,
    ihave: ['BODY::WING_F'],
    imTryingToEstimate: 'wingspan',
    order: 'Passeriformes',
  },
  {
    coeffs: [0.131, 3.051],
    error: 4.647,
    ihave: ['BODY::WING_U'],
    imTryingToEstimate: 'wingspan',
    order: 'Passeriformes',
  },
  {
    coeffs: [-0.038, 3.014],
    error: 4.704,
    ihave: ['BODY::WING_M'],
    imTryingToEstimate: 'wingspan',
    order: 'Passeriformes',
  },
  {
    coeffs: [3.467, 3.197],
    error: 5.911,
    ihave: ['BODY::WING_U'],
    imTryingToEstimate: 'wingspan',
    order: 'Charadriiformes',
  },
  {
    coeffs: [2.357, 3.245],
    error: 6.106,
    ihave: ['BODY::WING_F'],
    imTryingToEstimate: 'wingspan',
    order: 'Charadriiformes',
  },
  {
    coeffs: [4.867, 3.085],
    error: 6.355,
    ihave: ['BODY::WING_M'],
    imTryingToEstimate: 'wingspan',
    order: 'Charadriiformes',
  },
  {
    coeffs: [-5.434, 3.69],
    error: 8.377,
    ihave: ['BODY::WING_F'],
    imTryingToEstimate: 'wingspan',
    order: 'Anseriformes',
  },
  {
    coeffs: [-4.699, 3.594],
    error: 8.717,
    ihave: ['BODY::WING_U'],
    imTryingToEstimate: 'wingspan',
    order: 'Anseriformes',
  },
  // 522 birds have all of these features.
  // wingspan = -5.031 + 0.391×BODY::WING_M + 2.838×BODY::WING_F + 0.909×BODY::TARSUS_M + 4.312×BODY::BILL_M + -0.041×BODY::TARSUS_F + -3.708×BODY::BILL_F
  // Error: 9.568
  {
    coeffs: [-5.031, 0.391, 2.838, 0.909, 4.312, -0.041, -3.708],
    count: 522,
    error: 9.568,
    ihave: ['BODY::WING_M', 'BODY::WING_F', 'BODY::TARSUS_M', 'BODY::BILL_M', 'BODY::TARSUS_F', 'BODY::BILL_F'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-1.164, 0.004, 3.04, 0.848],
    count: 516,
    error: 9.652,
    ihave: ['BODY::MASS', 'BODY::WING_F', 'BODY::TARSUS_M'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-6.118, 3.536],
    error: 9.77,
    ihave: ['BODY::WING_M'],
    imTryingToEstimate: 'wingspan',
    order: 'Anseriformes',
  },
  {
    coeffs: [-5.403, 3.279, 0.325, 0.856],
    count: 531,
    error: 10.256,
    ihave: ['BODY::WING_M', 'BODY::TARSUS_M', 'BODY::BILL_M'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-5.525, 3.579],
    error: 10.398,
    ihave: ['BODY::WING_U'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-5.363, 1.897, 1.656],
    error: 10.407,
    ihave: ['BODY::WING_M', 'BODY::WING_F'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-5.488, 3.521],
    error: 10.664,
    ihave: ['BODY::WING_M'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
  {
    coeffs: [-4.792, 3.563],
    error: 10.828,
    ihave: ['BODY::WING_F'],
    imTryingToEstimate: 'wingspan',
    order: '',
  },
];

const estimateWingspan = (data: ReturnType<typeof parseAvibaseData>) => {
  const iHave = new Set(Object.keys(data));
  const order = '';
  const imTryingToEstimate = 'wingspan';

  const regressionValues = REGRESSION_VALUES.filter(rv =>
    rv.order === order
    && rv.imTryingToEstimate === imTryingToEstimate
    && rv.ihave.every(ihave => iHave.has(ihave))
  );

  if (!regressionValues?.length) {
    console.error('No regression values found.');
    return null;
  }

  regressionValues.sort((a, b) => a.error - b.error);

  console.log('regressionValues', regressionValues);

  return regressionValues[0].ihave.reduce((acc, key, i) => {
    if (!('avg' in data[key])) throw new Error('Avibase data not found');
    const x = data[key].avg;
    const c = regressionValues[0].coeffs[i + 1];

    return acc + c * x;
  }, regressionValues[0].coeffs[0]);
};

export const constructRecommendedValues = async (
  { avibaseId, }: { avibaseId: string; }
): Promise<Partial<ComponentProps<typeof WingspanCard>>> => {
  const rawData = await getAvibase(avibaseId);
  const groupedData = groupAvibaseData(rawData);
  const parsedData = parseAvibaseData(groupedData);

  const recVals: Partial<ComponentProps<typeof WingspanCard>> = {};

  console.log('estimated wingspan', estimateWingspan(parsedData));

  const estimatedWingspan = estimateWingspan(parsedData);
  if (estimatedWingspan) {
    console.log('estimatedWingspan', estimatedWingspan);
    recVals.wingspan = Math.round(estimatedWingspan);
  }

  return recVals;
};

export const constructTaxonomy = async (latinName: string) => {
  const data = await matchLatinName(latinName);
  if (!data.match) throw new Error('Taxonomy not found');

  const { name, classification } = data.usage;
  const classRankIndex = classification.findIndex((c) => c.rank === 'class');
  const newClassification = classification.slice(0, classRankIndex + 1).reverse();
  const ranks = newClassification.map(c => [c.rank, c.name] as const);

  return { ...objectFromEntries(ranks), species: name, };
};

export const findFanmadeCards = async (latinName: string, commonName: string) => {
  const { FANMADE_BIRDS_DATA } = await import('~/data/official-birds');

  const firstPass = FANMADE_BIRDS_DATA.filter(bird => bird.latin === latinName || bird.common === commonName);

  // Handle potential synonyms by doing a second pass.
  const commonNames = new Set([commonName, ...firstPass.map(bird => bird.common)]);
  const latinNames = new Set([latinName, ...firstPass.map(bird => bird.latin)]);

  return FANMADE_BIRDS_DATA.filter(bird => latinNames.has(bird.latin) || commonNames.has(bird.common));
};

export const findOfficialCards = async (speciesName: string, genusName: string, familyName: string, orderName: string) => {
  const { OFFICIAL_BIRDS_DATA } = await import('~/data/official-birds');

  const species = OFFICIAL_BIRDS_DATA.filter(bird => bird.acceptedName === speciesName);
  let alreadyAdded = new Set<string>(species.map(bird => bird.acceptedName));
  const genus = OFFICIAL_BIRDS_DATA.filter(bird => bird.acceptedName.split(' ').at(0) === genusName && !alreadyAdded.has(bird.acceptedName));
  alreadyAdded = new Set([...alreadyAdded, ...genus.map(bird => bird.acceptedName)]);
  const family = OFFICIAL_BIRDS_DATA.filter(bird => bird.family === familyName && !alreadyAdded.has(bird.acceptedName));
  alreadyAdded = new Set([...alreadyAdded, ...family.map(bird => bird.acceptedName)]);
  const order = OFFICIAL_BIRDS_DATA.filter(bird => bird.order === orderName && !alreadyAdded.has(bird.acceptedName));

  return filterObject({
    species,
    genus,
    family,
    order,
  }, (_, value) => value?.length > 0);
};
