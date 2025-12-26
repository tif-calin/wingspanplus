import { notEmpty } from '../notEmpty';
import { objectFromEntries } from '../objects';
import { clearCache } from '../http/cache';
import httpRequest from '../http/httpRequest';

const BASE_URL = 'https://www.wikidata.org/w/api.php';

// IDENTIFIERS
// P830    —— Encyclopedia of Life
// P846    —— GBIF
// P3151   —— iNaturalist
// P9157   —— Open Tree of Life
// P10585  —— Catalogue of Life
// P2026   —— Avibase
// P2426   —— xeno-canto
// OTHER
// P1843   —— common name

const PAGES = [
  { propertyId: 'P10585', url: 'https://www.catalogueoflife.org/data/taxon/{{ID}}', title: 'Catalogue of Life', desc: 'taxonomy' },
  { propertyId: 'P830', url: 'https://eol.org/pages/{{ID}}', title: 'Encyclopedia of Life', desc: 'traits' },
  { propertyId: 'P846', url: 'https://www.gbif.org/species/{{ID}}', title: 'GBIF', desc: 'distribution' },
  { propertyId: 'P3151', url: 'https://www.inaturalist.org/taxa/{{ID}}', title: 'iNaturalist', desc: 'observations' },
  { propertyId: 'P9157', url: 'https://tree.opentreeoflife.org/opentree/argus/ottol@{{ID}}', title: 'Open Tree of Life', desc: 'phylogeny' },
  { propertyId: 'P2026', url: 'https://avibase.bsc-eoc.org/species.jsp?avibaseid={{ID}}', title: 'Avibase', desc: 'database' },
  { propertyId: 'P2426', url: 'https://www.xeno-canto.org/species/{{ID}}', title: 'xeno-canto', desc: 'vocalizations' },
  { propertyId: null, url: 'https://www.wikidata.org/wiki/{{ID}}', title: 'Wikidata', desc: 'knowledge base' },
  // TODO: Biodiversity Heritage Library https://www.biodiversitylibrary.org/name/Cinnyris_osea
  // eBird, BirdLife, All About Birds
  // TODO: GloBI
] as const;

/**
 * Given a species name, returns the Wikidata ID for that species. Then, use that ID to fetch
 * additional WikiData "claims" including external identifiers and common names.
 */
const getWikiData = async (latinName: string) => {
  // ?action=wbsearchentities&language=en&format=json&type=item&search=Chlidonias niger
  const urlWbSearchEntities = `${BASE_URL}?action=wbsearchentities&language=en&format=json&type=item&search=${encodeURIComponent(latinName)}`;
  const searchResult = await httpRequest(urlWbSearchEntities, 'GET', { readAs: 'json', withProxy: true });
  const wikidataId = searchResult.search[0]?.id;

  // ?action=wbgetclaims&entity=Q42&property=P2026&format=json
  // TODO: don't fetch ALL claims
  const urlWbGetClaims = `${BASE_URL}?action=wbgetclaims&entity=${wikidataId}&format=json`;
  const claimsResult = await httpRequest(urlWbGetClaims, 'GET', { readAs: 'json', withProxy: true });

  const avibaseId = claimsResult.claims['P2026']?.at(0).mainsnak.datavalue.value;
  if (!avibaseId) clearCache(`GET::||${urlWbGetClaims}`);

  const identifiers = PAGES.map(page => {
    const { propertyId } = page;

    let id = '';
    switch (propertyId) {
      case 'P2026': // Avibase
        id = avibaseId.slice(0, 8);
        break;
      case null: // Wikidata
        id = wikidataId;
        break;
      default:
        id = claimsResult.claims[propertyId]?.at(0).mainsnak.datavalue.value;
    }

    if (!id) return null;

    const url =  page.url.replace('{{ID}}', id);
    return { ...page, url, id, };
  }).filter(notEmpty);

  return {
    names: {
      ...objectFromEntries(
        // @ts-expect-error wikidata result is untyped. TODO: use Zod
        claimsResult.claims['P1843'].map(claim => {
          const val = claim.mainsnak.datavalue.value;
          return [val.language, val.text];
        }) as [string, string][]
      )
    },
    identifiers,
  };
};

export default getWikiData;
