import { useCallback, useMemo, useRef, useState, type ComponentProps, type Dispatch, type DOMAttributes, type FormEventHandler, type SetStateAction } from 'react';
import { deepMerge } from '~/utils/objects';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import getWikiData from '~/utils/http/getWikiData';
import type { DeepPartial } from '~/utils/utilityTypes';
import type WingspanCard from '../WingspanCard';
import { constructRecommendedValues } from '../../hooks/useCardMakerForm/utils';
import { BLANK_CARD } from './default-cards';

type UseCardMakerFormParams = {
  setClassification: Dispatch<SetStateAction<string[]>>;
  setFanmadeCards: Dispatch<SetStateAction<FanmadeBirdRow[] | undefined>>;
  setOfficialCards: Dispatch<SetStateAction<Record<string, OfficialBirdRow[]> | undefined>>;
  setWikiData: Dispatch<SetStateAction<Awaited<ReturnType<typeof getWikiData>> | undefined>>;
};

const useCardMakerForm = ({
  setClassification,
  setFanmadeCards,
  setOfficialCards,
  setWikiData,
}: UseCardMakerFormParams) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [editedValues, setEditedValues] = useState<Partial<ComponentProps<typeof WingspanCard>>>({});
  const [recommendedValues, setRecommendedValues] = useState<Partial<ComponentProps<typeof WingspanCard>>>({});

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

    setEditedValues(oldVals => deepMerge(oldVals, newFormValues));
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const formValues = useMemo(
    () => {
      return deepMerge(BLANK_CARD, deepMerge(recommendedValues, editedValues));
    },
    [editedValues, recommendedValues]
  );

  const handleValidateLatinName = useCallback<NonNullable<DOMAttributes<HTMLButtonElement>['onClick']>>(
    async (ev) => {
      const form = ev.currentTarget.form;
      if (!form) throw new Error('Form not found');

      const formData = new FormData(form);
      const latinName = formData.get('nameLatin');
      if (typeof latinName !== 'string') throw new Error('Invalid Latin name');

      const {
        classification,
        fanmadeCards,
        officialCards,
        recommendedValues,
        wikidata
      } = await constructRecommendedValues(latinName);
      setClassification(classification);
      setFanmadeCards(fanmadeCards);
      setOfficialCards(officialCards);
      setWikiData(wikidata);
      setRecommendedValues(recommendedValues);

      // const mergedVals = flattenObject(deepMerge(recommendedValues, editedValues));
      // Object.entries(mergedVals).forEach(([key, newVal]) => {
      //   console.log(key, newVal);
      //   const input = form.querySelector(`[name="${key}"]`);
      //   console.log(input);
      //   if (input) input.value = JSON.stringify(newVal);
      //   formData.set(key, JSON.stringify(newVal));
      // });
    },
    [setClassification, setFanmadeCards, setOfficialCards, setWikiData]
  );

  return { formRef, formValues, handleChange, handleValidateLatinName, };
};

export default useCardMakerForm;
