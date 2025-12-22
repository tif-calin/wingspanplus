import type { ComponentProps } from 'react';
import { filterObject, groupItemsByFunction, objectFromEntries } from '~/utils/objects';
import getAvibase from '~/utils/services/avibase';
import { notEmpty } from '~/utils/notEmpty';
import getWikiData from '~/utils/services/wikidata';
import { toTitleCase } from '~/utils/strings';
import { officialRowToCard } from '~/data/official-birds';
import { seededRandom } from './random';
import type WingspanCard from '../components/WingspanCard';
import { matchLatinName } from '~/utils/services/checklistbank';
import { getPhoto } from '~/utils/services/inaturalist';

const groupAvibaseData = (data: Record<string, string | number | null>[]) =>
  groupItemsByFunction(data, (item) => `${item['categ']}::${item['subcateg']}` as string)
;

const parseAvibaseData = (data: ReturnType<typeof groupAvibaseData>): Record<string, { values: string[] } | { sample: number; avg: number }> => {
  return Object.fromEntries(
    [
      ['DISTRIB::MIGRATION', 'string'],
      // ['DISTRIB::RANGE_SIZE', 'area'],
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
      ['BODY::TAIL_F', 'length'],
      ['BODY::TAIL_M', 'length'],
      ['BODY::TAIL_U', 'length'],
      ['BODY::TARSUS_F', 'length'],
      ['BODY::TARSUS_M', 'length'],
      ['BODY::TARSUS_U', 'length'],
      ['BODY::WING_F', 'length'],
      ['BODY::WING_M', 'length'],
      ['BODY::WING_U', 'length'],
      ['BODY::WING_HWI_F', 'length'],
      ['BODY::WING_HWI_M', 'length'],
      ['BODY::WING_HWI_U', 'length'],
      ['BODY::WING_KIPPS_F', 'length'],
      ['BODY::WING_KIPPS_M', 'length'],
      ['BODY::WING_KIPPS_U', 'length'],
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

  /* === wingspan === */

  // Passeriformes (263)
  // 208 birds have all of these features.
  // wingspan = -0.065 + -0.035×BODY::MASS + 0.035×BODY::MASS_F + -3.759×BODY::TARSUS_F + 3.241×BODY::TARSUS_M + 2.811×BODY::WING_F + -0.993×BODY::WING_M + -4.66×BODY::BILL_F + 1.286×BODY::BILL_M + 0.595×BODY::TARSUS_U + 4.812×BODY::BILL_U + 0.062×BODY::TAIL_U + -0.132×BODY::WING_U + 0.104×BODY::WING_HWI_U + 1.189×BODY::WING_KIPPS_U
  // Error: 3.601
  {
    coeffs: [-0.065, -0.035, 0.035, -3.759, 3.241, 2.811, -0.993, -4.66, 1.286, 0.595, 4.812, 0.062, -0.132, 0.104, 1.189],
    count: 208,
    error: 3.601,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::MASS', 'BODY::MASS_F', 'BODY::TARSUS_F', 'BODY::TARSUS_M', 'BODY::WING_F', 'BODY::WING_M', 'BODY::BILL_F', 'BODY::BILL_M', 'BODY::TARSUS_U', 'BODY::BILL_U', 'BODY::TAIL_U', 'BODY::WING_U', 'BODY::WING_HWI_U', 'BODY::WING_KIPPS_U'],
    order: 'Passeriformes',
  },
  // Passeriformes (263)
  // 200 birds have all of these features.
  // wingspan = -2.218 + 0.523×REPROD::CLUTCHSZ + 1.4×BODY::WING_F + 1.061×BODY::BILL_M + -0.002×BODY::MASS_F + 1.504×BODY::WING_U
  // Error: 3.899
  {
    coeffs: [-2.218, 0.523, 1.4, 1.061, -0.002, 1.504],
    count: 200,
    error: 3.899,
    imTryingToEstimate: 'wingspan',
    iveGot: ['REPROD::CLUTCHSZ', 'BODY::WING_F', 'BODY::BILL_M', 'BODY::MASS_F', 'BODY::WING_U'],
    order: 'Passeriformes',
  },
  // Passeriformes (263)
  // 233 birds have all of these features.
  // wingspan = 0.37 + -7.189×BODY::TARSUS_F + 6.848×BODY::TARSUS_M + 2.97×BODY::WING_F + 0.805×BODY::BILL_F
  // Error: 4.498
  {
    coeffs: [0.37, -7.189, 6.848, 2.97, 0.805],
    count: 233,
    error: 4.498,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::TARSUS_F', 'BODY::TARSUS_M', 'BODY::WING_F', 'BODY::BILL_F'],
    order: 'Passeriformes',
  },
  {
    coeffs: [-0.268, 3.16],
    error: 4.6,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_F'],
    order: 'Passeriformes',
  },
  {
    coeffs: [0.131, 3.051],
    error: 4.647,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_U'],
    order: 'Passeriformes',
  },
  {
    coeffs: [-0.038, 3.014],
    error: 4.704,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M'],
    order: 'Passeriformes',
  },
  {
    coeffs: [3.467, 3.197],
    error: 5.911,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_U'],
    order: 'Charadriiformes',
  },
  {
    coeffs: [2.357, 3.245],
    error: 6.106,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_F'],
    order: 'Charadriiformes',
  },
  {
    coeffs: [4.867, 3.085],
    error: 6.355,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M'],
    order: 'Charadriiformes',
  },
  {
    coeffs: [-5.434, 3.69],
    error: 8.377,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_F'],
    order: 'Anseriformes',
  },
  {
    coeffs: [-4.699, 3.594],
    error: 8.717,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_U'],
    order: 'Anseriformes',
  },
  // 454 birds have all of these features.
  // wingspan = -2.583 + -0.022×REPROD::CLUTCHSZ + 0.006×BODY::MASS + 0.246×SURVIVAL::MAXAGE + -2.277×BODY::WING_M + 2.749×BODY::WING_F + 1.729×BODY::TARSUS_M + 2.332×BODY::BILL_M + -1.008×BODY::TARSUS_F + -7.227×BODY::BILL_F + -0.003×BODY::MASS_F + 2.501×BODY::WING_U + -0.275×BODY::TARSUS_U + 5.321×BODY::BILL_U + -0.949×REPROD::AGE1ST
  // Error: 8.877
  {
    coeffs: [-2.583, -0.022, 0.006, 0.246, -2.277, 2.749, 1.729, 2.332, -1.008, -7.227, -0.003, 2.501, -0.275, 5.321, -0.949],
    count: 454,
    error: 8.877,
    imTryingToEstimate: 'wingspan',
    iveGot: ['REPROD::CLUTCHSZ', 'BODY::MASS', 'SURVIVAL::MAXAGE', 'BODY::WING_M', 'BODY::WING_F', 'BODY::TARSUS_M', 'BODY::BILL_M', 'BODY::TARSUS_F', 'BODY::BILL_F', 'BODY::MASS_F', 'BODY::WING_U', 'BODY::TARSUS_U', 'BODY::BILL_U', 'REPROD::AGE1ST'],
    order: '',
  },
  // 508 birds have all of these features.
  // wingspan = -0.517 + -0.092×REPROD::CLUTCHSZ + 0.004×BODY::MASS + 3.03×BODY::WING_F + 4.023×BODY::BILL_M + -3.223×BODY::BILL_F
  // Error: 9.248
  {
    coeffs: [-0.517, -0.092, 0.004, 3.03, 4.023, -3.223],
    count: 508,
    error: 9.248,
    imTryingToEstimate: 'wingspan',
    iveGot: ['REPROD::CLUTCHSZ', 'BODY::MASS', 'BODY::WING_F', 'BODY::BILL_M', 'BODY::BILL_F'],
    order: '',
  },
  // 522 birds have all of these features.
  // wingspan = -5.031 + 0.391×BODY::WING_M + 2.838×BODY::WING_F + 0.909×BODY::TARSUS_M + 4.312×BODY::BILL_M + -0.041×BODY::TARSUS_F + -3.708×BODY::BILL_F
  // Error: 9.568
  {
    coeffs: [-5.031, 0.391, 2.838, 0.909, 4.312, -0.041, -3.708],
    count: 522,
    error: 9.568,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M', 'BODY::WING_F', 'BODY::TARSUS_M', 'BODY::BILL_M', 'BODY::TARSUS_F', 'BODY::BILL_F'],
    order: '',
  },
  {
    coeffs: [-1.164, 0.004, 3.04, 0.848],
    count: 516,
    error: 9.652,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::MASS', 'BODY::WING_F', 'BODY::TARSUS_M'],
    order: '',
  },
  {
    coeffs: [-6.118, 3.536],
    error: 9.77,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M'],
    order: 'Anseriformes',
  },
  {
    coeffs: [-5.403, 3.279, 0.325, 0.856],
    count: 531,
    error: 10.256,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M', 'BODY::TARSUS_M', 'BODY::BILL_M'],
    order: '',
  },
  {
    coeffs: [-5.525, 3.579],
    error: 10.398,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_U'],
    order: '',
  },
  {
    coeffs: [-5.363, 1.897, 1.656],
    error: 10.407,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M', 'BODY::WING_F'],
    order: '',
  },
  // 534 birds have all of these features.
  // wingspan = -5.488 + 3.521×BODY::WING_M
  // Error: 10.664
  {
    coeffs: [-5.488, 3.521],
    count: 534,
    error: 10.664,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_M'],
    order: '',
  },
  {
    coeffs: [-4.792, 3.563],
    error: 10.828,
    imTryingToEstimate: 'wingspan',
    iveGot: ['BODY::WING_F'],
    order: '',
  },

  /* === eggCapacity === */

  // Charadriiformes (48)
  // 48 birds have all of these features.
  // eggLimit = 1.246 + 0.272×REPROD::CLUTCHSZ
  // Error: 0.421
  {
    coeffs: [1.246, 0.272],
    count: 48,
    error: 0.421,
    imTryingToEstimate: 'eggCapacity',
    iveGot: ['REPROD::CLUTCHSZ'],
    order: 'Charadriiformes',
  },
  // 515 birds have all of these features.
  // eggLimit = 1.98 + 0.305×REPROD::CLUTCHSZ + -0.245×REPROD::AGE1ST
  // Error: 0.872
  {
    coeffs: [1.98, 0.305, -0.245],
    count: 515,
    error: 0.872,
    imTryingToEstimate: 'eggCapacity',
    iveGot: ['REPROD::CLUTCHSZ', 'REPROD::AGE1ST'],
    order: '',
  },
  // 564 birds have all of these features.
  // eggLimit = 1.395 + 0.35×REPROD::CLUTCHSZ
  // Error: 0.928
  {
    coeffs: [1.395, 0.35],
    count: 564,
    error: 0.928,
    imTryingToEstimate: 'eggCapacity',
    iveGot: ['REPROD::CLUTCHSZ'],
    order: '',
  },

  /* === victoryPoints === */

  // Charadriiformes (48)
  // 45 birds have all of these features.
  // victoryPoints = 3.806 + 0.383×BODY::BILL_F + -0.07×BODY::WING_F + -0.045×SURVIVAL::MAXAGE + 0.51×REPROD::AGE1ST
  // Error: 1.642
  {
    coeffs: [3.806, 0.383, -0.07, -0.045, 0.51],
    count: 45,
    error: 1.642,
    imTryingToEstimate: 'victoryPoints',
    iveGot: ['BODY::BILL_F', 'BODY::WING_F', 'SURVIVAL::MAXAGE', 'REPROD::AGE1ST'],
    order: 'Charadriiformes',
  },
  // Anseriformes (43)
  // 41 birds have all of these features.
  // victoryPoints = 2.591 + 0×BODY::MASS + 0.371×BODY::BILL_F + -0.065×BODY::WING_F + 0.321×REPROD::AGE1ST
  // Error: 1.645
  {
    coeffs: [2.591, 0, 0.371, -0.065, 0.321],
    count: 41,
    error: 1.645,
    imTryingToEstimate: 'victoryPoints',
    iveGot: ['BODY::MASS', 'BODY::BILL_F', 'BODY::WING_F', 'REPROD::AGE1ST'],
    order: 'Anseriformes',
  },
  // 497 birds have all of these features.
  // victoryPoints = 2.626 + -0.018×BODY::WING_F + 0.492×BODY::BILL_F + -0.362×BODY::BILL_U + 0.006×BODY::WING_HWI_U + 0.275×REPROD::AGE1ST
  // Error: 1.77
  {
    coeffs: [2.626, -0.018, 0.492, -0.362, 0.006, 0.275],
    count: 497,
    error: 1.77,
    imTryingToEstimate: 'victoryPoints',
    iveGot: ['BODY::WING_F', 'BODY::BILL_F', 'BODY::BILL_U', 'BODY::WING_HWI_U', 'REPROD::AGE1ST'],
    order: '',
  },
  // 534 birds have all of these features.
  // victoryPoints = 2.781 + 0.031×BODY::WING_F + 0.12×BODY::BILL_F
  // Error: 1.803
  {
    coeffs: [2.781, 0.031, 0.12],
    count: 534,
    error: 1.803,
    imTryingToEstimate: 'victoryPoints',
    iveGot: ['BODY::WING_F', 'BODY::BILL_F'],
    order: '',
  }
];

const estimateValue = (
  data: ReturnType<typeof parseAvibaseData>,
  imTryingToEstimate: 'wingspan' | 'eggCapacity' | 'victoryPoints'
) => {
  const iHave = new Set(Object.keys(data));
  const order = '';

  const regressionValues = REGRESSION_VALUES.filter(rv =>
    rv.order === order
    && rv.imTryingToEstimate === imTryingToEstimate
    && rv.iveGot.every(ihave => iHave.has(ihave))
  );

  if (!regressionValues?.length) {
    console.error('No regression values found.');
    return null;
  }

  regressionValues.sort((a, b) => a.error - b.error);

  const estimatedValue = regressionValues[0].iveGot.reduce((acc, key, i) => {
    if (!('avg' in data[key])) throw new Error('Avibase data not found');
    const x = data[key].avg;
    const c = regressionValues[0].coeffs[i + 1];

    return acc + c * x;
  }, regressionValues[0].coeffs[0]);

  return [estimatedValue, regressionValues[0]] as const;
};

export const constructRecommendedValues = async (latinName: string) => {
  const opts = {
    preferredLang: 'en'
  };

  let recommendedValues: Partial<ComponentProps<typeof WingspanCard>> = {};

  const taxonomy = await constructTaxonomy(latinName);
  if (!taxonomy) throw new Error('Taxonomy not found');
  const speciesName = `${taxonomy.species[0]}. ${taxonomy.species.split(/\s/).at(-1) || ''}`;

  // Wikidata
  const wikidata = await getWikiData(latinName);

  if (wikidata.names[opts.preferredLang]) {
    recommendedValues.nameCommon = toTitleCase(wikidata.names[opts.preferredLang]);
  }

  const inatId = wikidata.identifiers.find(id => id.propertyId === 'P3151')?.id || '';
  if (inatId) {
    const photo = await getPhoto(inatId);
    recommendedValues.photo = { url: photo, removeBg: true };
  }

  // Avibase
  const avibaseId = wikidata.identifiers.find(id => id.propertyId === 'P2026')?.id || '';

  const rawData = await getAvibase(avibaseId);
  const groupedData = groupAvibaseData(rawData);
  const parsedData = parseAvibaseData(groupedData);

  const estimatedWingspan = estimateValue(parsedData, 'wingspan');
  if (estimatedWingspan) {
    const [val, { error }] = estimatedWingspan;
    console.log(`Estimated wingspan: ${val} ± ${error}`);
    recommendedValues.wingspan = Math.round(val);
  }
  const estimatedEggCapacity = estimateValue(parsedData, 'eggCapacity');
  if (estimatedEggCapacity) {
    console.log(`Estimated eggCapacity: ${estimatedEggCapacity[0]} ± ${estimatedEggCapacity[1].error}`);
    recommendedValues.eggCapacity = Math.round(estimatedEggCapacity[0]);
  }
  const estimatedVictoryPoints = estimateValue(parsedData, 'victoryPoints');
  if (estimatedVictoryPoints) {
    const [val, { error }] = estimatedVictoryPoints;
    const withVariance = Math.round(val + (seededRandom(speciesName) * 2 * error) - error);

    console.log(`Estimated victoryPoints: ${val} ± ${error} --> ${withVariance}`);
    recommendedValues.victoryPoints = withVariance;
  }

  // Official cards by taxonomic rank
  const officialCards = await findOfficialCards(taxonomy.species, taxonomy.genus, taxonomy.family, taxonomy.order);

  if (officialCards.species?.length) {
    const officialMatch = officialRowToCard(officialCards.species[0]);
    recommendedValues = { ...recommendedValues, ...officialMatch };
  }

  // Fan-made cards
  const fanmadeCards = await findFanmadeCards(latinName, speciesName);

  return {
    classification: [ ...Object.values(taxonomy).slice(0, -1), speciesName ],
    fanmadeCards,
    officialCards,
    recommendedValues,
    wikidata,
  };
};

const constructTaxonomy = async (latinName: string) => {
  const data = await matchLatinName(latinName);
  if (!data.match) throw new Error('Taxonomy not found');

  const { name, classification } = data.usage;
  const classRankIndex = classification.findIndex((c) => c.rank === 'class');
  const newClassification = classification.slice(0, classRankIndex + 1).reverse();
  const ranks = newClassification.map(c => [c.rank, c.name] as const);

  return { ...objectFromEntries(ranks), species: name, };
};

const findFanmadeCards = async (latinName: string, commonName: string) => {
  const { FANMADE_BIRDS_DATA } = await import('~/data/official-birds');

  const firstPass = FANMADE_BIRDS_DATA.filter(bird => bird.latin === latinName || bird.common === commonName);

  // Handle potential synonyms by doing a second pass.
  const commonNames = new Set([commonName, ...firstPass.map(bird => bird.common)]);
  const latinNames = new Set([latinName, ...firstPass.map(bird => bird.latin)]);

  return FANMADE_BIRDS_DATA.filter(bird => latinNames.has(bird.latin) || commonNames.has(bird.common));
};

/**
 * Finds official birds in the same species, genus, family, or order.
 */
const findOfficialCards = async (
  speciesName: string,
  genusName: string,
  familyName: string,
  orderName: string
) => {
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
