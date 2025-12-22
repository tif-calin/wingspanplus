import httpRequest from '../http/httpRequest';

export const getPhoto = async (taxonId: string) => {
  const url = `https://api.inaturalist.org/v1/observations?taxon_id=${taxonId}&order_by=votes&quality_grade=research&photo_license=cc0&photos=true&page=&per_page=5`;

  const { results } = await httpRequest(url, 'GET', { readAs: 'json', shouldUseCache: false });

  const photoUrl = results?.[0]?.photos?.[0]?.url;

  return photoUrl.replace('square', 'original');
};
