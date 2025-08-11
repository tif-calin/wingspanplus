const API_URL = `https://api.checklistbank.org/dataset/310958/match/nameusage?q=`;

type TaxonUsage = {
  authorship: string;
  classification: Array<Omit<TaxonUsage, 'classification'>>;
  id: string;
  name: string;
  rank: 'species' | 'genus' | 'family' | 'order' | 'class' | 'megaclass' | 'parvphylum' | 'infraphylum' | 'subphylum' | 'phylum' | 'kingdom' | 'domain';
  status: 'accepted' | (string & {});
};

type MatchNameUsageData = {
  issues: object;
  original: object;
} & (
  | { match: false; }
  | {
      match: true;
      id: string;
      sectorKey: number;
      type: 'variant' | 'none' | (string & {});
      usage: TaxonUsage;
    }
  )
;

export const matchLatinName = async (latin: string) => {
  const response = await fetch(`${API_URL}${latin}`);
  if (!response.ok) throw new Error('Network response was not ok');
  const data: MatchNameUsageData = await response.json();
  return data;
};
