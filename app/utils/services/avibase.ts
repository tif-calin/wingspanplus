import httpRequest from '../http/httpRequest';

const CRAWL_DELAY = 2_000;
const BASE_URL = 'https://avibase.bsc-eoc.org/api/v2/taxon/lifehistory';

const getAvibase = async (avibaseId: string) => {
  const pageUrl = `${BASE_URL}?avibaseId=${avibaseId}&fmt=json`;
  const rawData = await httpRequest(pageUrl, 'GET', { readAs: 'json', withProxy: true, crawlDelay: CRAWL_DELAY });

  return rawData;
};

export default getAvibase;
