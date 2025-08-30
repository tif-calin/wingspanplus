import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from '../WingspanCard';
import { Fragment, memo, useState } from 'react';
import Button from '~/components/forms/Button';
import Taxonomy from '../CardMakerForm/Taxonomy';
import { css } from '@linaria/core';
import useCardMakerForm from './useCardMakerForm';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import InfoSection from './InfoSection';
import type getWikiData from '~/utils/http/getWikiData';
import StyledExternalLink from '~/components/ExternalLink';
import FormGridLayout from '~/components/forms/FormGridLayout';
import Select from '~/components/forms/Select';

const buttonStyles = css`
  align-self: flex-end;
  background-color: hsl(178, 43%, 40%);
  color: white;
  font-weight: 700;
  transition: background-color 0.2s ease;
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

const Preview = styled.output``;

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

const ExternalLinksList = styled.ul`
  display: flex;
  padding: 0;
   padding-left: 1rem;
  flex-wrap: wrap;
  gap: 0 0.5rem;

  & > li {
    width: calc(50% - 1rem);

    & > span:last-child {
      font-weight: 100;

      &::before { content: '(' }
      &::after { content: ')' }
    }
  }
`;

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

  const isValid = classification.length > 1;

  return (
    <Container>
      <Preview>
        <WingspanCard {...formValues} />
      </Preview>
      <FormWrapper onChange={handleChange} action={console.log} ref={formRef}>
        <Input
          inputType="text"
          fieldName="nameLatin"
          fieldTitle="Latin Name"
          defaultValue={formValues.nameLatin}
          status={isValid ? "success" : undefined}
        />
        <Button className={buttonStyles} type="button" onClick={handleValidateLatinName}>validate &rarr;</Button>
        <Taxonomy classification={classification} />
        {!!wikiData?.identifiers.length && (
          <InfoSection title={`external links`}>
            <ExternalLinksList>
              {wikiData.identifiers.map(link => (
                <li key={link.id}>
                  <StyledExternalLink href={link.url}>{link.title}</StyledExternalLink>
                  {' '}<span>{link.desc}</span>
                </li>
              ))}
            </ExternalLinksList>
          </InfoSection>
        )}
        {!!officialCards && (
          Object.entries(officialCards).map(([label, cards], i) => {
            const pluralizedNoun = cards.length === 1 ? 'card' : 'cards';
            const displayLabel = `${cards.length}${i ? ' more ' : ' '}official ${pluralizedNoun} from the same ${label}`;

            return (
              <InfoSection key={label} title={displayLabel}>
                {cards.map((card, i) => (
                  <StyledExternalLink style={{ fontStyle: 'italic' }} key={card.acceptedName} href={card.wingsearchLink}>
                    {card.acceptedName}
                    {i < cards.length - 1 ? ', ' : ''}
                  </StyledExternalLink>
                ))}
              </InfoSection>
            );
          })
        )}
        {!!fanmadeCards?.length && (
          <InfoSection title={`${fanmadeCards.length} fan-made card${fanmadeCards.length === 1 ? '' : 's'}`}>
            {fanmadeCards.map((card, i) => (
              <Fragment key={card.latin + card.date}>
                <StyledExternalLink href={card.source}>{card.common}</StyledExternalLink>
                {' '}by {card.author}
                {i < fanmadeCards.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </InfoSection>
        )}
        {isValid && (
          <>
            <br />
            <FormGridLayout>
              <Input inputType="text" fieldName="nameCommon" fieldTitle="Common Name" defaultValue={formValues.nameCommon} />
              {/* TODO: Habitat checkbox select */}
              <Input inputType="text" fieldName="foodCost" fieldTitle="Food Cost" defaultValue={formValues.foodCost} />
              <Input
                gridSpan={4}
                inputType="number"
                fieldName="victoryPoints"
                fieldTitle="Victory Points"
                defaultValue={formValues.victoryPoints}
                min="0"
                max="9"
              />
              {/* TODO: nest kind drop down */}
              <Select gridSpan={4} name="nestKind" fieldTitle="Nest Kind" options={[
                { value: 'bowl', label: 'Bowl' },
                { value: 'cavity', label: 'Cavity' },
                { value: 'ground', label: 'Ground' },
                { value: 'platform', label: 'Platform' },
                { value: 'star', label: 'Star' },
                { value: 'null', label: 'No Nest' },
              ]} />
              <Input
                gridSpan={4}
                inputType='number'
                fieldName="eggCapacity"
                fieldTitle="Egg Capacity"
                defaultValue={formValues.eggCapacity}
                min="1" // TODO: disable when nestKind is NONE
                max="6"
              />
              <Input inputType='number' fieldName="wingspan" fieldTitle="Wingspan" defaultValue={formValues.wingspan} />
              {/* TODO: power textarea */}
              {/* TODO: flavor textarea */}
            </FormGridLayout>
          </>
        )}
      </FormWrapper>
    </Container>
  );
};

export default memo(CardMakerForm);
