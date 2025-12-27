import { styled } from '@linaria/react';
import Icon from '../Icon';
import type { NestEnum } from '../../types';

const Wrapper = styled.div`
  display: flex;
   align-items: center;
   flex-direction: column;
   gap: 0.5mm;
  margin-left: 3.75mm;
  min-width: 5.25mm;
  padding-top: 8.5mm;
  position: absolute;
   left: 0;
  height: 100%;
  z-index: 2;

  & picture {
    width: 5.25mm;
  }

  & .victory-points {
    position: relative;
    font-family: var(--fnt-hand);
    font-size: 2.1em;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 3mm;
    width: 100%;

    & > picture {
      position: absolute;
      top: -1.5mm;
      right: -1.25mm;
      bottom: 0;

      & img {
        height: 9.9mm;
      }
    }
  }

  & .eggs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75mm;

    & > * { display: inline; width: 1.7mm; }
  }

  & .fan-made-disclaimer {
    position: absolute;
     bottom: 0;
     left: 0;
    height: 5.25mm;
  }
`;

type Props = {
  eggCapacity: number;
  nestKind: `${NestEnum}` | null;
  victoryPoints: number;
};

const LeftSideBarInfo = ({ eggCapacity, nestKind, victoryPoints }: Props) => {

  return (
    <Wrapper className='floating-element'>
      <div className="victory-points">
        {victoryPoints}
        <Icon icon="point" altText="feather for victory points" />
      </div>
      {!!nestKind && (
        <>
          <div className="nest">
            <Icon altText="nest" icon={nestKind} />
          </div>
          <div className="eggs">
            {Array.from({ length: Math.min(100, eggCapacity) }, (_, i) => (
              <Icon key={i} altText="egg" icon="smallegg" />
            ))}
          </div>
        </>
      )}
      <div className="fan-made-disclaimer">
        <Icon icon="fan-made" altText="fan-made icon" />
      </div>
    </Wrapper>
  );
};

export default LeftSideBarInfo;
