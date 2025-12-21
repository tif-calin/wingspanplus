import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from '../WingspanCard';
import { memo, useId, useMemo, useState } from 'react';
import Button from '~/components/forms/Button';
import { css } from '@linaria/core';
import useCardMakerForm from './useCardMakerForm';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import type getWikiData from '~/utils/http/getWikiData';
import FormGridLayout from '~/components/forms/FormGridLayout';
import Select from '~/components/forms/Select';
import DownloadButton from '../DownloadButton';
import SwitchDock from '~/components/forms/SwitchDock';
import { POWER_COLOR_LOOKUP } from '../WingspanCard/Power';
import ResearchHelpSection from './ResearchHelpSection';

const buttonStyles = css`
  align-self: flex-end;
  background-color: hsl(178, 43%, 40%);
  color: white;
  width: fit-content;

  &:hover {
    background-color: #6bc4c1;
  }
`;

const Container = styled.div`
  font-size: 1rem;
  display: flex;
   gap: 1rem;
  width: 100%;
`;

const Preview = styled.output`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormWrapper = styled.form`
  --black: #273f3f;
  --offwhite: #fcfcfc;

  background-color: var(--offwhite);
  border: 2px solid var(--black);
   border-radius: 0.15rem;
  box-shadow: var(--shadow-elevation-medium), 0 0 2px hsl(var(--shadow-color));
  height: 100%;
  padding: 1rem;
  position: relative;
   flex-grow: 1;
   gap: 0.75rem;

  display: flex;
   flex-direction: column;
`;

const HABITAT_OPTIONS = [
  { value: 'forest', label: 'Forest' },
  { value: 'grassland', label: 'Grassland' },
  { value: 'wetland', label: 'Wetland' },
] as const;

const NEST_OPTIONS = [
  { value: 'bowl', label: 'Bowl' },
  { value: 'cavity', label: 'Cavity' },
  { value: 'ground', label: 'Ground' },
  { value: 'platform', label: 'Platform' },
  { value: 'star', label: 'Star' },
  { value: 'null', label: 'No Nest' },
];

const POWER_KIND_OPTIONS = Object.keys(POWER_COLOR_LOOKUP).map(kind => ({ value: kind, label: kind }));

const CardMakerForm = () => {
  const [classification, setClassification] = useState<string[]>([]);
  const [officialCards, setOfficialCards] = useState<Record<string, OfficialBirdRow[]>>();
  const [fanmadeCards, setFanmadeCards] = useState<FanmadeBirdRow[]>();
  const [wikiData, setWikiData] = useState<Awaited<ReturnType<typeof getWikiData>>>();

  const {
    formRef,
    formValues,
    handleChange,
    handleValidateLatinName
  } = useCardMakerForm({
    setClassification,
    setOfficialCards,
    setFanmadeCards,
    setWikiData,
  });

  const habitatOptions = useMemo(() => HABITAT_OPTIONS.map(opt => ({
    ...opt,
    defaultChecked: formValues[opt.value],
  })), [formValues]);

  const isValid = classification.length > 1;

  const id = useId();

  return (
    <Container>
      <Preview>
        <WingspanCard id={id} {...formValues} />
        <DownloadButton elementId={id} fileName={formValues.nameCommon} />
        <Button>Save to Gallery</Button>
      </Preview>
      <FormWrapper onChange={handleChange} action={console.log} ref={formRef}>
        <Input
          defaultValue={formValues.nameLatin}
          kind="text"
          label="Latin Name"
          name="nameLatin"
          status={isValid ? "success" : undefined}
          type="text"
        />
        <Button className={buttonStyles} type="button" onClick={handleValidateLatinName}>Validate &rarr;</Button>
        <ResearchHelpSection
          classification={classification}
          matchingFanmadeCards={fanmadeCards || []}
          officialCardsByRank={officialCards || {}}
          wikidataIdentifiers={wikiData?.identifiers || []}
        />
        {isValid && (
          <>
            <br />
            <FormGridLayout>
              <Input
                kind="text"
                label="Common Name"
                name="nameCommon"
                type="text"
                value={formValues.nameCommon}
              />
              <SwitchDock label="Habitat" options={habitatOptions} gridSpan={6} />
              <Input
                gridSpan={6}
                kind="text"
                label="Food Cost"
                name="foodCost"
                type="text"
                value={formValues.foodCost}
              />
              <Input
                gridSpan={4}
                kind="number"
                label="Victory Points"
                max="9"
                min="0"
                name="victoryPoints"
                type="number"
                value={formValues.victoryPoints}
              />
              <Select
                gridSpan={4}
                label="Nest Kind"
                name="nestKind"
                options={NEST_OPTIONS}
                value={`${formValues.nestKind}`}
              />
              <Input
                disabled={formValues.nestKind === null}
                gridSpan={4}
                kind="number"
                label="Egg Capacity"
                max="6"
                min="1"
                name="eggCapacity"
                status={formValues.nestKind === null ? 'disabled' : undefined}
                type="number"
                value={formValues.eggCapacity}
              />
              <Input
                kind="number"
                label="Wingspan"
                name="wingspan"
                type="number"
                value={formValues.wingspan}
              />
              <Select
                gridSpan={4}
                label="Power Kind"
                name="power.kind"
                options={POWER_KIND_OPTIONS}
                value={`${formValues.power?.kind}`}
              />
              <Input
                gridSpan={8}
                kind="textarea"
                label="Power Text"
                name="power.text"
                value={formValues.power?.text}
              />
              <Input
                kind="textarea"
                label="Flavor Text"
                name="flavor"
                value={formValues.flavor}
              />
            </FormGridLayout>
          </>
        )}
      </FormWrapper>
    </Container>
  );
};

export default memo(CardMakerForm);
