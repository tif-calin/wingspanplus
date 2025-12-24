import httpRequest from '../http/httpRequest';
import { notEmpty } from '../notEmpty';
import { groupItemsByFunction } from '../objects';

const CRAWL_DELAY = 2_000;
const BASE_URL = 'https://avibase.bsc-eoc.org/api/v2/taxon/lifehistory';

const fetchAvibaseData = async (avibaseId: string) => {
  const pageUrl = `${BASE_URL}?avibaseId=${avibaseId}&fmt=json`;
  const rawData = await httpRequest(pageUrl, 'GET', { readAs: 'json', withProxy: true, crawlDelay: CRAWL_DELAY });

  return rawData;
};

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
      ['HABITAT::ALT_RANGE', 'length'],
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

export const getAvibaseData = async (avibaseId: string) => {
  const rawData = await fetchAvibaseData(avibaseId);
  const groupedData = groupAvibaseData(rawData);
  const parsedData = parseAvibaseData(groupedData);

  return parsedData;
};
