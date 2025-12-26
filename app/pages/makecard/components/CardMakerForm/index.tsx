import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from '../WingspanCard';
import { memo, useCallback, useMemo, useState, type ComponentProps } from 'react';
import Button from '~/components/forms/Button';
import { css } from '@linaria/core';
import useCardMakerForm from './useCardMakerForm';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import type getWikiData from '~/utils/services/wikidata';
import FormGridLayout from '~/components/forms/FormGridLayout';
import Select from '~/components/forms/Select';
import DownloadButton from '../DownloadButton';
import SwitchDock from '~/components/forms/SwitchDock';
import { POWER_COLOR_LOOKUP } from '../WingspanCard/Power';
import ResearchHelpSection from './ResearchHelpSection';
import PhotoSelector from './PhotoSelector';

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

type Props = {
  id: string
  onSave: (newVals: ComponentProps<typeof WingspanCard>) => void;
  savedValues: ComponentProps<typeof WingspanCard>;
};

const CardMakerForm = ({ id, onSave, savedValues }: Props) => {
  const [classification, setClassification] = useState<string[]>([]);
  const [officialCards, setOfficialCards] = useState<Record<string, OfficialBirdRow[]>>();
  const [fanmadeCards, setFanmadeCards] = useState<FanmadeBirdRow[]>();
  const [wikiData, setWikiData] = useState<Awaited<ReturnType<typeof getWikiData>>>();

  const {
    formRef,
    formValues,
    handleChange,
    handleValidateLatinName,
    recommendedValues,
  } = useCardMakerForm({
    savedValues,
    setClassification,
    setOfficialCards,
    setFanmadeCards,
    setWikiData,
  });

  const handleSave = useCallback(() => onSave(formValues), [formValues, onSave]);

  const habitatOptions = useMemo(() => HABITAT_OPTIONS.map(opt => ({
    ...opt,
    defaultChecked: formValues[opt.value],
  })), [formValues]);

  const isValid = classification.length > 1;

  return (
    <Container>
      <Preview>
        <WingspanCard id={id} {...formValues} />
        <DownloadButton elementId={id} fileName={formValues.nameCommon || id} />
        <Button onClick={handleSave}>Save to Gallery</Button>
      </Preview>
      <FormWrapper autoComplete='off' onChange={handleChange} action={console.log} ref={formRef}>
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
                key={'nameCommon' + recommendedValues.nameCommon}
                defaultValue={formValues.nameCommon}
              />
              <SwitchDock label="Habitat" options={habitatOptions} gridSpan={6} />
              <Input
                gridSpan={6}
                kind="text"
                label="Food Cost"
                name="foodCost"
                type="text"
                key={'foodCost' + recommendedValues.foodCost}
                defaultValue={formValues.foodCost}
              />
              <Input
                defaultValue={formValues.victoryPoints}
                gridSpan={4}
                key={'victoryPoints' + recommendedValues.victoryPoints}
                kind="number"
                label="Victory Points"
                max="9"
                min="0"
                name="victoryPoints"
                type="number"
              />
              <Select
                defaultValue={`${formValues.nestKind}`}
                gridSpan={4}
                key={'nestKind' + recommendedValues.nestKind}
                label="Nest Kind"
                name="nestKind"
                options={NEST_OPTIONS}
              />
              <Input
                defaultValue={formValues.eggCapacity}
                disabled={formValues.nestKind === null}
                gridSpan={4}
                key={'eggCapacity' + recommendedValues.eggCapacity}
                kind="number"
                label="Egg Capacity"
                max="6"
                min="1"
                name="eggCapacity"
                status={formValues.nestKind === null ? 'disabled' : undefined}
                type="number"
              />
              {formValues.photo && (
                <PhotoSelector
                  {...formValues.photo}
                  handleChange={handleChange}
                  inaturalistId={wikiData?.identifiers.find(id => id.propertyId === 'P3151')?.id || ''}
                />
              )}
              <Input
                kind="number"
                label="Wingspan"
                name="wingspan"
                type="number"
                key={'wingspan' + recommendedValues.wingspan}
                defaultValue={formValues.wingspan}
              />
              <Select
                defaultValue={`${formValues.power?.kind}`}
                gridSpan={4}
                key={'power.kind' + recommendedValues.power?.kind}
                label="Power Kind"
                name="power.kind"
                options={POWER_KIND_OPTIONS}
              />
              <Input
                gridSpan={8}
                kind="textarea"
                label="Power Text"
                name="power.text"
                key={'power.text' + recommendedValues.power?.text}
                defaultValue={formValues.power?.text}
              />
              <Input
                kind="textarea"
                label="Flavor Text"
                name="flavor"
                key={'flavor' + recommendedValues.flavor}
                defaultValue={formValues.flavor}
              />
            </FormGridLayout>
          </>
        )}
      </FormWrapper>
    </Container>
  );
};

export default memo(CardMakerForm);
