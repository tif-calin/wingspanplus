import httpRequest from '../http/httpRequest';

const BASE_URL = 'https://api.inaturalist.org/v1/observations';

type ObservationsResult = {
  total_results: number;
  page: number;
  per_page: number;
  results: Array<{
    id: number;
    faves_count: number;
    photos: Array<{
      id: number;
      license_code: string;
      original_dimensions: { width: number; height: number; };
      url: string;
    }>;
    user: {
      id: number;
      login: string;
    }
  }>;
} | { error: string; status: number; };

export const getPhotos = async (taxonId: string) => {
  const queryParams = new URLSearchParams({
    taxon_id: taxonId,
    order_by: 'votes',
    quality_grade: 'research',
    photo_license: 'cc0',
    photos: 'true',
    page: '',
    per_page: '15',
  });
  const url = `${BASE_URL}?${queryParams.toString()}`;
  const resp: ObservationsResult = await httpRequest(url, 'GET', { readAs: 'json', shouldUseCache: false });
  if ('error' in resp) throw new Error(resp.error);

  const allPhotos = resp.results.map(result => result.photos).flat();

  return allPhotos;
};


export const getPhoto = async (taxonId: string) => {
  const photos = await getPhotos(taxonId);
  return photos[0]?.url?.replace('square', 'original');
};
