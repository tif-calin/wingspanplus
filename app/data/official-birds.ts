import Papa from 'papaparse';

export type OfficialBirdRow = {
  acceptedName: string;
  family: string;
  order: string;
  wingsearchLink: string;
};

export const OFFICIAL_BIRDS_DATA = await fetch('/assets/cards-official.csv')
  .then((response) => response.text())
  .then((csv) => {
    const { data } = Papa.parse<OfficialBirdRow>(csv, { header: true });

    return data;
  })
;

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
