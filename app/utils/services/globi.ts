import httpRequest from '../http/httpRequest';

const BASE_URL = "https://api.globalbioticinteractions.org";

export const getInteractionTypes = async () => {
  const url = `${BASE_URL}/interactionTypes`;

  return await httpRequest(url, 'GET', { readAs: 'json', shouldUseCache: true });
};

const defaultSearchParams = {
  type: "json.v2",
  interactionType: 'interactsWith',
  limit: '100',
  offset: '0',
};

// const fields = [
//   'source_taxon_name',
//   'source_taxon_external_id',
//   'target_taxon_name',
//   'target_taxon_external_id',
//   'interaction_type',
// ].map(field => `field=${field}`).join('&');

type InteractionResult = {
  interaction_type: string;
  source: { path: string; name: string; id: string; },
  target: { path: string; name: string; id: string; },
};

export const getInteractions = async (sourceTaxon: string) => {
  const searchParams = new URLSearchParams({
    ...defaultSearchParams,
    sourceTaxon,
  });
  const url = `${BASE_URL}/interaction?${searchParams}`;

  return await httpRequest<InteractionResult[]>(url, 'GET', { readAs: 'json', shouldUseCache: false });
};
