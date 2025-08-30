import { useCallback, useRef, useState, type ComponentProps, type Dispatch, type DOMAttributes, type FormEventHandler, type SetStateAction } from 'react';
import { matchLatinName } from '../../utils/http/checklistbank';
import { filterObject, objectFromEntries } from '~/utils/objects';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import getWikiData from '~/utils/http/getWikiData';
import type WingspanCard from '../WingspanCard';

type UseCardMakerFormParams = {
  setClassification: Dispatch<SetStateAction<string[]>>;
  setFanmadeCards: Dispatch<SetStateAction<FanmadeBirdRow[] | undefined>>;
  setOfficialCards: Dispatch<SetStateAction<Record<string, OfficialBirdRow[]> | undefined>>;
  setWikiData: Dispatch<SetStateAction<Awaited<ReturnType<typeof getWikiData>> | undefined>>;
};

const DEFAULT_VALUES: ComponentProps<typeof WingspanCard> = {
  eggCapacity: 3,
  flavor: 'Gadwalls are known for their ability to steal food from diving ducks.',
  foodCost: '[fish] + [fish]',
  habitats: ['wetland'],
  nameCommon: 'Gadwall',
  nameLatin: "Mareca strepera",
  nestKind: "ground",
  // photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/395500578/original.jpg', removeBg: true, scale: 1.2, translateX: 10, translateY: -5 },
  photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/96684139/original.jpg', removeBg: true, scale: 0.8, translateX: 10, translateY: 10 },
  power: { kind: 'ONCE BETWEEN TURNS', text: 'When another player takes the "gain food" action, choose a [wild] they gained from the birdfeeder and cache 1 on this bird from the supply.' },
  victoryPoints: 5,
  wingspan: 90,
};

const findTaxonomy = async (latinName: string) => {
  const data = await matchLatinName(latinName);
  if (!data.match) throw new Error('Taxonomy not found');

  const { name, classification } = data.usage;
  const classRankIndex = classification.findIndex((c) => c.rank === 'class');
  const newClassification = classification.slice(0, classRankIndex + 1).reverse();
  const ranks = newClassification.map(c => [c.rank, c.name] as const);

  return {
    ...objectFromEntries(ranks),
    species: name,
   };
};

const findOfficialCards = async (speciesName: string, genusName: string, familyName: string, orderName: string) => {
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

const findFanmadeCards = async (latinName: string, commonName: string) => {
  const { FANMADE_BIRDS_DATA } = await import('~/data/official-birds');

  const firstPass = FANMADE_BIRDS_DATA.filter(bird => bird.latin === latinName || bird.common === commonName);

  // Handle potential synonyms by doing a second pass.
  const commonNames = new Set([commonName, ...firstPass.map(bird => bird.common)]);
  const latinNames = new Set([latinName, ...firstPass.map(bird => bird.latin)]);

  return FANMADE_BIRDS_DATA.filter(bird => latinNames.has(bird.latin) || commonNames.has(bird.common));
};

const useCardMakerForm = ({
  setClassification,
  setFanmadeCards,
  setOfficialCards,
  setWikiData,
}: UseCardMakerFormParams) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState(DEFAULT_VALUES);

  const handleChange = useCallback<FormEventHandler<HTMLFormElement>>(event => {
    const formElement = event.currentTarget;
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (!formElement || !inputElement) return;

    const editedKey = inputElement.name;
    let editedVal: string | number | null = inputElement.value;
    if (inputElement.type === 'number') editedVal = Number(inputElement.value);
    if (editedVal === 'null') editedVal = null;

    setFormValues({ ...formValues, [editedKey]: editedVal });
  }, [formValues]);

  const handleValidateLatinName = useCallback<NonNullable<DOMAttributes<HTMLButtonElement>['onClick']>>(
    async (ev) => {
      const form = ev.currentTarget.form;
      if (!form) throw new Error('Form not found');

      const formData = new FormData(form);
      const latinName = formData.get('nameLatin');
      if (typeof latinName !== 'string') throw new Error('Invalid Latin name');

      const taxonomy = await findTaxonomy(latinName);
      if (!taxonomy) throw new Error('Taxonomy not found');

      const speciesName = `${taxonomy.species[0]}. ${taxonomy.species.split(/\s/).at(-1) || ''}`;
      setClassification([ ...Object.values(taxonomy).slice(0, -1), speciesName ]);

      const officialCards = await findOfficialCards(taxonomy.species, taxonomy.genus, taxonomy.family, taxonomy.order);
      setOfficialCards(officialCards);

      const fanmadeCards = await findFanmadeCards(latinName, speciesName);
      setFanmadeCards(fanmadeCards);

      const wikidata = await getWikiData(latinName);
      setWikiData(wikidata);
    },
    [setClassification, setFanmadeCards, setOfficialCards, setWikiData]
  );

  return { formRef, formValues, handleChange, handleValidateLatinName, };
};

export default useCardMakerForm;
