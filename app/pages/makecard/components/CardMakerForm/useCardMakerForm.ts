import { useCallback, useRef, useState, type ComponentProps, type Dispatch, type DOMAttributes, type FormEventHandler, type SetStateAction } from 'react';
import { matchLatinName } from '../../utils/http/checklistbank';
import { deepMerge, filterObject, objectFromEntries } from '~/utils/objects';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import getWikiData from '~/utils/http/getWikiData';
import type WingspanCard from '../WingspanCard';
import type { DeepPartial } from '~/utils/utilityTypes';
import { DEFAULT_CARDS } from './default-cards';
import type WingspanCard from '../WingspanCard';
import { constructRecommendedValues, constructTaxonomy, findFanmadeCards, findOfficialCards } from '../../hooks/useCardMakerForm/utils';

type UseCardMakerFormParams = {
  setClassification: Dispatch<SetStateAction<string[]>>;
  setFanmadeCards: Dispatch<SetStateAction<FanmadeBirdRow[] | undefined>>;
  setOfficialCards: Dispatch<SetStateAction<Record<string, OfficialBirdRow[]> | undefined>>;
  setWikiData: Dispatch<SetStateAction<Awaited<ReturnType<typeof getWikiData>> | undefined>>;
};

const defaultOfTheDay = DEFAULT_CARDS[(new Date().getDate()) % DEFAULT_CARDS.length];

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
    let editedVal: string | number | boolean | null = inputElement.value;
    if (inputElement.type === 'number') editedVal = Number(inputElement.value);
    if ('checked' in inputElement && inputElement.type === 'checkbox') editedVal = inputElement.checked;
    if (editedVal === 'null') editedVal = null;

    const newFormValues = editedKey.split('.').reverse().reduce((acc, currKey) => ({ [currKey]: acc }), editedVal as DeepPartial<typeof formValues>);

    setFormValues(deepMerge(formValues, deepMerge(recommendedValues, newFormValues)));
  }, [formValues, recommendedValues]);

  const handleValidateLatinName = useCallback<NonNullable<DOMAttributes<HTMLButtonElement>['onClick']>>(
    async (ev) => {
      const form = ev.currentTarget.form;
      if (!form) throw new Error('Form not found');

      const formData = new FormData(form);
      const latinName = formData.get('nameLatin');
      if (typeof latinName !== 'string') throw new Error('Invalid Latin name');

      const taxonomy = await constructTaxonomy(latinName);
      if (!taxonomy) throw new Error('Taxonomy not found');

      const speciesName = `${taxonomy.species[0]}. ${taxonomy.species.split(/\s/).at(-1) || ''}`;
      setClassification([ ...Object.values(taxonomy).slice(0, -1), speciesName ]);

      const officialCards = await findOfficialCards(taxonomy.species, taxonomy.genus, taxonomy.family, taxonomy.order);
      setOfficialCards(officialCards);

      const fanmadeCards = await findFanmadeCards(latinName, speciesName);
      setFanmadeCards(fanmadeCards);

      const wikidata = await getWikiData(latinName);
      setWikiData(wikidata);

      const recommendedValues = await constructRecommendedValues({
        avibaseId: wikidata.identifiers.find(id => id.propertyId === 'P2026')?.id || '',
      });
      setRecommendedValues(recommendedValues);
    },
    [setClassification, setFanmadeCards, setOfficialCards, setWikiData]
  );

  return { formRef, formValues, handleChange, handleValidateLatinName, };
};

export default useCardMakerForm;
