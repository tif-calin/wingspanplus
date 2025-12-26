import { styled } from '@linaria/react';
import React from 'react';
import InfoSection from './InfoSection';
import Taxonomy from './Taxonomy';
import StyledExternalLink from '~/components/ExternalLink';
import { Fragment } from 'react';
import type getWikiData from '~/utils/services/wikidata';
import type { FanmadeBirdRow, OfficialBirdRow } from '~/data/official-birds';

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

interface Props {
  classification: string[];
  matchingFanmadeCards: FanmadeBirdRow[];
  officialCardsByRank: Record<string, OfficialBirdRow[]>;
  wikidataIdentifiers: Awaited<ReturnType<typeof getWikiData>>['identifiers'];
};

/**
 * This contains all the informational sections of the card maker. It doesn't include any of the
 * actual form inputs.
 */
const ResearchHelpSection = (
  {
    classification,
    officialCardsByRank,
    matchingFanmadeCards,
    wikidataIdentifiers,
  }: Props
) => {
  const fanmadeCount = matchingFanmadeCards.length;

  return (
    <>
      <Taxonomy classification={classification} />
      {!!wikidataIdentifiers.length && (
        <InfoSection title={`external links`}>
          <ExternalLinksList>
            {wikidataIdentifiers.map(link => (
              <li key={link.id}>
                <StyledExternalLink href={link.url}>{link.title}</StyledExternalLink>
                {' '}<span>{link.desc}</span>
              </li>
            ))}
          </ExternalLinksList>
        </InfoSection>
      )}
      {!!officialCardsByRank && (
        Object.entries(officialCardsByRank).map(([taxonRank, cards], i) => {
          const pluralizedNoun = cards.length === 1 ? 'card' : 'cards';
          const displayLabel = `${cards.length}${i ? ' more ' : ' '}official ${pluralizedNoun} from the same ${taxonRank}`;

          return (
            <InfoSection key={taxonRank} title={displayLabel}>
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
      {!!fanmadeCount && (
        <InfoSection title={`${fanmadeCount} fan-made card${fanmadeCount === 1 ? '' : 's'}`}>
          {matchingFanmadeCards.map((card, i) => (
            <Fragment key={card.latin + card.date}>
              <StyledExternalLink href={card.source}>{card.common}</StyledExternalLink>
              {' '}by {card.author}
              {i < fanmadeCount - 1 ? ', ' : ''}
            </Fragment>
          ))}
        </InfoSection>
      )}
    </>
  );
};

export default React.memo(ResearchHelpSection);
