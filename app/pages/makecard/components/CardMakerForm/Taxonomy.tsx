import { styled } from '@linaria/react';
import { OFFICIAL_BIRDS_DATA } from '~/data/official-birds';

const StyledTaxonomy = styled.span`
  font-size: 0.8rem;
  line-height: 1;

  & > *:first-child {
    font-size: 1rem;
    font-weight: bold;
    width: 100%;
  }
`;

type Props = {
  classification: string[];
};

console.log('OFFICIAL_BIRDS_DATA', OFFICIAL_BIRDS_DATA);

const Taxonomy = ({ classification }: Props) => {
  return classification.length ? (
    <StyledTaxonomy>
      <div>taxonomy:</div>
      {classification.map((name, index) => {
        const isLast = index === classification.length - 1;

        return (
          <span key={name} style={isLast ? { fontStyle: 'italic' } : {}}>{name}{isLast ? '' : ' > '}</span>
        );
      })}
    </StyledTaxonomy>
  ) : null;
};

export default Taxonomy;
