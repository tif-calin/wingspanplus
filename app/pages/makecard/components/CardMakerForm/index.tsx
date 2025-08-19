import { styled } from '@linaria/react';
import Input from '~/components/forms/Input';
import WingspanCard from '../WingspanCard';
import { Fragment, memo, useState, type ComponentProps } from 'react';
import Button from '~/components/forms/Button';
import Taxonomy from '../CardMakerForm/Taxonomy';
import { css } from '@linaria/core';
import useCardMakerForm from './useCardMakerForm';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';
import InfoSection from './InfoSection';

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
  height: 100%;
  padding: 1rem;
  position: relative;
   flex-grow: 1;
   gap: 0.75rem;

  display: flex;
   flex-direction: column;
`;

const DEFAULT_VALUES: ComponentProps<typeof WingspanCard> = {
  eggCapacity: 3,
  flavor: 'Gadwalls are known for their ability to steal food from diving ducks.',
  foodCost: '[fish] + [fish]',
  habitats: ['wetland'],
  nameCommon: 'Gadwall',
  nameLatin: "Mareca strepera",
  nestKind: "ground",
  photo: { url: 'https://inaturalist-open-data.s3.amazonaws.com/photos/395500578/original.jpg', removeBg: true, scale: 1.2, translateX: 10, translateY: -5 },
  power: { kind: 'WHEN ACTIVATED', text: 'Choose 1 other player. You both draw 1 [card] from the deck.' },
  victoryPoints: 5,
  wingspan: 25
}

const CardMakerForm = () => {
  const [classification, setClassification] = useState<string[]>([]);
  const [officialCards, setOfficialCards] = useState<Record<string, OfficialBirdRow[]>>();
  const [fanmadeCards, setFanmadeCards] = useState<FanmadeBirdRow[]>();

  const { handleValidateLatinName } = useCardMakerForm({
    setClassification,
    setOfficialCards,
    setFanmadeCards
  });

  return (
    <Container>
      <Preview>
        <WingspanCard {...DEFAULT_VALUES} />
      </Preview>
      <FormWrapper action={console.log}>
        <Input inputType="text" fieldName="nameLatin" fieldTitle="Latin Name" />
        <Button className={buttonStyles} type="button" onClick={handleValidateLatinName}>validate &rarr;</Button>
        <Taxonomy classification={classification} />
        {!!officialCards && (
          Object.entries(officialCards).map(([label, cards], i) => {
            const pluralizedNoun = cards.length === 1 ? 'card' : 'cards';
            const displayLabel = `${cards.length}${i ? ' more ' : ' '}official ${pluralizedNoun} from the same ${label}`;

            return (
              <InfoSection key={label} title={displayLabel}>
                {cards.map((card, i) => (
                  <a style={{ fontStyle: 'italic' }} key={card.acceptedName} href={card.wingsearchLink}>{card.acceptedName}{i < cards.length - 1 ? ', ' : ''}</a>
                ))}
              </InfoSection>
            );
          })
        )}
        {!!fanmadeCards?.length && (
          <InfoSection title={`${fanmadeCards.length} fan-made cards`}>
            {fanmadeCards.map((card, i) => (
              <Fragment key={card.latin}>
                <a href={card.source}>{card.common}</a>
                {' '}by {card.author}
                {i < fanmadeCards.length - 1 ? ', ' : ''}
              </Fragment>
            ))}
          </InfoSection>
        )}
        {/* <Input inputType="text" fieldName="nameCommon" fieldTitle="Common Name" /> */}
      </FormWrapper>
    </Container>
  );
};

export default memo(CardMakerForm);
